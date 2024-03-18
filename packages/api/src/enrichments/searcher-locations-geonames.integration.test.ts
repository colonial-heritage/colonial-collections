import {GeoNamesLocationSearcher} from './searcher-locations-geonames';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let locationSearcher: GeoNamesLocationSearcher;

beforeEach(() => {
  locationSearcher = new GeoNamesLocationSearcher({
    endpointUrl: 'http://api.geonames.org',
    username: env.GEONAMES_USERNAME as string,
  });
});

describe('search', () => {
  it('finds locations that match the query in the specified locale', async () => {
    const result = await locationSearcher.search({
      query: 'groning',
      locale: 'nl',
      limit: 3,
    });

    expect(result).toStrictEqual({
      things: [
        {
          id: 'https://sws.geonames.org/5028921/',
          name: 'Groningen',
          description: 'Minnesota, VS',
        },
        {
          id: 'https://sws.geonames.org/2904901/',
          name: 'Heynburg',
          description: 'Saksen-Anhalt, Duitsland',
        },
        {
          id: 'https://sws.geonames.org/2755249/',
          name: 'Provincie Groningen',
          description: 'Groningen, Nederland',
        },
      ],
    });
  });

  it('finds locations that match the query in the specified locale', async () => {
    const result = await locationSearcher.search({
      query: 'groning',
      locale: 'en',
      limit: 3,
    });

    expect(result).toStrictEqual({
      things: [
        {
          id: 'https://sws.geonames.org/5028921/',
          name: 'Groningen',
          description: 'Minnesota, United States',
        },
        {
          id: 'https://sws.geonames.org/2904901/',
          name: 'Heynburg',
          description: 'Saxony-Anhalt, Germany',
        },
        {
          id: 'https://sws.geonames.org/2755249/',
          name: 'Provincie Groningen',
          description: 'Groningen, The Netherlands',
        },
      ],
    });
  });
});
