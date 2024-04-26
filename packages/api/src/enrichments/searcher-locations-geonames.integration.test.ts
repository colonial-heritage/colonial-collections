import {GeoNamesLocationSearcher} from './searcher-locations-geonames';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let locationSearcher: GeoNamesLocationSearcher;

beforeEach(() => {
  locationSearcher = new GeoNamesLocationSearcher({
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
          id: 'https://sws.geonames.org/2755251/',
          name: 'Groningen',
          description: 'Groningen, Nederland',
        },
        {
          id: 'https://sws.geonames.org/6296685/',
          name: 'Groningen Airport Eelde',
          description: 'Drenthe, Nederland',
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
          id: 'https://sws.geonames.org/2755251/',
          name: 'Groningen',
          description: 'Groningen, The Netherlands',
        },
        {
          id: 'https://sws.geonames.org/6296685/',
          name: 'Groningen Airport Eelde',
          description: 'Drenthe, The Netherlands',
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
