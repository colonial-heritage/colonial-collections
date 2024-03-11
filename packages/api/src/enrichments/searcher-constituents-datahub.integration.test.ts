import {DatahubConstituentSearcher} from './searcher-constituents-datahub';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let constituentSearcher: DatahubConstituentSearcher;

beforeEach(() => {
  constituentSearcher = new DatahubConstituentSearcher({
    endpointUrl: env.SEARCH_ENDPOINT_URL as string,
  });
});

describe('search', () => {
  it('finds constituents that match the query', async () => {
    const result = await constituentSearcher.search({query: 'art'});

    expect(result).toStrictEqual({
      things: [
        {id: 'https://example.org/constituents/12', name: 'Art Dealer'},
        {id: 'https://example.org/constituents/13', name: 'Art Store'},
      ],
    });
  });
});
