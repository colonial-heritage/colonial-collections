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
          id: 'http://www.wikidata.org/entity/Q131287465',
          name: 'Rembrandt',
          description: 'fotograaf',
        },
        {
          id: 'http://www.wikidata.org/entity/Q105964347',
          name: 'Rembrandt',
          description: 'Metaalwarenfabriek Rembrandt BV',
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
          id: 'http://www.wikidata.org/entity/Q29885090',
          name: 'Neeltje Willemsdr. Zuytbrouck',
          description: "Rembrandt's mother",
        },
        {
          id: 'http://www.wikidata.org/entity/Q1300641',
          name: 'Rembrandt Bugatti',
          description: 'Italian sculptor (1884–1916)',
        },
        {
          id: 'http://www.wikidata.org/entity/Q17330745',
          name: "Rembrandt's father",
          description:
            "model and member of the Leiden Guild of St. Luke (not Rembrandt's father)",
        },
      ],
    });
  });
});
