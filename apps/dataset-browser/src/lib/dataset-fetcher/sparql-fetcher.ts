import {Dataset, Measurement} from '.';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import {lru} from 'tiny-lru';
import {RdfObjectLoader} from 'rdf-object';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

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

// Fetches dataset information from a SPARQL endpoint
export class SparqlFetcher {
  private endpointUrl: string;
  private fetcher = new SparqlEndpointFetcher();
  private cache = lru(10000);

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);
    this.endpointUrl = opts.endpointUrl;
  }

  private async fetchAndCacheData(options: LoadByIrisOptions) {
    const {iris} = options;

    if (iris.length === 0) {
      return; // No IRIs to fetch
    }

    const irisForValues = iris.map((iri: string) => `<${iri}>`);

    // Query can be expanded to also include other properties
    const query = `
      PREFIX cc: <https://colonialcollections.nl/search#>

      CONSTRUCT {
        ?iri a cc:Dataset ;
          cc:measurement ?measurement .
        ?measurement cc:value ?value ;
          cc:measurementOf ?metric .
        ?metric cc:name ?name .
      }
      WHERE {
        VALUES ?iri { ${irisForValues.join(' ')} }
        ?iri a cc:Dataset ;
          cc:measurement ?measurement .
        ?measurement cc:value ?value ;
          cc:measurementOf ?metric .
        ?metric cc:name ?name .
      }
    `;

    // The endpoint throws an error if an IRI is not valid
    const stream = await this.fetcher.fetchTriples(this.endpointUrl, query);

    const loader = new RdfObjectLoader({
      context: {
        cc: 'https://colonialcollections.nl/search#',
      },
    });
    await loader.import(stream);

    for (const iri of iris) {
      const rawDataset = loader.resources[iri];
      if (rawDataset === undefined) {
        this.cache.set(iri, cacheValueIfIriNotFound);
        continue;
      }

      const measurements: Measurement[] = [];
      const rawMeasurements = rawDataset.properties['cc:measurement'];
      for (const rawMeasurement of rawMeasurements) {
        const measurementValue = rawMeasurement.property['cc:value'];
        const metric = rawMeasurement.property['cc:measurementOf'];
        const metricName = metric.property['cc:name'];

        const measurement: Measurement = {
          id: rawMeasurement.value,
          value: measurementValue.value === 'true', // TODO
          metric: {
            id: metric.value,
            name: metricName.value,
          },
        };
        measurements.push(measurement);
      }

      const partialDataset: PartialDataset = {
        id: iri,
        measurements,
      };

      this.cache.set(iri, partialDataset);
    }
  }

  async loadByIris(options: LoadByIrisOptions) {
    const opts = loadByIrisOptionsSchema.parse(options);

    // TBD: the endpoint could limit its results if we request
    // a large number of IRIs at once. Split the IRIs into chunks
    // of e.g. 1000 IRIs and call the endpoint per chunk?
    try {
      await this.fetchAndCacheData({
        iris: opts.iris,
      });
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
