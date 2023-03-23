import {buildAggregation} from './request';
import {buildFilters} from './result';
import {merge, reach} from '@hapi/hoek';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

enum RawDatasetKeys {
  Id = '@id',
  Type = 'http://www w3 org/1999/02/22-rdf-syntax-ns#type',
  Name = 'https://colonialcollections nl/search#name',
  Description = 'https://colonialcollections nl/search#description',
  PublisherIri = 'https://colonialcollections nl/search#publisherIri',
  PublisherName = 'https://colonialcollections nl/search#publisherName',
  LicenseIri = 'https://colonialcollections nl/search#licenseIri',
  LicenseName = 'https://colonialcollections nl/search#licenseName',
  Keyword = 'https://colonialcollections nl/search#keyword',
  MainEntityOfPage = 'https://colonialcollections nl/search#mainEntityOfPage',
  DateCreated = 'https://colonialcollections nl/search#dateCreated',
  DateModified = 'https://colonialcollections nl/search#dateModified',
  DatePublished = 'https://colonialcollections nl/search#datePublished',
}

export type Publisher = {
  id: string;
  name: string;
};

export type License = {
  id: string;
  name: string;
};

export type Dataset = {
  id: string;
  name: string;
  publisher: Publisher;
  license: License;
  description?: string;
  keywords?: string[];
  mainEntityOfPages?: string[];
  dateCreated?: Date;
  dateModified?: Date;
  datePublished?: Date;
};

export enum SortBy {
  Name = 'name',
  Relevance = 'relevance',
}

const SortByEnum = z.nativeEnum(SortBy);

const sortByToRawKeys = new Map<string, string>([
  [SortBy.Name, `${RawDatasetKeys.Name}.keyword`],
  [SortBy.Relevance, '_score'],
]);

export enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

const SortOrderEnum = z.nativeEnum(SortOrder);

// TBD: add language option, for returning results in a specific locale (e.g. 'nl', 'en')
const searchOptionsSchema = z.object({
  query: z.string().optional().default('*'), // If no query provided, match all
  offset: z.number().int().nonnegative().optional().default(0),
  limit: z.number().int().positive().optional().default(10),
  sortBy: SortByEnum.optional().default(SortBy.Relevance),
  sortOrder: SortOrderEnum.optional().default(SortOrder.Descending),
  filters: z
    .object({
      publishers: z.array(z.string()).optional().default([]),
      licenses: z.array(z.string()).optional().default([]),
    })
    .optional(),
});

export type SearchOptions = z.input<typeof searchOptionsSchema>;

const dateSchema = z.coerce.date();

const rawDatasetSchema = z
  .object({})
  .setKey(RawDatasetKeys.Id, z.string())
  .setKey(RawDatasetKeys.Name, z.array(z.string()).min(1))
  .setKey(RawDatasetKeys.Description, z.array(z.string()).optional())
  .setKey(RawDatasetKeys.PublisherIri, z.array(z.string()).min(1))
  .setKey(RawDatasetKeys.PublisherName, z.array(z.string()).min(1))
  .setKey(RawDatasetKeys.LicenseIri, z.array(z.string()).min(1))
  .setKey(RawDatasetKeys.LicenseName, z.array(z.string()).min(1))
  .setKey(RawDatasetKeys.Keyword, z.array(z.string()).optional())
  .setKey(RawDatasetKeys.MainEntityOfPage, z.array(z.string()).optional())
  .setKey(RawDatasetKeys.DateCreated, z.array(dateSchema).optional())
  .setKey(RawDatasetKeys.DateModified, z.array(dateSchema).optional())
  .setKey(RawDatasetKeys.DatePublished, z.array(dateSchema).optional());

type RawDataset = z.infer<typeof rawDatasetSchema>;

const rawBucketSchema = z.object({
  key: z.array(z.string()),
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

type RawSearchResponse = z.infer<typeof rawSearchResponseSchema>;

const rawSearchResponseWithAggregationsSchema = rawSearchResponseSchema.merge(
  z.object({
    aggregations: z.object({
      all: z.object({
        publishers: rawAggregationSchema,
        licenses: rawAggregationSchema,
      }),
      publishers: rawAggregationSchema,
      licenses: rawAggregationSchema,
    }),
  })
);

type RawSearchResponseWithAggregations = z.infer<
  typeof rawSearchResponseWithAggregationsSchema
>;

export type SearchResultFilter = {
  totalCount: number;
  id: string;
  name: string;
};

export type SearchResult = {
  totalCount: number;
  offset: number;
  limit: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  datasets: Dataset[];
  filters: {
    publishers: SearchResultFilter[];
    licenses: SearchResultFilter[];
  };
};

const getByIdOptionsSchema = z.object({
  id: z.string(),
});

export type GetByIdOptions = z.infer<typeof getByIdOptionsSchema>;

export class DatasetFetcher {
  private endpointUrl: string;

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);
    this.endpointUrl = opts.endpointUrl;
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
        `Failed to retrieve datasets: ${response.statusText} (${response.status})`
      );
    }

    const responseData: T = await response.json();

    return responseData;
  }

  // Map the response to our internal model
  private fromRawDatasetToDataset(rawDataset: RawDataset): Dataset {
    const name = reach(rawDataset, `${RawDatasetKeys.Name}.0`);
    const description = reach(rawDataset, `${RawDatasetKeys.Description}.0`);
    const keywords = reach(rawDataset, `${RawDatasetKeys.Keyword}`);
    const mainEntityOfPages = reach(
      rawDataset,
      `${RawDatasetKeys.MainEntityOfPage}`
    );
    const dateCreated = reach(rawDataset, `${RawDatasetKeys.DateCreated}.0`);
    const dateModified = reach(rawDataset, `${RawDatasetKeys.DateModified}.0`);
    const datePublished = reach(
      rawDataset,
      `${RawDatasetKeys.DatePublished}.0`
    );
    const publisher: Publisher = {
      id: reach(rawDataset, `${RawDatasetKeys.PublisherIri}.0`),
      name: reach(rawDataset, `${RawDatasetKeys.PublisherName}.0`),
    };
    const license: License = {
      id: reach(rawDataset, `${RawDatasetKeys.LicenseIri}.0`),
      name: reach(rawDataset, `${RawDatasetKeys.LicenseName}.0`),
    };

    const datasetWithUndefinedValues: Dataset = {
      id: rawDataset[RawDatasetKeys.Id],
      name,
      publisher,
      license,
      description,
      keywords,
      mainEntityOfPages,
      dateCreated,
      dateModified,
      datePublished,
    };

    const dataset = merge({}, datasetWithUndefinedValues, {
      nullOverride: false,
    });

    return dataset;
  }

  private buildSearchRequest(options: SearchOptions) {
    const publishersAggegration = buildAggregation(
      RawDatasetKeys.PublisherIri,
      RawDatasetKeys.PublisherName
    );
    const licensesAggregation = buildAggregation(
      RawDatasetKeys.LicenseIri,
      RawDatasetKeys.LicenseName
    );

    const sortByRawKey = sortByToRawKeys.get(options.sortBy!)!;

    const searchRequest = {
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
              // Only return documents of type 'Dataset'
              terms: {
                [`${RawDatasetKeys.Type}.keyword`]: [
                  'https://colonialcollections.nl/search#Dataset',
                ],
              },
            },
          ],
        },
      },
      aggregations: {
        all: {
          // Aggregate all filters, regardless of the query.
          // We may need to refine this at some point, if performance needs it,
          // e.g. by using a separate call and caching the results
          global: {},
          aggregations: {
            publishers: publishersAggegration,
            licenses: licensesAggregation,
          },
        },
        publishers: publishersAggegration,
        licenses: licensesAggregation,
      },
    };

    if (options.filters?.publishers?.length) {
      searchRequest.query.bool.filter.push({
        terms: {
          [`${RawDatasetKeys.PublisherIri}.keyword`]:
            options.filters?.publishers,
        },
      });
    }

    if (options.filters?.licenses?.length) {
      searchRequest.query.bool.filter.push({
        terms: {
          [`${RawDatasetKeys.LicenseIri}.keyword`]: options.filters?.licenses,
        },
      });
    }

    return searchRequest;
  }

  private buildSearchResult(
    options: SearchOptions,
    rawSearchResponse: RawSearchResponseWithAggregations
  ) {
    const {hits, aggregations} = rawSearchResponse;

    const datasets: Dataset[] = hits.hits.map(hit => {
      const rawDataset = hit._source;
      return this.fromRawDatasetToDataset(rawDataset);
    });

    const publisherFilters = buildFilters(
      aggregations.all.publishers.buckets,
      aggregations.publishers.buckets
    );

    const licenseFilters = buildFilters(
      aggregations.all.licenses.buckets,
      aggregations.licenses.buckets
    );

    const searchResult: SearchResult = {
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

  async search(options?: SearchOptions): Promise<SearchResult> {
    const opts = searchOptionsSchema.parse(options ?? {});

    const searchRequest = this.buildSearchRequest(opts);
    const rawResponse =
      await this.makeRequest<RawSearchResponseWithAggregations>(searchRequest);
    const searchResponse =
      rawSearchResponseWithAggregationsSchema.parse(rawResponse);
    const searchResult = this.buildSearchResult(opts, searchResponse);

    return searchResult;
  }

  async getById(options: GetByIdOptions): Promise<Dataset | undefined> {
    const opts = getByIdOptionsSchema.parse(options);

    // We cannot use Elasticsearch's Get API: TriplyDB only supports the Search API.
    // TBD: should we query the triplestore instead?
    const searchRequest = {
      query: {
        term: {
          '@id.keyword': opts.id,
        },
      },
    };

    const rawResponse = await this.makeRequest<RawSearchResponse>(
      searchRequest
    );
    const searchResponse = rawSearchResponseSchema.parse(rawResponse);

    if (searchResponse.hits.hits.length !== 1) {
      return undefined;
    }

    const rawDataset = searchResponse.hits.hits[0]._source;
    const dataset = this.fromRawDatasetToDataset(rawDataset);

    return dataset;
  }
}
