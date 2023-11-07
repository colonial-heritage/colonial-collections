import {
  Dataset,
  HeritageObject,
  Image,
  Organization,
  Person,
  SortBy,
  SortByEnum,
  SortOrder,
  SortOrderEnum,
  Term,
} from '../definitions';
import {SearchResult} from './definitions';
import {removeUndefinedValues} from '../rdf-helpers';
import {buildAggregation} from './searcher-request';
import {buildFilters} from './searcher-result';
import {reach} from '@hapi/hoek';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type ConstructorOptions = z.infer<typeof constructorOptionsSchema>;

enum RawKeys {
  Id = '@id',
  Type = 'http://www w3 org/1999/02/22-rdf-syntax-ns#type',
  AdditionalType = 'https://colonialcollections nl/schema#additionalType',
  Identifier = 'https://colonialcollections nl/schema#identifier',
  Name = 'https://colonialcollections nl/schema#name',
  Description = 'https://colonialcollections nl/schema#description',
  Inscription = 'https://colonialcollections nl/schema#inscription',
  About = 'https://colonialcollections nl/schema#about',
  Creator = 'https://colonialcollections nl/schema#creator',
  Material = 'https://colonialcollections nl/schema#material',
  Technique = 'https://colonialcollections nl/schema#technique',
  Image = 'https://colonialcollections nl/schema#image',
  Owner = 'https://colonialcollections nl/schema#owner',
  Publisher = 'https://colonialcollections nl/schema#publisher',
  YearCreatedStart = 'https://colonialcollections nl/schema#yearCreatedStart',
  YearCreatedEnd = 'https://colonialcollections nl/schema#yearCreatedEnd',
  CountryCreated = 'https://colonialcollections nl/schema#countryCreated',
  IsPartOf = 'https://colonialcollections nl/schema#isPartOf',
}

const sortByToRawKeys = new Map<string, string>([
  [SortBy.Name, `${RawKeys.Name}.keyword`], // TBD: name may not exist
  [SortBy.Relevance, '_score'],
]);

// TBD: add language option, for returning results in a specific locale (e.g. 'nl', 'en')
const searchOptionsSchema = z.object({
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

const rawHeritageObjectSchema = z
  .object({})
  .setKey(RawKeys.Id, z.string())
  .setKey(RawKeys.AdditionalType, z.array(z.string()).optional())
  .setKey(RawKeys.Identifier, z.array(z.string()).optional())
  .setKey(RawKeys.Name, z.array(z.string()).optional())
  .setKey(RawKeys.Description, z.array(z.string()).optional())
  .setKey(RawKeys.Inscription, z.array(z.string()).optional())
  .setKey(RawKeys.About, z.array(z.string()).optional())
  .setKey(RawKeys.Creator, z.array(z.string()).optional())
  .setKey(RawKeys.Material, z.array(z.string()).optional())
  .setKey(RawKeys.Technique, z.array(z.string()).optional())
  .setKey(RawKeys.Image, z.array(z.string()).optional())
  .setKey(RawKeys.Owner, z.array(z.string()).optional())
  .setKey(RawKeys.Publisher, z.array(z.string()).optional())
  .setKey(RawKeys.IsPartOf, z.array(z.string()).min(1));

type RawHeritageObject = z.infer<typeof rawHeritageObjectSchema>;

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
      owners: rawAggregationSchema,
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
        `Failed to retrieve information: ${response.statusText} (${response.status})`
      );
    }

    const responseData: T = await response.json();

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
        type: 'Organization', // TODO: determine dynamically - could also be a 'Person'
        id: ownerName,
        name: ownerName,
      };
    }

    const publisherName = reach(rawHeritageObject, `${RawKeys.Publisher}.0`);
    const datasetName = reach(rawHeritageObject, `${RawKeys.IsPartOf}.0`);
    const dataset: Dataset = {
      id: datasetName,
      name: datasetName,
      publisher: {
        type: 'Organization', // TODO: determine dynamically - could also be a 'Person'
        id: publisherName,
        name: publisherName,
      },
    };

    // Replace 'names' with IRIs as soon as we have IRIs
    const toThings = <T>(rawKey: string) => {
      const names: string[] | undefined = reach(rawHeritageObject, `${rawKey}`);
      if (names === undefined) {
        return undefined;
      }

      const things = names.map(name => {
        return {
          id: name,
          name,
        };
      });

      return things as T[];
    };

    const types = toThings<Term>(RawKeys.AdditionalType);
    const subjects = toThings<Term>(RawKeys.About);
    const materials = toThings<Term>(RawKeys.Material);
    const techniques = toThings<Term>(RawKeys.Technique);
    const creators = toThings<Person>(RawKeys.Creator); // TODO: set type (Person or Organization)

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

    const heritageObject = removeUndefinedValues<HeritageObject>(
      heritageObjectWithUndefinedValues
    );

    return heritageObject;
  }

  private buildRequest(options: SearchOptions) {
    const aggregations = {
      owners: buildAggregation(`${RawKeys.Owner}.keyword`),
      types: buildAggregation(`${RawKeys.AdditionalType}.keyword`),
      subjects: buildAggregation(`${RawKeys.About}.keyword`),
      locations: buildAggregation(`${RawKeys.CountryCreated}.keyword`),
      materials: buildAggregation(`${RawKeys.Material}.keyword`),
      creators: buildAggregation(`${RawKeys.Creator}.keyword`),
      publishers: buildAggregation(`${RawKeys.Publisher}.keyword`),
      dateCreatedStart: buildAggregation(RawKeys.YearCreatedStart),
      dateCreatedEnd: buildAggregation(RawKeys.YearCreatedEnd),
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
      [RawKeys.Owner, options.filters?.owners],
      [RawKeys.AdditionalType, options.filters?.types],
      [RawKeys.About, options.filters?.subjects],
      [RawKeys.CountryCreated, options.filters?.locations],
      [RawKeys.Material, options.filters?.materials],
      [RawKeys.Creator, options.filters?.creators],
      [RawKeys.Publisher, options.filters?.publishers],
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

  private async buildResult(
    options: SearchOptions,
    rawSearchResponse: RawSearchResponseWithAggregations
  ) {
    const {hits, aggregations} = rawSearchResponse;

    const heritageObjects: HeritageObject[] = hits.hits.map(hit => {
      const rawHeritageObject = hit._source;
      return this.fromRawHeritageObjectToHeritageObject(rawHeritageObject);
    });

    const ownerFilters = buildFilters(aggregations.owners.buckets);
    const typeFilters = buildFilters(aggregations.types.buckets);
    const subjectFilters = buildFilters(aggregations.subjects.buckets);
    const locationFilters = buildFilters(aggregations.locations.buckets);
    const materialFilters = buildFilters(aggregations.materials.buckets);
    const creatorFilters = buildFilters(aggregations.creators.buckets);
    const publisherFilters = buildFilters(aggregations.publishers.buckets);
    const dateCreatedStartFilters = buildFilters(
      aggregations.dateCreatedStart.buckets
    );
    const dateCreatedEndFilters = buildFilters(
      aggregations.dateCreatedEnd.buckets
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
