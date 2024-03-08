import {searchOptionsSchema, SearchOptions, SearchResult} from './definitions';
import {Thing} from '../definitions';
import {search} from '../elastic-client';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
});

export type DatahubConstituentSearcherConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

enum RawKeys {
  Id = '@id',
  Type = 'http://www w3 org/1999/02/22-rdf-syntax-ns#type',
  Name = 'https://colonialcollections nl/schema#name',
}

const rawSearchResponseSchema = z.object({
  hits: z.object({
    hits: z.array(
      z.object({
        _source: z
          .object({})
          .setKey(RawKeys.Id, z.string())
          .setKey(RawKeys.Name, z.array(z.string())),
      })
    ),
  }),
});

type RawSearchResponse = z.infer<typeof rawSearchResponseSchema>;

export class DatahubConstituentSearcher {
  private readonly endpointUrl: string;

  constructor(options: DatahubConstituentSearcherConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
  }

  private buildRequest(options: SearchOptions) {
    const searchRequest = {
      size: options.limit,
      sort: [
        {
          [`${RawKeys.Name}.keyword`]: 'asc',
        },
      ],
      _source: [RawKeys.Id, RawKeys.Name],
      query: {
        bool: {
          must: [
            {
              match_bool_prefix: {
                [RawKeys.Name]: {
                  query: options.query,
                },
              },
            },
          ],
          filter: [
            {
              // Only return documents of a specific type
              terms: {
                [`${RawKeys.Type}.keyword`]: [
                  'https://colonialcollections.nl/schema#Person',
                ],
              },
            },
          ],
        },
      },
    };

    return searchRequest;
  }

  private buildResult(rawSearchResponse: RawSearchResponse) {
    const {hits} = rawSearchResponse;

    const rawThings = hits.hits.map(hit => hit._source);
    const things = rawThings.map(rawThing => {
      const thing: Thing = {
        id: rawThing['@id'],
        name: rawThing[RawKeys.Name][0],
      };

      return thing;
    });

    const searchResult: SearchResult = {
      things,
    };

    return searchResult;
  }

  async search(options: SearchOptions) {
    const opts = searchOptionsSchema.parse(options);

    const searchRequest = this.buildRequest(opts);
    const rawResponse = await search<RawSearchResponse>(
      this.endpointUrl,
      searchRequest
    );
    const searchResponse = rawSearchResponseSchema.parse(rawResponse);
    const searchResult = this.buildResult(searchResponse);

    return searchResult;
  }
}
