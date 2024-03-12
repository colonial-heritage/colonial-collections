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
          id: 'http://www.wikidata.org/entity/Q106527653',
          name: 'Maatschappij Rembrandt',
          description: 'uitgeverij uit Utrecht',
        },
        {
          id: 'http://www.wikidata.org/entity/Q105964347',
          name: 'Rembrandt',
          description: 'Metaalwarenfabriek Rembrandt BV',
        },
        {
          id: 'http://www.wikidata.org/entity/Q17330745',
          name: 'Rembrandts vader',
          description: 'Nederlands acteur',
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
          id: 'http://www.wikidata.org/entity/Q352864',
          name: 'Pieter Lastman',
          description: 'Dutch painter',
        },
        {
          id: 'http://www.wikidata.org/entity/Q105964347',
          name: 'Rembrandt',
          description: 'Metaalwarenfabriek Rembrandt BV',
        },
        {
          id: 'http://www.wikidata.org/entity/Q1300641',
          name: 'Rembrandt Bugatti',
          description: '1884-1916 Italian sculptor',
        },
      ],
    });
  });
});
