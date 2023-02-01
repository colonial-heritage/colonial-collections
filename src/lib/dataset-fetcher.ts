import {merge, reach} from '@hapi/hoek';
import {request} from 'gaxios';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

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
  description?: string;
  publisher: Publisher;
  license: License;
};

// TODO: add sorting capabilities
// TBD: add language option, for returning results in a specific locale (e.g. 'nl', 'en')?
const searchOptionsSchema = z.object({
  query: z.string().optional().default('*'), // If no query provided, match all
  offset: z.number().int().nonnegative().optional().default(0),
  limit: z.number().int().positive().optional().default(10),
  filters: z
    .object({
      publishers: z.array(z.string()).optional(),
      licenses: z.array(z.string()).optional(),
    })
    .optional(),
});

export type SearchOptions = z.input<typeof searchOptionsSchema>;

enum RawDatasetKeys {
  Id = '@id',
  Type = 'http://www w3 org/1999/02/22-rdf-syntax-ns#type',
  Name = 'https://colonialheritage example org/search#name',
  Description = 'https://colonialheritage example org/search#description',
  PublisherIri = 'https://colonialheritage example org/search#publisherIri',
  PublisherName = 'https://colonialheritage example org/search#publisherName',
  LicenseIri = 'https://colonialheritage example org/search#licenseIri',
  LicenseName = 'https://colonialheritage example org/search#licenseName',
}

const rawDatasetSchema = z
  .object({})
  .setKey(RawDatasetKeys.Id, z.string())
  .setKey(RawDatasetKeys.Name, z.array(z.string()).min(1))
  .setKey(RawDatasetKeys.Description, z.array(z.string()).optional())
  .setKey(RawDatasetKeys.PublisherIri, z.array(z.string()).min(1))
  .setKey(RawDatasetKeys.PublisherName, z.array(z.string()).min(1))
  .setKey(RawDatasetKeys.LicenseIri, z.array(z.string()).min(1))
  .setKey(RawDatasetKeys.LicenseName, z.array(z.string()).min(1));

type RawDataset = z.infer<typeof rawDatasetSchema>;

const rawSearchResponseSchema = z.object({
  data: z.object({
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
  }),
});

type RawSearchResponse = z.infer<typeof rawSearchResponseSchema>;

export type SearchResultFilter = {
  totalCount: number;
  id: string;
  name: string;
};

export type SearchResult = {
  totalCount: number;
  offset: number;
  limit: number;
  datasets: Dataset[];
  filters?: {
    publishers: SearchResultFilter[];
    licenses: SearchResultFilter[];
  };
};

export class DatasetFetcher {
  private endpointUrl: string;

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);
    this.endpointUrl = opts.endpointUrl;
  }

  async makeSearchRequest(
    searchParams: Record<string, unknown>
  ): Promise<RawSearchResponse> {
    // Elastic's '@elastic/elasticsearch' package does not work with TriplyDB's
    // Elasticsearch instance, so we use pure HTTP calls instead
    const rawSearchResponse = await request({
      url: this.endpointUrl,
      data: searchParams,
      method: 'POST',
      timeout: 5000,
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

  // Map the response to our internal model
  private fromRawDatasetToDataset(rawDataset: RawDataset) {
    const name = reach(rawDataset, `${RawDatasetKeys.Name}.0`);
    const description = reach(rawDataset, `${RawDatasetKeys.Description}.0`);
    const publisher: Publisher = {
      id: reach(rawDataset, `${RawDatasetKeys.PublisherIri}.0`),
      name: reach(rawDataset, `${RawDatasetKeys.PublisherName}.0`),
    };
    const license: License = {
      id: reach(rawDataset, `${RawDatasetKeys.LicenseIri}.0`),
      name: reach(rawDataset, `${RawDatasetKeys.LicenseName}.0`),
    };

    return {
      id: rawDataset[RawDatasetKeys.Id],
      name,
      description,
      publisher,
      license,
    };
  }

  private buildAggregation(
    aggregationName: string,
    id: string,
    name: string
  ): object {
    const aggregation = {
      [aggregationName]: {
        terms: {
          field: `${id}.keyword`,
        },
        aggs: {
          names: {
            terms: {
              field: `${name}.keyword`,
            },
          },
        },
      },
      [`${aggregationName}_zero`]: {
        terms: {
          field: `${name}.keyword`, // TBD: query triplestore to look-up the names based on the IRI?
          min_doc_count: 0,
        },
      },
    };

    return aggregation;
  }

  async search(options?: SearchOptions): Promise<SearchResult> {
    const opts = searchOptionsSchema.parse(options ?? {});

    const searchParams = {
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
          filter: [
            {
              // Only return documents of type 'Dataset'
              terms: {
                [`${RawDatasetKeys.Type}.keyword`]: [
                  'https://colonialheritage.example.org/search#Dataset',
                ],
              },
            },
          ],
        },
      },
      aggs: merge(
        this.buildAggregation(
          'publishers',
          RawDatasetKeys.PublisherIri,
          RawDatasetKeys.PublisherName
        ),
        this.buildAggregation(
          'licenses',
          RawDatasetKeys.LicenseIri,
          RawDatasetKeys.LicenseName
        )
      ),
    };

    if (opts.filters?.publishers) {
      searchParams.query.bool.filter.push({
        terms: {
          [`${RawDatasetKeys.PublisherIri}.keyword`]: opts.filters?.publishers,
        },
      });
    }

    if (opts.filters?.licenses) {
      searchParams.query.bool.filter.push({
        terms: {
          [`${RawDatasetKeys.LicenseIri}.keyword`]: opts.filters?.licenses,
        },
      });
    }

    const searchResponse = await this.makeSearchRequest(searchParams);
    const hits = searchResponse.data.hits;

    const datasets: Dataset[] = hits.hits.map(hit => {
      const rawDataset = hit._source;
      return this.fromRawDatasetToDataset(rawDataset);
    });

    // TODO: add aggregated response to searchResult

    const searchResult: SearchResult = {
      totalCount: hits.total.value,
      offset: opts.offset!,
      limit: opts.limit!,
      datasets,
    };

    return searchResult;
  }
}
