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
  Name = 'https://colonialcollections nl/search#name',
  BirthPlace = 'https://colonialcollections nl/search#birthPlaceName', // Replace with 'birthPlace' as soon as we have IRIs
  BirthDate = 'https://colonialcollections nl/search#birthDate',
  BirthYear = 'https://colonialcollections nl/search#birthYear',
  DeathPlace = 'https://colonialcollections nl/search#deathPlaceName', // Replace with 'deathPlace' as soon as we have IRIs
  DeathDate = 'https://colonialcollections nl/search#deathDate',
  DeathYear = 'https://colonialcollections nl/search#deathYear',
  IsPartOf = 'https://colonialcollections nl/search#isPartOf',
}

type Thing = {
  id: string;
  name?: string; // Name may not exist (e.g. in a specific locale)
};

export type Dataset = Thing;
export type Place = Thing;

export type Person = {
  id: string;
  name: string; // TBD: always exists?
  birthPlace?: Place;
  birthDate?: Date; // TBD: always a valid date?
  deathPlace?: Place;
  deathDate?: Date; // TBD: always a valid date?
  isPartOf: Dataset;
};

export enum SortBy {
  Name = 'name',
  Relevance = 'relevance',
}

export const SortByEnum = z.nativeEnum(SortBy);

const sortByToRawKeys = new Map<string, string>([
  [SortBy.Name, `${RawKeys.Name}.keyword`],
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
      birthYears: z.array(z.string()).optional().default([]),
      birthPlaces: z.array(z.string()).optional().default([]),
      deathYears: z.array(z.string()).optional().default([]),
      deathPlaces: z.array(z.string()).optional().default([]),
    })
    .optional(),
});

export type SearchOptions = z.input<typeof searchOptionsSchema>;

const dateSchema = z.coerce.date();

const rawPersonSchema = z
  .object({})
  .setKey(RawKeys.Id, z.string())
  .setKey(RawKeys.Name, z.array(z.string()).min(1))
  .setKey(RawKeys.BirthPlace, z.array(z.string()).optional())
  .setKey(RawKeys.BirthDate, z.array(dateSchema).optional())
  .setKey(RawKeys.DeathPlace, z.array(z.string()).optional())
  .setKey(RawKeys.DeathDate, z.array(dateSchema).optional())
  .setKey(RawKeys.IsPartOf, z.array(z.string()).min(1));

type RawPerson = z.infer<typeof rawPersonSchema>;

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
        _source: rawPersonSchema,
      })
    ),
  }),
});

type RawSearchResponse = z.infer<typeof rawSearchResponseSchema>;

const rawSearchResponseWithAggregationsSchema = rawSearchResponseSchema.merge(
  z.object({
    aggregations: z.object({
      all: z.object({
        birthYears: rawAggregationSchema,
        birthPlaces: rawAggregationSchema,
        deathYears: rawAggregationSchema,
        deathPlaces: rawAggregationSchema,
      }),
      birthYears: rawAggregationSchema,
      birthPlaces: rawAggregationSchema,
      deathYears: rawAggregationSchema,
      deathPlaces: rawAggregationSchema,
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
  persons: Person[];
  filters: {
    birthYears: SearchResultFilter[];
    birthPlaces: SearchResultFilter[];
    deathYears: SearchResultFilter[];
    deathPlaces: SearchResultFilter[];
  };
};

const getByIdOptionsSchema = z.object({
  id: z.string(),
});

export type GetByIdOptions = z.infer<typeof getByIdOptionsSchema>;

export class PersonFetcher {
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
  private fromRawPersonToPerson(rawPerson: RawPerson): Person {
    const name = reach(rawPerson, `${RawKeys.Name}.0`);
    const birthDate = reach(rawPerson, `${RawKeys.BirthDate}.0`);
    const deathDate = reach(rawPerson, `${RawKeys.DeathDate}.0`);

    const datasetIri = reach(rawPerson, `${RawKeys.IsPartOf}.0`);
    const dataset: Dataset = {
      id: datasetIri,
      name: this.labelFetcher.getByIri({iri: datasetIri}),
    };

    const toThing = <T>(rawKey: string) => {
      const name: string | undefined = reach(rawPerson, `${rawKey}.0`);
      if (name === undefined) {
        return undefined;
      }

      const thing = {
        id: name, // Replace with IRI as soon as we have IRIs
        name, // Replace with labelFetcher lookup as soon as we have IRIs
      };

      return thing as T;
    };

    const birthPlace = toThing<Place>(RawKeys.BirthPlace);
    const deathPlace = toThing<Place>(RawKeys.DeathPlace);

    const personWithUndefinedValues: Person = {
      id: rawPerson[RawKeys.Id],
      name,
      birthPlace,
      birthDate,
      deathPlace,
      deathDate,
      isPartOf: dataset,
    };

    const person = merge({}, personWithUndefinedValues, {
      nullOverride: false,
    });

    return person;
  }

  private buildSearchRequest(options: SearchOptions) {
    const aggregations = {
      birthYears: buildAggregation(RawKeys.BirthYear),
      birthPlaces: buildAggregation(RawKeys.BirthPlace),
      deathYears: buildAggregation(RawKeys.DeathYear),
      deathPlaces: buildAggregation(RawKeys.DeathPlace),
    };

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
              // Only return documents of a specific type
              terms: {
                [`${RawKeys.Type}.keyword`]: [
                  'https://colonialcollections.nl/search#Person',
                ],
              },
            },
            {
              // Only return documents of which the dataset they come from is known
              // (e.g. exclude persons that are creators of objects, coming from external terminology sources)
              exists: {
                field: 'https://colonialcollections nl/search#isPartOf',
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
      [RawKeys.BirthYear, options.filters?.birthYears],
      [RawKeys.BirthPlace, options.filters?.birthPlaces],
      [RawKeys.DeathYear, options.filters?.deathYears],
      [RawKeys.DeathPlace, options.filters?.deathPlaces],
    ]);

    for (const [rawPersonKey, filters] of queryFilters) {
      if (filters !== undefined && filters.length) {
        searchRequest.query.bool.filter.push({
          terms: {
            [`${rawPersonKey}.keyword`]: filters,
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

    const persons: Person[] = hits.hits.map(hit => {
      const rawPerson = hit._source;
      return this.fromRawPersonToPerson(rawPerson);
    });

    const birthYearFilters = buildFilters(
      aggregations.all.birthYears.buckets,
      aggregations.birthYears.buckets
    );

    const birthPlaceFilters = buildFilters(
      aggregations.all.birthPlaces.buckets,
      aggregations.birthPlaces.buckets
    );

    const deathYearFilters = buildFilters(
      aggregations.all.deathYears.buckets,
      aggregations.deathYears.buckets
    );

    const deathPlacesFilters = buildFilters(
      aggregations.all.deathPlaces.buckets,
      aggregations.deathPlaces.buckets
    );

    const searchResult: SearchResult = {
      totalCount: hits.total.value,
      offset: options.offset!,
      limit: options.limit!,
      sortBy: options.sortBy!,
      sortOrder: options.sortOrder!,
      persons,
      filters: {
        birthYears: birthYearFilters,
        birthPlaces: birthPlaceFilters,
        deathYears: deathYearFilters,
        deathPlaces: deathPlacesFilters,
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

  async getById(options: GetByIdOptions): Promise<Person | undefined> {
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

    const rawPerson = searchResponse.hits.hits[0]._source;
    const person = this.fromRawPersonToPerson(rawPerson);

    return person;
  }
}
