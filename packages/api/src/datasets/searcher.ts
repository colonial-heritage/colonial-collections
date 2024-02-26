import {
  localeSchema,
  SearchResultFilter,
  SortBy,
  SortByEnum,
  SortOrder,
  SortOrderEnum,
} from '../definitions';
import type {DatasetSearchResult} from './definitions';
import {DatasetFetcher} from './fetcher';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
  datasetFetcher: z.instanceof(DatasetFetcher),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

enum RawKeys {
  Id = '@id',
  Type = 'http://www w3 org/1999/02/22-rdf-syntax-ns#type',
  Name = 'https://colonialcollections nl/schema#name',
  Publisher = 'https://colonialcollections nl/schema#publisher',
  License = 'https://colonialcollections nl/schema#license',
}

const sortByToRawKeys = new Map<string, string>([
  [SortBy.Name, `${RawKeys.Name}.keyword`],
]);

export const searchOptionsSchema = z.object({
  locale: localeSchema,
  query: z.string().optional().default('*'), // If no query provided, match all
  offset: z.number().int().nonnegative().optional().default(0),
  limit: z.number().int().positive().optional().default(10),
  sortBy: SortByEnum.optional().default(SortBy.Name),
  sortOrder: SortOrderEnum.optional().default(SortOrder.Ascending),
  filters: z
    .object({
      publishers: z.array(z.string()).optional().default([]),
      licenses: z.array(z.string()).optional().default([]),
    })
    .optional(),
});

export type SearchOptions = z.input<typeof searchOptionsSchema>;

const rawDatasetSchema = z.object({}).setKey(RawKeys.Id, z.string());

const rawBucketSchema = z.object({
  key: z.string(),
  doc_count: z.number(),
});

export type RawBucket = z.infer<typeof rawBucketSchema>;

const rawAggregationSchema = z.object({
  buckets: z.array(rawBucketSchema),
});

const rawSearchResponseSchema = z.object({
  hits: z.object({
    total: z.object({
      value: z.number(),
    }),
    hits: z.array(
      z.object({
        _source: rawDatasetSchema,
      })
    ),
  }),
});

const rawSearchResponseWithAggregationsSchema = rawSearchResponseSchema.merge(
  z.object({
    aggregations: z.object({
      publishers: rawAggregationSchema,
      licenses: rawAggregationSchema,
    }),
  })
);

type RawSearchResponseWithAggregations = z.infer<
  typeof rawSearchResponseWithAggregationsSchema
>;

export class DatasetSearcher {
  private readonly endpointUrl: string;
  private readonly datasetFetcher: DatasetFetcher;

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
    this.datasetFetcher = opts.datasetFetcher;
  }

  async makeRequest<T>(searchRequest: Record<string, unknown>): Promise<T> {
    // Elastic's '@elastic/elasticsearch' package does not work with TriplyDB's
    // Elasticsearch instance, so we use pure HTTP calls instead
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

  private buildAggregation(id: string) {
    const aggregation = {
      terms: {
        size: 100, // TBD: what's a good size?
        field: id,
      },
    };

    return aggregation;
  }

  private buildRequest(options: SearchOptions) {
    const aggregations = {
      publishers: this.buildAggregation(`${RawKeys.Publisher}.keyword`),
      licenses: this.buildAggregation(`${RawKeys.License}.keyword`),
    };

    const sortByRawKey = sortByToRawKeys.get(options.sortBy!)!;

    const searchRequest = {
      track_total_hits: true,
      size: options.limit,
      from: options.offset,
      sort: [
        {
          [sortByRawKey]: options.sortOrder,
        },
      ],
      query: {
        bool: {
          must: [
            {
              simple_query_string: {
                query: options.query,
                default_operator: 'and',
              },
            },
          ],
          filter: [
            {
              // Only return documents of a specific type
              terms: {
                [`${RawKeys.Type}.keyword` as string]: [
                  'https://colonialcollections.nl/schema#Dataset',
                ],
              },
            },
          ],
        },
      },
      aggregations: {
        ...aggregations,
      },
    };

    const queryFilters: Map<string, string[] | undefined> = new Map([
      [RawKeys.Publisher, options.filters?.publishers],
      [RawKeys.License, options.filters?.licenses],
    ]);

    for (const [rawDatasetKey, filters] of queryFilters) {
      if (filters !== undefined) {
        const andFilters = filters.map(filter => {
          return {
            terms: {
              [`${rawDatasetKey}.keyword`]: [filter],
            },
          };
        });

        searchRequest.query.bool.filter.push(...andFilters);
      }
    }

    return searchRequest;
  }

  private toMatchedFilter(bucket: RawBucket): SearchResultFilter {
    const totalCount = bucket.doc_count;
    const id = bucket.key;
    const name = bucket.key;

    return {totalCount, id, name};
  }

  private buildFilters(rawMatchedFilters: RawBucket[]) {
    const matchedFilters = rawMatchedFilters.map(rawMatchedFilter =>
      this.toMatchedFilter(rawMatchedFilter)
    );

    // TBD: sort filters by totalCount, descending + subsort by totalCount, ascending?

    return matchedFilters;
  }

  private async buildResult(
    options: SearchOptions,
    rawSearchResponse: RawSearchResponseWithAggregations
  ) {
    const {hits, aggregations} = rawSearchResponse;

    const rawDatasets = hits.hits.map(hit => hit._source);
    const ids = rawDatasets.map(rawDataset => rawDataset['@id']);
    const datasets = await this.datasetFetcher.getByIds({
      locale: options.locale,
      ids,
    });

    const publisherFilters = this.buildFilters(aggregations.publishers.buckets);
    const licenseFilters = this.buildFilters(aggregations.licenses.buckets);

    const searchResult: DatasetSearchResult = {
      totalCount: hits.total.value,
      offset: options.offset!,
      limit: options.limit!,
      sortBy: options.sortBy!,
      sortOrder: options.sortOrder!,
      datasets,
      filters: {
        publishers: publisherFilters,
        licenses: licenseFilters,
      },
    };

    return searchResult;
  }

  async search(options?: SearchOptions) {
    const opts = searchOptionsSchema.parse(options ?? {});

    const searchRequest = this.buildRequest(opts);

    const rawResponse =
      await this.makeRequest<RawSearchResponseWithAggregations>(searchRequest);
    const searchResponse =
      rawSearchResponseWithAggregationsSchema.parse(rawResponse);

    const searchResult = await this.buildResult(opts, searchResponse);

    return searchResult;
  }
}
