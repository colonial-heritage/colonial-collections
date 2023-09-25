import {PersonFetcher} from '.';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let personFetcher: PersonFetcher;

beforeEach(() => {
  personFetcher = new PersonFetcher({
    endpointUrl: env.SEARCH_ENDPOINT_URL as string,
  });
});

describe('search', () => {
  it('finds all persons if no options are provided', async () => {
    const result = await personFetcher.search();

    expect(result).toStrictEqual({
      totalCount: 11,
      offset: 0,
      limit: 10,
      sortBy: 'relevance',
      sortOrder: 'desc',
      persons: [
        {
          id: 'https://example.org/persons/1',
          name: 'Michiel Adriaensz. de Ruyter',
          birthPlace: {id: 'Vlissingen', name: 'Vlissingen'},
          birthDate: new Date('1607-03-24T00:00:00.000Z'),
          deathPlace: {id: 'Syracuse', name: 'Syracuse'},
          deathDate: new Date('1676-04-29T00:00:00.000Z'),
          isPartOf: {id: 'Dataset 1', name: 'Dataset 1'},
        },
        {
          id: 'https://example.org/persons/10',
          name: 'Ida Oost',
          isPartOf: {id: 'Dataset 1', name: 'Dataset 1'},
        },
        {
          id: 'https://example.org/persons/11',
          name: 'Julienne Noordwest',
          isPartOf: {id: 'Dataset 3', name: 'Dataset 3'},
        },
        {
          id: 'https://example.org/persons/2',
          name: 'Jan de Vries',
          birthPlace: {id: 'Vlissienge', name: 'Vlissienge'},
          birthDate: new Date('1645-01-01T00:00:00.000Z'),
          deathPlace: {id: 'Amersfoort', name: 'Amersfoort'},
          deathDate: new Date('1701-01-01T00:00:00.000Z'),
          isPartOf: {id: 'Dataset 1', name: 'Dataset 1'},
        },
        {
          id: 'https://example.org/persons/3',
          name: 'Kees Jansen',
          birthPlace: {id: 'Groningen', name: 'Groningen'},
          birthDate: new Date('1645-12-05T00:00:00.000Z'),
          deathPlace: {id: 'Jakarta', name: 'Jakarta'},
          isPartOf: {id: 'Dataset 3', name: 'Dataset 3'},
        },
        {
          id: 'https://example.org/persons/4',
          name: 'Gert Nooitgedacht',
          birthPlace: {id: 'Batavia', name: 'Batavia'},
          birthDate: new Date('1815-09-27T00:00:00.000Z'),
          isPartOf: {id: 'Dataset 3', name: 'Dataset 3'},
        },
        {
          id: 'https://example.org/persons/5',
          name: 'Beatrice Vlieger',
          birthPlace: {id: 'Rotterdam', name: 'Rotterdam'},
          isPartOf: {id: 'Dataset 4', name: 'Dataset 4'},
        },
        {
          id: 'https://example.org/persons/6',
          name: 'Geeske van Châtellerault',
          birthPlace: {id: 'New York', name: 'New York'},
          isPartOf: {id: 'Dataset 4', name: 'Dataset 4'},
        },
        {
          id: 'https://example.org/persons/7',
          name: 'Theodora Noord',
          isPartOf: {id: 'Dataset 5', name: 'Dataset 5'},
        },
        {
          id: 'https://example.org/persons/8',
          name: 'Welmoed Zuid',
          isPartOf: {id: 'Dataset 5', name: 'Dataset 5'},
        },
      ],
      filters: {
        birthYears: [
          {totalCount: 1, id: '1607', name: '1607'},
          {totalCount: 3, id: '1645', name: '1645'},
          {totalCount: 1, id: '1815', name: '1815'},
        ],
        birthPlaces: [
          {totalCount: 1, id: 'Batavia', name: 'Batavia'},
          {totalCount: 1, id: 'Groningen', name: 'Groningen'},
          {totalCount: 1, id: 'New York', name: 'New York'},
          {totalCount: 2, id: 'Rotterdam', name: 'Rotterdam'},
          {totalCount: 1, id: 'Vlissienge', name: 'Vlissienge'},
          {totalCount: 1, id: 'Vlissingen', name: 'Vlissingen'},
        ],
        deathYears: [
          {totalCount: 1, id: '1676', name: '1676'},
          {totalCount: 2, id: '1701', name: '1701'},
        ],
        deathPlaces: [
          {totalCount: 2, id: 'Amersfoort', name: 'Amersfoort'},
          {totalCount: 1, id: 'Jakarta', name: 'Jakarta'},
          {totalCount: 1, id: 'Syracuse', name: 'Syracuse'},
        ],
      },
    });
  });

  it('finds persons if "birthYear" filter matches', async () => {
    const result = await personFetcher.search({
      filters: {
        birthYears: ['1607'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      persons: [
        {
          id: 'https://example.org/persons/1',
          name: 'Michiel Adriaensz. de Ruyter',
          birthPlace: {id: 'Vlissingen', name: 'Vlissingen'},
          birthDate: new Date('1607-03-24T00:00:00.000Z'),
          deathPlace: {id: 'Syracuse', name: 'Syracuse'},
          deathDate: new Date('1676-04-29T00:00:00.000Z'),
          isPartOf: {id: 'Dataset 1', name: 'Dataset 1'},
        },
      ],
      filters: {
        birthYears: [
          {totalCount: 1, id: '1607', name: '1607'},
          {totalCount: 0, id: '1645', name: '1645'},
          {totalCount: 0, id: '1815', name: '1815'},
        ],
      },
    });
  });

  it('finds persons if "deathYear" filter matches', async () => {
    const result = await personFetcher.search({
      filters: {
        deathYears: ['1676'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      persons: [
        {
          id: 'https://example.org/persons/1',
          name: 'Michiel Adriaensz. de Ruyter',
          birthPlace: {id: 'Vlissingen', name: 'Vlissingen'},
          birthDate: new Date('1607-03-24T00:00:00.000Z'),
          deathPlace: {id: 'Syracuse', name: 'Syracuse'},
          deathDate: new Date('1676-04-29T00:00:00.000Z'),
          isPartOf: {id: 'Dataset 1', name: 'Dataset 1'},
        },
      ],
      filters: {
        deathYears: [
          {totalCount: 1, id: '1676', name: '1676'},
          {totalCount: 0, id: '1701', name: '1701'},
        ],
      },
    });
  });
});

describe('getById', () => {
  it('returns undefined if no person matches the ID', async () => {
    const person = await personFetcher.getById({
      id: 'AnIdThatDoesNotExist',
    });

    expect(person).toBeUndefined();
  });

  it('returns the person that matches the ID', async () => {
    const person = await personFetcher.getById({
      id: 'https://example.org/persons/1',
    });

    expect(person).toStrictEqual({
      id: 'https://example.org/persons/1',
      name: 'Michiel Adriaensz. de Ruyter',
      birthPlace: {id: 'Vlissingen', name: 'Vlissingen'},
      birthDate: new Date('1607-03-24'),
      deathPlace: {id: 'Syracuse', name: 'Syracuse'},
      deathDate: new Date('1676-04-29'),
      isPartOf: {id: 'Dataset 1', name: 'Dataset 1'},
    });
  });
});
