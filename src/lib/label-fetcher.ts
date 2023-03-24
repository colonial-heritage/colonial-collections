import arrayifyStream from 'arrayify-stream';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import LRUCache from 'lru-cache';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

const getByIdsOptionsSchema = z.object({
  ids: z.array(z.string().url()),
});

export type GetByIdsOptions = z.infer<typeof getByIdsOptionsSchema>;

export type Labels = Map<string, string | undefined>;

// Fetches labels of IDs (= URIs) from a SPARQL endpoint
export class LabelFetcher {
  private endpointUrl: string;
  private fetcher = new SparqlEndpointFetcher();
  private cache: LRUCache<string, string> = new LRUCache({max: 10000});

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);
    this.endpointUrl = opts.endpointUrl;
  }

  private getFetchableIds(ids: string[]) {
    // Remove duplicate IDs
    const uniqueIds = [...new Set(ids)];

    // Remove IDs already cached
    const uniqueAndUncachedIds = uniqueIds.filter(
      (id: string) => !this.cache.has(id)
    );

    return uniqueAndUncachedIds;
  }

  private async fetchAndCacheLabels(ids: string[]) {
    if (ids.length === 0) {
      return; // No IDs to fetch
    }

    // TBD: make the predicates configurable
    const queryConditions = ids.map((id: string) => {
      return `{
        BIND(<${id}> AS ?id)
        ?id cc:name ?label
      }`;
    });

    const query = `PREFIX cc: <https://colonialcollections.nl/search#>
      SELECT ?id ?label WHERE {
        ${queryConditions.join(' UNION ')}
      }`;

    const bindingsStream = await this.fetcher.fetchBindings(
      this.endpointUrl,
      query
    );

    const bindings = await arrayifyStream(bindingsStream);
    for (const binding of bindings) {
      // TBD: set a TTL for each entry
      this.cache.set(binding.id.value, binding.label.value);
    }
  }

  async getByIds(options: GetByIdsOptions): Promise<Labels> {
    const opts = getByIdsOptionsSchema.parse(options);

    const fetchableIds = this.getFetchableIds(opts.ids);

    // TBD: the endpoint could limit its results if we request
    // a large number of IDs at once. Split the IDs into chunks
    // of e.g. 1000 IDs and call the endpoint per chunk?
    await this.fetchAndCacheLabels(fetchableIds);

    // Return only the labels of the requested IDs, not all cached labels
    const labels: Labels = new Map();
    for (const id of opts.ids) {
      labels.set(id, this.cache.get(id));
    }

    return labels;
  }
}
