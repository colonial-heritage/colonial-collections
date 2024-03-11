import {
  localeSchema,
  SearchResultFilter,
  SortBy,
  SortByEnum,
  SortOrder,
  SortOrderEnum,
} from '../definitions';
import type {HeritageObjectSearchResult} from './definitions';
import {HeritageObjectFetcher} from './fetcher';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
  heritageObjectFetcher: z.instanceof(HeritageObjectFetcher),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

enum RawKeys {
  Id = '@id',
  Type = 'http://www w3 org/1999/02/22-rdf-syntax-ns#type',
  AdditionalType = 'https://colonialcollections nl/schema#additionalType',
  Name = 'https://colonialcollections nl/schema#name',
  About = 'https://colonialcollections nl/schema#about',
  Creator = 'https://colonialcollections nl/schema#creator',
  Material = 'https://colonialcollections nl/schema#material',
  Technique = 'https://colonialcollections nl/schema#technique',
  Publisher = 'https://colonialcollections nl/schema#publisher',
  YearCreatedStart = 'https://colonialcollections nl/schema#yearCreatedStart',
  YearCreatedEnd = 'https://colonialcollections nl/schema#yearCreatedEnd',
  CountryCreated = 'https://colonialcollections nl/schema#countryCreated',
}

const sortByToRawKeys = new Map<string, string>([
  [SortBy.DateCreated, RawKeys.YearCreatedStart],
  [SortBy.Name, `${RawKeys.Name}.keyword`],
]);

const searchOptionsSchema = z.object({
  locale: localeSchema,
  query: z.string().optional().default('*'), // If no query provided, match all
  offset: z.number().int().nonnegative().optional().default(0),
  limit: z.number().int().positive().optional().default(10),
  sortBy: SortByEnum.optional().default(SortBy.DateCreated),
  sortOrder: SortOrderEnum.optional().default(SortOrder.Ascending),
  filters: z
    .object({
      types: z.array(z.string()).optional().default([]),
      subjects: z.array(z.string()).optional().default([]),
      locations: z.array(z.string()).optional().default([]),
      materials: z.array(z.string()).optional().default([]),
      creators: z.array(z.string()).optional().default([]),
      publishers: z.array(z.string()).optional().default([]),
      dateCreatedStart: z.number().optional(),
      dateCreatedEnd: z.number().optional(),
    })
    .optional(),
});

export type SearchOptions = z.input<typeof searchOptionsSchema>;

const rawHeritageObjectSchema = z.object({}).setKey(RawKeys.Id, z.string());

const rawBucketSchema = z.object({
  key: z.string().or(z.number()),
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
        _source: rawHeritageObjectSchema,
      })
    ),
  }),
});

const rawSearchResponseWithAggregationsSchema = rawSearchResponseSchema.merge(
  z.object({
    aggregations: z.object({
      types: rawAggregationSchema,
      subjects: rawAggregationSchema,
      locations: rawAggregationSchema,
      materials: rawAggregationSchema,
      creators: rawAggregationSchema,
      publishers: rawAggregationSchema,
      dateCreatedStart: rawAggregationSchema,
      dateCreatedEnd: rawAggregationSchema,
    }),
  })
);

type RawSearchResponseWithAggregations = z.infer<
  typeof rawSearchResponseWithAggregationsSchema
>;

export class HeritageObjectSearcher {
  private readonly endpointUrl: string;
  private readonly heritageObjectFetcher: HeritageObjectFetcher;

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
    this.heritageObjectFetcher = opts.heritageObjectFetcher;
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
        size: 10000, // TBD: revisit this - return fewer terms instead
        field: id,
      },
    };

    return aggregation;
  }

  private buildRequest(options: SearchOptions) {
    const locationKey = `${RawKeys.CountryCreated}_${options.locale}.keyword`;
    const typeKey = `${RawKeys.AdditionalType}_${options.locale}.keyword`;
    const materialKey = `${RawKeys.Material}_${options.locale}.keyword`;
    const publisherKey = `${RawKeys.Publisher}_${options.locale}.keyword`;

    const aggregations = {
      types: this.buildAggregation(typeKey),
      subjects: this.buildAggregation(`${RawKeys.About}.keyword`),
      locations: this.buildAggregation(locationKey),
      materials: this.buildAggregation(materialKey),
      creators: this.buildAggregation(`${RawKeys.Creator}.keyword`),
      publishers: this.buildAggregation(publisherKey),
      dateCreatedStart: this.buildAggregation(RawKeys.YearCreatedStart),
      dateCreatedEnd: this.buildAggregation(RawKeys.YearCreatedEnd),
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
                  'https://colonialcollections.nl/schema#HeritageObject',
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
      [typeKey, options.filters?.types],
      [`${RawKeys.About}.keyword`, options.filters?.subjects],
      [locationKey, options.filters?.locations],
      [materialKey, options.filters?.materials],
      [`${RawKeys.Creator}.keyword`, options.filters?.creators],
      [publisherKey, options.filters?.publishers],
    ]);

    for (const [rawHeritageObjectKey, filters] of queryFilters) {
      if (filters !== undefined) {
        const andFilters = filters.map(filter => {
          return {
            terms: {
              [rawHeritageObjectKey]: [filter],
            },
          };
        });

        searchRequest.query.bool.filter.push(...andFilters);
      }
    }

    const dateCreatedStart = options.filters?.dateCreatedStart;
    if (dateCreatedStart !== undefined) {
      searchRequest.query.bool.filter.push({
        // @ts-expect-error:TS2345
        range: {
          [RawKeys.YearCreatedStart]: {
            gte: dateCreatedStart,
          },
        },
      });
    }

    const dateCreatedEnd = options.filters?.dateCreatedEnd;
    if (dateCreatedEnd !== undefined) {
      searchRequest.query.bool.filter.push({
        // @ts-expect-error:TS2345
        range: {
          [RawKeys.YearCreatedEnd]: {
            lte: dateCreatedEnd,
          },
        },
      });
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

    const rawHeritageObjects = hits.hits.map(hit => hit._source);
    const ids = rawHeritageObjects.map(
      rawHeritageObject => rawHeritageObject['@id']
    );
    const heritageObjects = await this.heritageObjectFetcher.getByIds({
      locale: options.locale,
      ids,
    });

    const typeFilters = this.buildFilters(aggregations.types.buckets);
    const subjectFilters = this.buildFilters(aggregations.subjects.buckets);
    const locationFilters = this.buildFilters(aggregations.locations.buckets);
    const materialFilters = this.buildFilters(aggregations.materials.buckets);
    const creatorFilters = this.buildFilters(aggregations.creators.buckets);
    const publisherFilters = this.buildFilters(aggregations.publishers.buckets);
    const dateCreatedStartFilters = this.buildFilters(
      aggregations.dateCreatedStart.buckets
    );
    const dateCreatedEndFilters = this.buildFilters(
      aggregations.dateCreatedEnd.buckets
    );

    const searchResult: HeritageObjectSearchResult = {
      totalCount: hits.total.value,
      offset: options.offset!,
      limit: options.limit!,
      sortBy: options.sortBy!,
      sortOrder: options.sortOrder!,
      heritageObjects,
      filters: {
        types: typeFilters,
        subjects: subjectFilters,
        locations: locationFilters,
        materials: materialFilters,
        creators: creatorFilters,
        publishers: publisherFilters,
        dateCreatedStart: dateCreatedStartFilters,
        dateCreatedEnd: dateCreatedEndFilters,
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
