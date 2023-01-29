import {request} from 'gaxios';
import {z} from 'zod';

export interface ConstructorOptions {
  endpointUrl: string;
}

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export interface SearchOptions {
  query: string;
  offset?: number;
  limit?: number;
}

const searchOptionsSchema = z.object({
  query: z.string(),
  offset: z.number().int().nonnegative().default(0),
  limit: z.number().int().positive().default(10),
});

const rawSearchResponseSchema = z.object({
  data: z.object({
    hits: z.object({
      total: z.object({
        value: z.number(),
      }),
      hits: z.array(z.any()),
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

  async search(options: SearchOptions): Promise<SearchResult> {
    const opts = searchOptionsSchema.parse(options);

    const query = {
      size: opts.limit,
      from: opts.offset,
      query: {
        simple_query_string: {
          query: opts.query,
        },
      },
    };

    const result = await this.makeSearchRequest(query);

    // TODO: validate 'hits'

    const searchResult: SearchResult = {
      totalCount: result.data.hits.total.value,
      offset: opts.offset,
      limit: opts.limit,
      datasets: result.data.hits.hits,
    };

    return searchResult;
  }
}
