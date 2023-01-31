import {reach} from '@hapi/hoek';
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

enum RawDatasetKeys {
  Id = '@id',
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
    searchParams: Record<string, unknown>
  ): Promise<RawSearchResponse> {
    // Elastic's '@elastic/elasticsearch' package does not work with TriplyDB's
    // Elasticsearch instance, so we use the native Fetch API instead
    const response = await fetch(this.endpointUrl, {
      body: JSON.stringify(searchParams),
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Could not complete search request');
    }

    const rawSearchResponse = await response.json();
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

  async search(options?: SearchOptions): Promise<SearchResult> {
    const opts = searchOptionsSchema.parse(options ?? {});

    // TBD: return documents in a provided locale (e.g. 'nl', 'en')?
    // TODO: add aggregations, to allow for facetting
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
              term: {
                'http://www w3 org/1999/02/22-rdf-syntax-ns#type.keyword':
                  'https://colonialheritage.example.org/search#Dataset',
              },
            },
          ],
        },
      },
    };

    const searchResponse = await this.makeSearchRequest(searchParams);

    const datasets: Dataset[] = searchResponse.hits.hits.map(hit => {
      const rawDataset = hit._source;
      return this.fromRawDatasetToDataset(rawDataset);
    });

    const searchResult: SearchResult = {
      totalCount: searchResponse.hits.total.value,
      offset: opts.offset,
      limit: opts.limit,
      datasets,
    };

    return searchResult;
  }
}
