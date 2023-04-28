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

// Fetches dataset information from a SPARQL endpoint
export class SparqlFetcher {
  private endpointUrl: string;
  private fetcher = new SparqlEndpointFetcher();
  private lru = lru(10000);

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
        ?iri cc:hasQualityMeasurement ?measurement .
        ?measurement cc:value ?value ;
          cc:isMeasurementOf ?metric .
        ?metric cc:name ?name .
      }
      WHERE {
        VALUES ?iri { ${irisForValues.join(' ')} }
        ?iri a cc:Dataset ;
          cc:hasQualityMeasurement ?measurement .
        ?measurement cc:value ?value ;
          cc:isMeasurementOf ?metric .
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
}
