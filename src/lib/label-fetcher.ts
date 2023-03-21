import arrayifyStream from 'arrayify-stream';
import {SparqlEndpointFetcher} from 'fetch-sparql-endpoint';
import LRUCache from 'lru-cache';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

const searchOptionsSchema = z.object({
  ids: z.array(z.string().url()),
});

export type SearchOptions = z.infer<typeof searchOptionsSchema>;

export type Labels = Map<string, string | undefined>;

// Fetches labels of IDs from a SPARQL endpoint
export class LabelFetcher {
  private endpointUrl: string;
  private fetcher = new SparqlEndpointFetcher();
  private cache: LRUCache<string, string> = new LRUCache({max: 10000});

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);
    this.endpointUrl = opts.endpointUrl;
  }

  private getIdsToQuery(ids: string[]) {
    // Remove duplicate IDs
    const uniqueIds = [...new Set(ids)];

    // Remove IDs already cached
    const uniqueAndUncachedIds = uniqueIds.filter(
      (id: string) => !this.cache.has(id)
    );

    return uniqueAndUncachedIds;
  }

  // TBD: call this repeatedly if the endpoint limits its results?
  private async queryAndCacheLabels(ids: string[]) {
    if (ids.length === 0) {
      return; // No IDs to query
    }

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
      this.cache.set(binding.id.value, binding.label.value);
    }
  }

  async getLabels(options: SearchOptions): Promise<Labels> {
    const opts = searchOptionsSchema.parse(options);

    const ids = this.getIdsToQuery(opts.ids);
    await this.queryAndCacheLabels(ids);

    // Return only the labels of the requested IDs
    const labels: Labels = new Map();
    opts.ids.forEach((id: string) => labels.set(id, this.cache.get(id)));

    return labels;
  }
}
