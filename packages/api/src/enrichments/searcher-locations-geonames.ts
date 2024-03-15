import {searchOptionsSchema, SearchOptions, SearchResult} from './definitions';
import {Thing} from '../definitions';
import {z} from 'zod';

const constructorOptionsSchema = z.object({
  endpointUrl: z.string(),
  username: z.string(),
});

export type GeoNamesLocationSearcherConstructorOptions = z.infer<
  typeof constructorOptionsSchema
>;

const rawSearchResponseSchema = z.object({
  geonames: z.array(
    z.object({
      geonameId: z.number(),
      toponymName: z.string(),
      countryName: z.string(),
      adminName1: z.string(),
    })
  ),
});

type RawSearchResponse = z.infer<typeof rawSearchResponseSchema>;

export class GeoNamesLocationSearcher {
  private readonly endpointUrl: string;
  private readonly username: string;

  constructor(options: GeoNamesLocationSearcherConstructorOptions) {
    const opts = constructorOptionsSchema.parse(options);

    this.endpointUrl = opts.endpointUrl;
    this.username = opts.username;
  }

  private buildRequest(options: SearchOptions) {
    const searchParams: [string, string][] = [
      ['username', this.username],
      ['name_startsWith', options.query],
      ['maxRows', options.limit!.toString()],
      ['lang', options.locale!],
      ['featureCode', 'ADM1'], // Country, state, region, ...
      ['featureCode', 'PPL'], // City, village, ...
      ['type', 'json'],
    ];

    const urlSearchParams = new URLSearchParams(searchParams);
    const url = `${this.endpointUrl}/search?${urlSearchParams.toString()}`;

    return url;
  }

  async makeRequest(url: string) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve information: ${response.statusText} (${response.status})`
      );
    }

    return response.json();
  }

  private buildResult(rawSearchResponse: RawSearchResponse) {
    const {geonames} = rawSearchResponse;

    const things = geonames.map(rawPlace => {
      const descriptionParts: string[] = [];
      if (rawPlace.adminName1) {
        descriptionParts.push(rawPlace.adminName1);
      }
      if (rawPlace.countryName) {
        descriptionParts.push(rawPlace.countryName);
      }

      const thing: Thing = {
        id: `https://sws.geonames.org/${rawPlace.geonameId}/`,
        name: rawPlace.toponymName,
        description:
          descriptionParts.length > 0 ? descriptionParts.join(', ') : undefined,
      };

      return thing;
    });

    things.sort((a, b) => {
      return a.name && b.name ? a.name.localeCompare(b.name) : 0;
    });

    const searchResult: SearchResult = {
      things,
    };

    return searchResult;
  }

  async search(options: SearchOptions) {
    const opts = searchOptionsSchema.parse(options);

    const url = this.buildRequest(opts);

    const rawResponse = await this.makeRequest(url);
    const searchResponse = rawSearchResponseSchema.parse(rawResponse);
    const searchResult = this.buildResult(searchResponse);

    return searchResult;
  }
}
