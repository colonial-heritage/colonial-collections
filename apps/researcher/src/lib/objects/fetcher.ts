import {buildAggregation} from './fetcher-request';
import {buildFilters} from './fetcher-result';
import {getIrisFromObject} from '@colonial-collections/iris';
import {LabelFetcher} from '@colonial-collections/label-fetcher';
import {merge, reach} from '@hapi/hoek';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
  labelFetcher: z.instanceof(LabelFetcher),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

enum RawKeys {
  Id = '@id',
  Type = 'http://www w3 org/1999/02/22-rdf-syntax-ns#type',
  AdditionalType = 'https://colonialcollections nl/search#typeName', // Replace with 'additionalType' as soon as we have IRIs
  Identifier = 'https://colonialcollections nl/search#identifier',
  Name = 'https://colonialcollections nl/search#name',
  Description = 'https://colonialcollections nl/search#description',
  Inscription = 'https://colonialcollections nl/search#inscription',
  About = 'https://colonialcollections nl/search#aboutName', // Replace with 'about' as soon as we have IRIs
  Creator = 'https://colonialcollections nl/search#creatorName', // Replace with 'creator' as soon as we have IRIs
  Material = 'https://colonialcollections nl/search#materialName', // Replace with 'material' as soon as we have IRIs
  Technique = 'https://colonialcollections nl/search#techniqueName', // Replace with 'technique' as soon as we have IRIs
  Image = 'https://colonialcollections nl/search#image',
  Owner = 'https://colonialcollections nl/search#ownerName', // Replace with 'owner' as soon as we have IRIs
  IsPartOf = 'https://colonialcollections nl/search#isPartOf',
}

type Thing = {
  id: string;
  name?: string; // Name may not exist (e.g. in a specific locale)
};

export type Organization = Thing;
export type Term = Thing;
export type Person = Thing;
export type Dataset = Thing;

export type Image = {
  id: string;
  contentUrl: string;
};

export type HeritageObject = {
  id: string;
  identifier: string;
  name?: string;
  description?: string;
  inscriptions?: string[];
  types?: Term[];
  subjects?: Term[];
  materials?: Term[];
  techniques?: Term[];
  creators?: Person[];
  images?: Image[];
  owner?: Organization;
  isPartOf: Dataset;
};

export enum SortBy {
  Name = 'name',
  Relevance = 'relevance',
}

export const SortByEnum = z.nativeEnum(SortBy);

const sortByToRawKeys = new Map<string, string>([
  [SortBy.Name, `${RawKeys.Name}.keyword`], // TBD: name may not exist
  [SortBy.Relevance, '_score'],
]);

export enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

export const SortOrderEnum = z.nativeEnum(SortOrder);

// TBD: add language option, for returning results in a specific locale (e.g. 'nl', 'en')
export const searchOptionsSchema = z.object({
  query: z.string().optional().default('*'), // If no query provided, match all
  offset: z.number().int().nonnegative().optional().default(0),
  limit: z.number().int().positive().optional().default(10),
  sortBy: SortByEnum.optional().default(SortBy.Relevance),
  sortOrder: SortOrderEnum.optional().default(SortOrder.Descending),
  filters: z
    .object({
      owners: z.array(z.string()).optional().default([]),
      types: z.array(z.string()).optional().default([]),
      subjects: z.array(z.string()).optional().default([]),
    })
    .optional(),
});

export type SearchOptions = z.input<typeof searchOptionsSchema>;

const rawHeritageObjectSchema = z
  .object({})
  .setKey(RawKeys.Id, z.string())
  .setKey(RawKeys.AdditionalType, z.array(z.string()).optional())
  .setKey(RawKeys.Identifier, z.array(z.string()).min(1))
  .setKey(RawKeys.Name, z.array(z.string()).optional())
  .setKey(RawKeys.Description, z.array(z.string()).optional())
  .setKey(RawKeys.Inscription, z.array(z.string()).optional())
  .setKey(RawKeys.About, z.array(z.string()).optional())
  .setKey(RawKeys.Creator, z.array(z.string()).optional())
  .setKey(RawKeys.Material, z.array(z.string()).optional())
  .setKey(RawKeys.Technique, z.array(z.string()).optional())
  .setKey(RawKeys.Image, z.array(z.string()).optional())
  .setKey(RawKeys.Owner, z.array(z.string()).optional())
  .setKey(RawKeys.IsPartOf, z.array(z.string()).min(1));

type RawHeritageObject = z.infer<typeof rawHeritageObjectSchema>;

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
        _source: rawHeritageObjectSchema,
      })
    ),
  }),
});

type RawSearchResponse = z.infer<typeof rawSearchResponseSchema>;

const rawSearchResponseWithAggregationsSchema = rawSearchResponseSchema.merge(
  z.object({
    aggregations: z.object({
      all: z.object({
        owners: rawAggregationSchema,
        types: rawAggregationSchema,
        subjects: rawAggregationSchema,
      }),
      owners: rawAggregationSchema,
      types: rawAggregationSchema,
      subjects: rawAggregationSchema,
    }),
  })
);

type RawSearchResponseWithAggregations = z.infer<
  typeof rawSearchResponseWithAggregationsSchema
>;

export type SearchResultFilter = Thing & {totalCount: number};

export type SearchResult = {
  totalCount: number;
  offset: number;
  limit: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  heritageObjects: HeritageObject[];
  filters: {
    owners: SearchResultFilter[];
    types: SearchResultFilter[];
    subjects: SearchResultFilter[];
  };
};

const getByIdOptionsSchema = z.object({
  id: z.string(),
});

export type GetByIdOptions = z.infer<typeof getByIdOptionsSchema>;

export class HeritageObjectFetcher {
  private endpointUrl: string;
  private labelFetcher: LabelFetcher;

  constructor(options: ConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
    this.labelFetcher = opts.labelFetcher;
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

    // Extract the IRIs, if any, from the response.
    // The IRIs are necessary for fetching their labels later on
    const iris = getIrisFromObject(responseData);
    const predicates = ['https://colonialcollections.nl/search#name'];
    await this.labelFetcher.loadByIris({iris, predicates});

    return responseData;
  }

  // Map the response to our internal model
  private fromRawHeritageObjectToHeritageObject(
    rawHeritageObject: RawHeritageObject
  ): HeritageObject {
    const name = reach(rawHeritageObject, `${RawKeys.Name}.0`);
    const identifier = reach(rawHeritageObject, `${RawKeys.Identifier}.0`);
    const description = reach(rawHeritageObject, `${RawKeys.Description}.0`);
    const inscriptions = reach(rawHeritageObject, `${RawKeys.Inscription}`);

    let owner: Organization | undefined;
    const ownerName = reach(rawHeritageObject, `${RawKeys.Owner}.0`);
    if (ownerName !== undefined) {
      owner = {
        id: ownerName,
        name: ownerName, // Replace with labelFetcher lookup as soon as we have IRIs
      };
    }

    const datasetIri = reach(rawHeritageObject, `${RawKeys.IsPartOf}.0`);
    const dataset: Dataset = {
      id: datasetIri,
      name: this.labelFetcher.getByIri({iri: datasetIri}),
    };

    // Replace 'names' with IRIs as soon as we have IRIs
    const toThings = <T>(rawKey: string) => {
      const names: string[] | undefined = reach(rawHeritageObject, `${rawKey}`);
      if (names === undefined) {
        return undefined;
      }

      const things = names.map(name => {
        return {
          id: name, // Replace with IRI as soon as we have IRIs
          name, // Replace with labelFetcher lookup as soon as we have IRIs
        };
      });

      return things as T[];
    };

    const types = toThings<Term>(RawKeys.AdditionalType);
    const subjects = toThings<Term>(RawKeys.About);
    const materials = toThings<Term>(RawKeys.Material);
    const techniques = toThings<Term>(RawKeys.Technique);
    const creators = toThings<Person>(RawKeys.Creator);

    let images: Image[] | undefined;
    const contentUrls: string[] | undefined = reach(
      rawHeritageObject,
      `${RawKeys.Image}`
    );
    if (contentUrls !== undefined) {
      images = contentUrls.map(contentUrl => {
        return {
          id: contentUrl, // At this moment the same
          contentUrl,
        };
      });
    }

    const heritageObjectWithUndefinedValues: HeritageObject = {
      id: rawHeritageObject[RawKeys.Id],
      name,
      identifier,
      description,
      inscriptions,
      types,
      subjects,
      materials,
      techniques,
      creators,
      images,
      owner,
      isPartOf: dataset,
    };

    const heritageObject = merge({}, heritageObjectWithUndefinedValues, {
      nullOverride: false,
    });

    return heritageObject;
  }

  private buildSearchRequest(options: SearchOptions) {
    const aggregations = {
      owners: buildAggregation(RawKeys.Owner),
      types: buildAggregation(RawKeys.AdditionalType),
      subjects: buildAggregation(RawKeys.About),
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
                [`${RawKeys.Type}.keyword`]: [
                  'https://colonialcollections.nl/search#HeritageObject',
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
          aggregations,
        },
        ...aggregations,
      },
    };

    const queryFilters: Map<string, string[] | undefined> = new Map([
      [RawKeys.Owner, options.filters?.owners],
      [RawKeys.AdditionalType, options.filters?.types],
      [RawKeys.About, options.filters?.subjects],
    ]);

    for (const [rawHeritageObjectKey, filters] of queryFilters) {
      if (filters !== undefined && filters.length) {
        searchRequest.query.bool.filter.push({
          terms: {
            [`${rawHeritageObjectKey}.keyword`]: filters,
          },
        });
      }
    }

    return searchRequest;
  }

  private async buildSearchResult(
    options: SearchOptions,
    rawSearchResponse: RawSearchResponseWithAggregations
  ) {
    const {hits, aggregations} = rawSearchResponse;

    const heritageObjects: HeritageObject[] = hits.hits.map(hit => {
      const rawHeritageObject = hit._source;
      return this.fromRawHeritageObjectToHeritageObject(rawHeritageObject);
    });

    const ownerFilters = buildFilters(
      aggregations.all.owners.buckets,
      aggregations.owners.buckets
    );

    const typeFilters = buildFilters(
      aggregations.all.types.buckets,
      aggregations.types.buckets
    );

    const subjectFilters = buildFilters(
      aggregations.all.subjects.buckets,
      aggregations.subjects.buckets
    );

    const searchResult: SearchResult = {
      totalCount: hits.total.value,
      offset: options.offset!,
      limit: options.limit!,
      sortBy: options.sortBy!,
      sortOrder: options.sortOrder!,
      heritageObjects,
      filters: {
        owners: ownerFilters,
        types: typeFilters,
        subjects: subjectFilters,
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

    const searchResult = await this.buildSearchResult(opts, searchResponse);

    return searchResult;
  }

  async getById(options: GetByIdOptions): Promise<HeritageObject | undefined> {
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

    const rawHeritageObject = searchResponse.hits.hits[0]._source;
    const heritageObject =
      this.fromRawHeritageObjectToHeritageObject(rawHeritageObject);

    return heritageObject;
  }
}
