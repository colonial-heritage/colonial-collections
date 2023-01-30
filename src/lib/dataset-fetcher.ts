import {reach} from '@hapi/hoek';
import {request} from 'gaxios';
import {z} from 'zod';

export interface ConstructorOptions {
  endpointUrl: string;
}

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export interface SearchOptions {
  query?: string;
  offset?: number;
  limit?: number;
}

// TODO: add sorting capabilities
const searchOptionsSchema = z.object({
  query: z.string().default('*'), // If no query provided, match all
  offset: z.number().int().nonnegative().default(0),
  limit: z.number().int().positive().default(10),
});

const rawSearchResponseSchema = z.object({
  data: z.object({
    hits: z.object({
      total: z.object({
        value: z.number(),
      }),
      hits: z.array(
        z.object({
          _source: z.object({
            '@id': z.string(),
            'https://colonialheritage example org/search#name': z
              .array(z.string())
              .min(1),
            'https://colonialheritage example org/search#description': z
              .array(z.string())
              .optional(),
          }),
        })
      ),
    }),
  }),
});

type RawSearchResponse = z.infer<typeof rawSearchResponseSchema>;

export type Dataset = {
  id: string;
  name: string;
  description?: string;
};

export type SearchResult = {
  totalCount: number;
  offset: number;
  limit: number;
  datasets: Dataset[];
};

export class DatasetFetcher {
  private endpointUrl: string;

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);
    this.endpointUrl = opts.endpointUrl;
  }

  // Elastic's '@elastic/elasticsearch' package does not work with TriplyDB's Elasticsearch instance
  async makeSearchRequest(
    query: Record<string, unknown>
  ): Promise<RawSearchResponse> {
    const rawSearchResponse = await request({
      url: this.endpointUrl,
      data: query,
      method: 'POST',
      timeout: 5000, // Gaxios' default is unlimited -- too much
      retryConfig: {
        retry: 3,
        noResponseRetries: 3, // E.g. in case of timeouts
        httpMethodsToRetry: ['POST'],
      },
    });

    const parsedRawSearchResponse =
      rawSearchResponseSchema.parse(rawSearchResponse);

    return parsedRawSearchResponse;
  }

  async search(options?: SearchOptions): Promise<SearchResult> {
    const opts = searchOptionsSchema.parse(options ?? {});

    // TBD: return documents in a provided locale (e.g. 'nl', 'en')?
    // TODO: add aggregations, to allow for facetting
    const query = {
      size: opts.limit,
      from: opts.offset,
      query: {
        bool: {
          must: [
            {
              simple_query_string: {
                query: opts.query,
                default_operator: 'and',
              },
            },
          ],
          // Only return documents of type 'Dataset'
          filter: [
            {
              term: {
                'http://www w3 org/1999/02/22-rdf-syntax-ns#type.keyword':
                  'https://colonialheritage.example.org/search#Dataset',
              },
            },
          ],
        },
      },
    };

    const searchResponse = await this.makeSearchRequest(query);

    const datasets: Dataset[] = searchResponse.data.hits.hits.map(hit => {
      const name = reach(
        hit,
        '_source.https://colonialheritage example org/search#name.0'
      );
      const description = reach(
        hit,
        '_source.https://colonialheritage example org/search#description.0'
      );

      return {
        id: hit._source['@id'],
        name,
        description,
      };
    });

    const searchResult: SearchResult = {
      totalCount: searchResponse.data.hits.total.value,
      offset: opts.offset,
      limit: opts.limit,
      datasets,
    };

    return searchResult;
  }
}
