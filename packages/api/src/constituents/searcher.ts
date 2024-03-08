import {
  localeSchema,
  SearchResultFilter,
  SortBy,
  SortByEnum,
  SortOrder,
  SortOrderEnum,
} from '../definitions';
import type {ConstituentSearchResult} from './definitions';
import {ConstituentFetcher} from './fetcher';
import {search} from '../elastic-client';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
  constituentFetcher: z.instanceof(ConstituentFetcher),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

enum RawKeys {
  Id = '@id',
  Type = 'http://www w3 org/1999/02/22-rdf-syntax-ns#type',
  Name = 'https://colonialcollections nl/schema#name',
  BirthPlace = 'https://colonialcollections nl/schema#birthPlace',
  BirthYear = 'https://colonialcollections nl/schema#birthYear',
  DeathPlace = 'https://colonialcollections nl/schema#deathPlace',
  DeathYear = 'https://colonialcollections nl/schema#deathYear',
  Publisher = 'https://colonialcollections nl/schema#publisher',
}

const sortByToRawKeys = new Map<string, string>([
  [SortBy.BirthYear, `${RawKeys.BirthYear}.keyword`],
  [SortBy.Name, `${RawKeys.Name}.keyword`],
]);

export const searchOptionsSchema = z.object({
  locale: localeSchema,
  query: z.string().optional().default('*'), // If no query provided, match all
  offset: z.number().int().nonnegative().optional().default(0),
  limit: z.number().int().positive().optional().default(10),
  sortBy: SortByEnum.optional().default(SortBy.BirthYear),
  sortOrder: SortOrderEnum.optional().default(SortOrder.Ascending),
  filters: z
    .object({
      birthYears: z.array(z.string()).optional().default([]),
      birthPlaces: z.array(z.string()).optional().default([]),
      deathYears: z.array(z.string()).optional().default([]),
      deathPlaces: z.array(z.string()).optional().default([]),
      publishers: z.array(z.string()).optional().default([]),
    })
    .optional(),
});

export type SearchOptions = z.input<typeof searchOptionsSchema>;

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
        _source: z.object({}).setKey(RawKeys.Id, z.string()),
      })
    ),
  }),
});

const rawSearchResponseWithAggregationsSchema = rawSearchResponseSchema.merge(
  z.object({
    aggregations: z.object({
      birthYears: rawAggregationSchema,
      birthPlaces: rawAggregationSchema,
      deathYears: rawAggregationSchema,
      deathPlaces: rawAggregationSchema,
      publishers: rawAggregationSchema,
    }),
  })
);

type RawSearchResponseWithAggregations = z.infer<
  typeof rawSearchResponseWithAggregationsSchema
>;

export class ConstituentSearcher {
  private readonly endpointUrl: string;
  private readonly constituentFetcher: ConstituentFetcher;

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
    this.constituentFetcher = opts.constituentFetcher;
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
    const publisherKey = `${RawKeys.Publisher}_${options.locale}.keyword`;

    const aggregations = {
      birthYears: this.buildAggregation(`${RawKeys.BirthYear}.keyword`),
      birthPlaces: this.buildAggregation(`${RawKeys.BirthPlace}.keyword`),
      deathYears: this.buildAggregation(`${RawKeys.DeathYear}.keyword`),
      deathPlaces: this.buildAggregation(`${RawKeys.DeathPlace}.keyword`),
      publishers: this.buildAggregation(publisherKey),
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
      _source: [RawKeys.Id],
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
                  'https://colonialcollections.nl/schema#Person',
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
      [`${RawKeys.BirthYear}.keyword`, options.filters?.birthYears],
      [`${RawKeys.BirthPlace}.keyword`, options.filters?.birthPlaces],
      [`${RawKeys.DeathYear}.keyword`, options.filters?.deathYears],
      [`${RawKeys.DeathPlace}.keyword`, options.filters?.deathPlaces],
      [publisherKey, options.filters?.publishers],
    ]);

    for (const [rawConstituentKey, filters] of queryFilters) {
      if (filters !== undefined) {
        const andFilters = filters.map(filter => {
          return {
            terms: {
              [rawConstituentKey]: [filter],
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

    const rawHeritageObjects = hits.hits.map(hit => hit._source);
    const ids = rawHeritageObjects.map(
      rawHeritageObject => rawHeritageObject['@id']
    );
    const constituents = await this.constituentFetcher.getByIds({
      locale: options.locale,
      ids,
    });

    const birthYearsFilters = this.buildFilters(
      aggregations.birthYears.buckets
    );
    const birthPlacesFilters = this.buildFilters(
      aggregations.birthPlaces.buckets
    );
    const deathYearsFilters = this.buildFilters(
      aggregations.deathYears.buckets
    );
    const deathPlacesFilters = this.buildFilters(
      aggregations.deathPlaces.buckets
    );
    const publisherFilters = this.buildFilters(aggregations.publishers.buckets);

    const searchResult: ConstituentSearchResult = {
      totalCount: hits.total.value,
      offset: options.offset!,
      limit: options.limit!,
      sortBy: options.sortBy!,
      sortOrder: options.sortOrder!,
      constituents,
      filters: {
        birthYears: birthYearsFilters,
        birthPlaces: birthPlacesFilters,
        deathYears: deathYearsFilters,
        deathPlaces: deathPlacesFilters,
        publishers: publisherFilters,
      },
    };

    return searchResult;
  }

  async search(options?: SearchOptions) {
    const opts = searchOptionsSchema.parse(options ?? {});

    const searchRequest = this.buildRequest(opts);
    const rawResponse = await search<RawSearchResponseWithAggregations>(
      this.endpointUrl,
      searchRequest
    );
    const searchResponse =
      rawSearchResponseWithAggregationsSchema.parse(rawResponse);
    const searchResult = await this.buildResult(opts, searchResponse);

    return searchResult;
  }
}
