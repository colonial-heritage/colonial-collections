import {SearchResult} from './definitions';
import {localeSchema, Thing} from '../definitions';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

export const searchOptionsSchema = z.object({
  locale: localeSchema,
  query: z.string(),
  limit: z.number().int().positive().optional().default(10),
});

export type SearchOptions = z.input<typeof searchOptionsSchema>;

const rawConstituentSchema = z
  .object({})
  .setKey('@id', z.string())
  .setKey('https://colonialcollections nl/schema#name', z.array(z.string()));

const rawSearchResponseSchema = z.object({
  hits: z.object({
    hits: z.array(
      z.object({
        _source: rawConstituentSchema,
      })
    ),
  }),
});

type RawSearchResponse = z.infer<typeof rawSearchResponseSchema>;

export class DatahubConstituentSearcher {
  private readonly endpointUrl: string;

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
  }

  async makeRequest<T>(searchRequest: Record<string, unknown>): Promise<T> {
    const response = await fetch(this.endpointUrl, {
      method: 'POST',
      body: JSON.stringify(searchRequest),
      headers: {'Content-Type': 'application/json'},
    });

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve information: ${response.statusText} (${response.status})`
      );
    }

    const responseData: T = await response.json();

    return responseData;
  }

  private buildRequest(options: SearchOptions) {
    const searchRequest = {
      size: options.limit,
      _source: ['@id', 'https://colonialcollections nl/schema#name'],
      query: {
        bool: {
          must: [
            {
              match_bool_prefix: {
                'https://colonialcollections nl/schema#name': {
                  query: options.query,
                },
              },
            },
          ],
          filter: [
            {
              // Only return documents of a specific type
              terms: {
                ['http://www w3 org/1999/02/22-rdf-syntax-ns#type.keyword']: [
                  'https://colonialcollections.nl/schema#Person',
                ],
              },
            },
          ],
        },
      },
    };

    return searchRequest;
  }

  private async buildResult(rawSearchResponse: RawSearchResponse) {
    const {hits} = rawSearchResponse;

    const rawThings = hits.hits.map(hit => hit._source);
    const things = rawThings.map(rawThing => {
      const thing: Thing = {
        id: rawThing['@id'],
        name: rawThing['https://colonialcollections nl/schema#name'][0],
      };

      return thing;
    });

    const searchResult: SearchResult = {
      things,
    };

    return searchResult;
  }

  async search(options: SearchOptions) {
    const opts = searchOptionsSchema.parse(options);

    const searchRequest = this.buildRequest(opts);

    const rawResponse =
      await this.makeRequest<RawSearchResponse>(searchRequest);
    const searchResponse = rawSearchResponseSchema.parse(rawResponse);

    const searchResult = await this.buildResult(searchResponse);

    return searchResult;
  }
}
