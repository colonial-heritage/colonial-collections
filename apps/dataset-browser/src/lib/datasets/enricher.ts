import {Dataset, Measurement} from '.';
import {isIri} from '@colonial-collections/iris';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import type {Readable} from 'node:stream';
import {lru, LRU} from 'tiny-lru';
import type {Stream} from '@rdfjs/types';
import {RdfObjectLoader, Resource} from 'rdf-object';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type EnricherConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

const loadByIrisOptionsSchema = z.object({
  iris: z.array(z.string()),
});

export type LoadByIrisOptions = z.infer<typeof loadByIrisOptionsSchema>;

const getByIriOptionsSchema = z.object({
  iri: z.string(),
});

export type GetByIriOptions = z.infer<typeof getByIriOptionsSchema>;

const cacheValueIfIriNotFound = Symbol('cacheValueIfIriNotFound');

export type PartialDataset = Pick<Dataset, 'id' | 'measurements'>;

// Fetches data from a SPARQL endpoint for enriching datasets
export class DatasetEnricher {
  private endpointUrl: string;
  private fetcher = new SparqlEndpointFetcher();
  private cache: LRU<PartialDataset | typeof cacheValueIfIriNotFound> =
    lru(1000); // TBD: make the max configurable?

  constructor(options: EnricherConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);
    this.endpointUrl = opts.endpointUrl;
  }

  private getFetchableIris(iris: string[]) {
    // Remove duplicate IRIs
    const uniqueIris = [...new Set(iris)];

    // Remove invalid IRIs and IRIs already cached
    const validAndUncachedIris = uniqueIris.filter(
      (iri: string) => isIri(iri) && this.cache.get(iri) === undefined
    );

    return validAndUncachedIris;
  }

  private async fetchByIris(iris: string[]) {
    if (iris.length === 0) {
      return; // No IRIs to fetch
    }

    const irisForValues = iris.map((iri: string) => `<${iri}>`);

    // Query can be expanded to also include other properties
    const query = `
      PREFIX cc: <https://colonialcollections.nl/search#>

      CONSTRUCT {
        ?iri cc:measurement ?measurement .
        ?measurement cc:value ?value ;
          cc:measurementOf ?metric .
        ?metric cc:name ?name ;
          cc:order ?order .
      }
      WHERE {
        VALUES ?iri { ${irisForValues.join(' ')} }
        ?iri a cc:Dataset ;
          cc:measurement ?measurement .
        ?measurement cc:value ?value ;
          cc:measurementOf ?metric .
        ?metric cc:name ?name ;
          cc:order ?order .
      }
    `;

    // The endpoint throws an error if an IRI is not valid
    const stream = await this.fetcher.fetchTriples(this.endpointUrl, query);

    return stream;
  }

  private processResource(rawDataset: Resource) {
    const rawMeasurements = rawDataset.properties['cc:measurement'];
    const measurements = rawMeasurements.map(rawMeasurement => {
      const measurementValue = rawMeasurement.property['cc:value'];
      const metric = rawMeasurement.property['cc:measurementOf'];
      const metricName = metric.property['cc:name'];
      const metricOrder = metric.property['cc:order'];

      const measurement: Measurement = {
        id: rawMeasurement.value,
        value: measurementValue.value === 'true', // May need to support other data types at some point
        metric: {
          id: metric.value,
          name: metricName.value,
          order: +metricOrder.value,
        },
      };

      return measurement;
    });

    // Sort measurements by metric order
    measurements.sort((a, b) => a.metric.order - b.metric.order);

    const partialDataset: PartialDataset = {
      id: rawDataset.value,
      measurements,
    };

    return partialDataset;
  }

  private async processResponse(iris: string[], stream: Readable & Stream) {
    const loader = new RdfObjectLoader({
      context: {
        cc: 'https://colonialcollections.nl/search#',
      },
    });

    await loader.import(stream);

    iris.forEach(iri => {
      const rawDataset = loader.resources[iri];

      // Cache IRIs that don't belong to a resource; otherwise these
      // will be fetched again and again on subsequent requests
      if (rawDataset === undefined) {
        this.cache.set(iri, cacheValueIfIriNotFound);
      } else {
        const partialDataset = this.processResource(rawDataset);
        this.cache.set(iri, partialDataset);
      }
    });
  }

  async loadByIris(options: LoadByIrisOptions) {
    const opts = loadByIrisOptionsSchema.parse(options);

    const iris = this.getFetchableIris(opts.iris);

    // TBD: the endpoint could limit its results if we request
    // a large number of IRIs at once. Split the IRIs into chunks
    // of e.g. 1000 IRIs and call the endpoint per chunk?
    try {
      const stream = await this.fetchByIris(iris);
      if (stream !== undefined) {
        await this.processResponse(iris, stream);
      }
    } catch (err) {
      console.error(err); // TODO: add logger
    }
  }

  getByIri(options: GetByIriOptions) {
    const opts = getByIriOptionsSchema.parse(options);
    const label = this.cache.get(opts.iri);
    return label !== cacheValueIfIriNotFound ? label : undefined;
  }
}
