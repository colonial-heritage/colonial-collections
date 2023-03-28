import {IBindings, SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import {isIri} from './iri';
import LRUCache from 'lru-cache';
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

/*
  Fetches labels of IRIs from a SPARQL endpoint. Usage example:

  const labelFetcher = new LabelFetcher({endpointUrl: 'https://...'});
  await labelFetcher.loadByIris({iris: ['https://example.org/123']});
  const label = labelFetcher.getByIri({iri: ['https://example.org/123']});
*/
export class LabelFetcher {
  private endpointUrl: string;
  private fetcher = new SparqlEndpointFetcher();
  private cache: LRUCache<string, string> = new LRUCache({max: 10000});

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);
    this.endpointUrl = opts.endpointUrl;
  }

  private getFetchableIris(iris: string[]) {
    // Remove duplicate IRIs
    const uniqueIris = [...new Set(iris)];

    // Remove invalid IRIs and IRIs already cached
    const validAndUncachedIris = uniqueIris.filter(
      (iri: string) => isIri(iri) && !this.cache.has(iri)
    );

    return validAndUncachedIris;
  }

  private async fetchAndCacheLabels(iris: string[]) {
    if (iris.length === 0) {
      return; // No IRIs to fetch
    }

    // TODO: make the predicates configurable
    const queryConditions = iris.map((iri: string) => {
      return `{
        BIND(<${iri}> AS ?iri)
        ?iri cc:name ?label
      }`;
    });

    const query = `PREFIX cc: <https://colonialcollections.nl/search#>
      SELECT ?iri ?label WHERE {
        ${queryConditions.join(' UNION ')}
      }`;

    // The endpoint throws a 400 error if an IRI is not valid
    const bindingsStream = await this.fetcher.fetchBindings(
      this.endpointUrl,
      query
    );

    for await (const rawBindings of bindingsStream) {
      const bindings = rawBindings as unknown as IBindings; // TS assumes it's a string or Buffer
      this.cache.set(bindings.iri.value, bindings.label.value);
    }
  }

  // TBD: add an option for a locale, for loading the labels in a specific language?
  async loadByIris(options: LoadByIrisOptions) {
    const opts = loadByIrisOptionsSchema.parse(options);

    const fetchableIRIs = this.getFetchableIris(opts.iris);

    // TBD: the endpoint could limit its results if we request
    // a large number of IRIs at once. Split the IRIs into chunks
    // of e.g. 1000 IRIs and call the endpoint per chunk?
    try {
      await this.fetchAndCacheLabels(fetchableIRIs);
    } catch (err) {
      console.error(err); // TODO: add logger
    }
  }

  // TBD: add an option for a locale, for getting the label in a specific language?
  getByIri(options: GetByIriOptions) {
    const opts = getByIriOptionsSchema.parse(options);
    return this.cache.get(opts.iri);
  }
}
