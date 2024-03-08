import {WikidataConstituentSearcher} from './searcher-constituents-wikidata';
import {beforeEach, describe, expect, it} from '@jest/globals';

let constituentSearcher: WikidataConstituentSearcher;

beforeEach(() => {
  constituentSearcher = new WikidataConstituentSearcher({
    endpointUrl: 'https://query.wikidata.org/sparql',
  });
});

describe('search', () => {
  it('finds constituents that match the query in the specified locale', async () => {
    const result = await constituentSearcher.search({
      query: 'rembrandt',
      locale: 'nl',
      limit: 3,
    });

    expect(result).toStrictEqual({
      things: [
        {
          id: 'http://www.wikidata.org/entity/Q29885090',
          name: 'Neeltje Willemsdr. Zuytbrouck',
          description: 'moeder van Rembrandt, huishoudster',
        },
        {
          id: 'http://www.wikidata.org/entity/Q105964347',
          name: 'Rembrandt',
          description: 'Metaalwarenfabriek Rembrandt BV',
        },
        {
          id: 'http://www.wikidata.org/entity/Q1300641',
          name: 'Rembrandt Bugatti',
          description: 'Italiaans beeldhouwer',
        },
      ],
    });
  });

  it('finds constituents that match the query in the specified locale', async () => {
    const result = await constituentSearcher.search({
      query: 'rembrandt',
      locale: 'en',
      limit: 3,
    });

    expect(result).toStrictEqual({
      things: [
        {
          id: 'http://www.wikidata.org/entity/Q990960',
          name: 'Rembrandt',
          description: 'city in Buena Vista County, Iowa, United States',
        },
        {
          id: 'http://www.wikidata.org/entity/Q105964347',
          name: 'Rembrandt',
          description: 'Metaalwarenfabriek Rembrandt BV',
        },
        {
          id: 'http://www.wikidata.org/entity/Q375926',
          name: 'Rembrandt Peale',
          description: 'American painter (1778-1860)',
        },
      ],
    });
  });
});
