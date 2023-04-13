import {IBindings, SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import {isIri} from '@/lib/iri';
import {LRUCache} from 'lru-cache';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

const loadByIrisOptionsSchema = z.object({
  iris: z.array(z.string()),
  predicates: z.array(z.string()),
});

export type LoadByIrisOptions = z.infer<typeof loadByIrisOptionsSchema>;

const getByIriOptionsSchema = z.object({
  iri: z.string(),
});

export type GetByIriOptions = z.infer<typeof getByIriOptionsSchema>;

const cacheValueIfIriNotFound = Symbol('cacheValueIfIriNotFound');

// Fetches labels of IRIs from a SPARQL endpoint
export class LabelFetcher {
  private endpointUrl: string;
  private fetcher = new SparqlEndpointFetcher();
  private cache: LRUCache<string, string | typeof cacheValueIfIriNotFound> =
    new LRUCache({max: 10000});

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

  private async fetchAndCacheLabels(options: LoadByIrisOptions) {
    const {iris, predicates} = options;

    if (iris.length === 0) {
      return; // No IRIs to fetch
    }

    // This returns multiple labels per IRI if multiple predicates match
    const predicate = predicates.map(predicate => `<${predicate}>`).join('|');

    // TBD: add an option for a locale, for filtering the labels in a specific language?
    const queryConditions = iris.map((iri: string) => {
      return `{
        BIND(<${iri}> AS ?iri)
        ?iri ${predicate} ?label
      }`;
    });

    const query = `
      SELECT ?iri ?label WHERE {
        ${queryConditions.join(' UNION ')}
      }`;

    // The endpoint throws an error if an IRI is not valid
    const bindingsStream = await this.fetcher.fetchBindings(
      this.endpointUrl,
      query
    );

    for await (const rawBindings of bindingsStream) {
      const bindings = rawBindings as unknown as IBindings; // TS assumes it's a string or Buffer
      this.cache.set(bindings.iri.value, bindings.label.value);
    }

    // Also cache IRIs not found by the endpoint; otherwise these will
    // be fetched again and again on subsequent requests
    const irisNotFound = iris.filter(iri => !this.cache.has(iri));
    irisNotFound.forEach(iri => this.cache.set(iri, cacheValueIfIriNotFound));
  }

  async loadByIris(options: LoadByIrisOptions) {
    const opts = loadByIrisOptionsSchema.parse(options);

    const fetchableIris = this.getFetchableIris(opts.iris);

    // TBD: the endpoint could limit its results if we request
    // a large number of IRIs at once. Split the IRIs into chunks
    // of e.g. 1000 IRIs and call the endpoint per chunk?
    try {
      await this.fetchAndCacheLabels({
        iris: fetchableIris,
        predicates: opts.predicates,
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
