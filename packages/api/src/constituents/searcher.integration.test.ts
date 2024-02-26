import {ConstituentFetcher} from './fetcher';
import {ConstituentSearcher} from './searcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let constituentSearcher: ConstituentSearcher;

const constituentFetcher = new ConstituentFetcher({
  endpointUrl: env.SPARQL_ENDPOINT_URL as string,
});

beforeEach(() => {
  constituentSearcher = new ConstituentSearcher({
    endpointUrl: env.SEARCH_ENDPOINT_URL as string,
    constituentFetcher,
  });
});

describe('search', () => {
  it('finds all constituents if no options are provided', async () => {
    const result = await constituentSearcher.search();

    expect(result).toStrictEqual({
      totalCount: 11,
      offset: 0,
      limit: 10,
      sortBy: 'birthYear',
      sortOrder: 'asc',
      constituents: [
        {
          id: 'https://example.org/persons/1',
          type: 'Person',
          name: 'Michiel Adriaensz. de Ruyter',
          birthDate: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1607-03-24T00:00:00.000Z'),
            endDate: new Date('1607-03-24T23:59:59.999Z'),
          },
          birthPlace: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            name: 'Vlissingen',
          },
          deathDate: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1676-04-29T00:00:00.000Z'),
            endDate: new Date('1676-04-29T23:59:59.999Z'),
          },
          deathPlace: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            name: 'Syracuse',
          },
          isPartOf: {
            id: 'https://example.org/datasets/1',
            name: 'Dataset 1',
            publisher: {
              id: 'https://museum.example.org/',
              type: 'Organization',
              name: 'The Museum',
            },
          },
        },
        {
          id: 'https://example.org/persons/2',
          type: 'Person',
          name: 'Jan de Vries',
          birthDate: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1645-01-01T00:00:00.000Z'),
            endDate: new Date('1645-12-31T23:59:59.999Z'),
          },
          birthPlace: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            name: 'Vlissienge',
          },
          deathDate: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1701-01-01T00:00:00.000Z'),
            endDate: new Date('1701-12-31T23:59:59.999Z'),
          },
          deathPlace: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            name: 'Amersfoort',
          },
          isPartOf: {
            id: 'https://example.org/datasets/1',
            name: 'Dataset 1',
            publisher: {
              id: 'https://museum.example.org/',
              type: 'Organization',
              name: 'The Museum',
            },
          },
        },
        {
          id: 'https://example.org/persons/3',
          type: 'Person',
          name: 'Kees Jansen',
          birthDate: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1645-12-05T00:00:00.000Z'),
            endDate: new Date('1645-12-05T23:59:59.999Z'),
          },
          birthPlace: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            name: 'Groningen',
          },
          deathPlace: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            name: 'Jakarta',
          },
          isPartOf: {
            id: 'https://example.org/datasets/3',
            name: 'Dataset 3',
            publisher: {
              id: 'https://archive.example.org/',
              type: 'Organization',
              name: 'Archive',
            },
          },
        },
        {
          id: 'https://example.org/persons/9',
          type: 'Person',
          name: "Karel van 't Westen",
          birthDate: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1645-02-01T00:00:00.000Z'),
            endDate: new Date('1645-02-28T23:59:59.999Z'),
          },
          birthPlace: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            name: 'Rotterdam',
          },
          deathDate: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1701-07-01T00:00:00.000Z'),
            endDate: new Date('1701-07-31T23:59:59.999Z'),
          },
          deathPlace: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            name: 'Amersfoort',
          },
          isPartOf: {
            id: 'https://example.org/datasets/1',
            name: 'Dataset 1',
            publisher: {
              id: 'https://museum.example.org/',
              type: 'Organization',
              name: 'The Museum',
            },
          },
        },
        {
          id: 'https://example.org/persons/4',
          type: 'Person',
          name: 'Gert Nooitgedacht',
          birthDate: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1815-09-27T00:00:00.000Z'),
            endDate: new Date('1815-09-27T23:59:59.999Z'),
          },
          birthPlace: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            name: 'Batavia',
          },
          isPartOf: {
            id: 'https://example.org/datasets/3',
            name: 'Dataset 3',
            publisher: {
              id: 'https://archive.example.org/',
              type: 'Organization',
              name: 'Archive',
            },
          },
        },
        {
          id: 'https://example.org/persons/10',
          type: 'Person',
          name: 'Ida Oost',
          birthDate: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: undefined,
            endDate: undefined,
          },
          isPartOf: {
            id: 'https://example.org/datasets/1',
            name: 'Dataset 1',
            publisher: {
              id: 'https://museum.example.org/',
              type: 'Organization',
              name: 'The Museum',
            },
          },
        },
        {
          id: 'https://example.org/persons/11',
          type: 'Person',
          name: 'Julienne Noordwest',
          deathDate: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: undefined,
            endDate: undefined,
          },
          isPartOf: {
            id: 'https://example.org/datasets/3',
            name: 'Dataset 3',
            publisher: {
              id: 'https://archive.example.org/',
              type: 'Organization',
              name: 'Archive',
            },
          },
        },
        {
          id: 'https://example.org/persons/5',
          type: 'Person',
          name: 'Beatrice Vlieger',
          birthPlace: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            name: 'Rotterdam',
          },
          isPartOf: {
            id: 'https://example.org/datasets/4',
            name: 'Dataset 4',
            publisher: {
              id: 'https://museum.example.org/',
              type: 'Organization',
              name: 'The Museum',
            },
          },
        },
        {
          id: 'https://example.org/persons/6',
          type: 'Person',
          name: 'Geeske van Châtellerault',
          birthPlace: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            name: 'New York',
          },
          isPartOf: {
            id: 'https://example.org/datasets/4',
            name: 'Dataset 4',
            publisher: {
              id: 'https://museum.example.org/',
              type: 'Organization',
              name: 'The Museum',
            },
          },
        },
        {
          id: 'https://example.org/persons/7',
          type: 'Person',
          name: 'Theodora Noord',
          isPartOf: {
            id: 'https://example.org/datasets/5',
            name: 'Dataset 5',
            publisher: {
              id: 'https://archive.example.org/',
              type: 'Organization',
              name: 'Archive',
            },
          },
        },
      ],
      filters: {
        birthYears: [
          {
            totalCount: 3,
            id: '1645',
            name: '1645',
          },
          {
            totalCount: 1,
            id: '1607',
            name: '1607',
          },
          {
            totalCount: 1,
            id: '1815',
            name: '1815',
          },
        ],
        birthPlaces: [
          {
            totalCount: 2,
            id: 'Rotterdam',
            name: 'Rotterdam',
          },
          {
            totalCount: 1,
            id: 'Batavia',
            name: 'Batavia',
          },
          {
            totalCount: 1,
            id: 'Groningen',
            name: 'Groningen',
          },
          {
            totalCount: 1,
            id: 'New York',
            name: 'New York',
          },
          {
            totalCount: 1,
            id: 'Vlissienge',
            name: 'Vlissienge',
          },
          {
            totalCount: 1,
            id: 'Vlissingen',
            name: 'Vlissingen',
          },
        ],
        deathYears: [
          {
            totalCount: 2,
            id: '1701',
            name: '1701',
          },
          {
            totalCount: 1,
            id: '1676',
            name: '1676',
          },
        ],
        deathPlaces: [
          {
            totalCount: 2,
            id: 'Amersfoort',
            name: 'Amersfoort',
          },
          {
            totalCount: 1,
            id: 'Jakarta',
            name: 'Jakarta',
          },
          {
            totalCount: 1,
            id: 'Syracuse',
            name: 'Syracuse',
          },
        ],
        publishers: [
          {
            totalCount: 6,
            id: 'The Museum',
            name: 'The Museum',
          },
          {
            totalCount: 5,
            id: 'Archive',
            name: 'Archive',
          },
        ],
      },
    });
  });

  it('finds constituents if "birthYears" filter matches', async () => {
    const result = await constituentSearcher.search({
      filters: {
        birthYears: ['1607'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        birthYears: [{totalCount: 1, id: '1607', name: '1607'}],
      },
    });
  });

  it('finds constituents if "birthPlaces" filter matches', async () => {
    const result = await constituentSearcher.search({
      filters: {
        birthPlaces: ['Vlissingen'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        birthPlaces: [{totalCount: 1, id: 'Vlissingen', name: 'Vlissingen'}],
      },
    });
  });

  it('finds constituents if "deathYears" filter matches', async () => {
    const result = await constituentSearcher.search({
      filters: {
        deathYears: ['1676'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        deathYears: [{totalCount: 1, id: '1676', name: '1676'}],
      },
    });
  });

  it('finds constituents if "deathPlaces" filter matches', async () => {
    const result = await constituentSearcher.search({
      filters: {
        deathPlaces: ['Syracuse'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        deathPlaces: [
          {
            totalCount: 1,
            id: 'Syracuse',
            name: 'Syracuse',
          },
        ],
      },
    });
  });

  it('finds constituents if "publishers" filter matches', async () => {
    const result = await constituentSearcher.search({
      filters: {
        publishers: ['The Museum'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 6,
      filters: {
        publishers: [
          {
            totalCount: 6,
            id: 'The Museum',
            name: 'The Museum',
          },
        ],
      },
    });
  });
});

describe('search with localized names', () => {
  it('finds constituents with English names', async () => {
    // Currently the only localized parts
    const result = await constituentSearcher.search({
      locale: 'en',
      filters: {
        publishers: ['The Museum'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 6,
      filters: {
        publishers: [
          {
            totalCount: 6,
            id: 'The Museum',
            name: 'The Museum',
          },
        ],
      },
    });
  });

  it('finds constituents with Dutch names', async () => {
    // Currently the only localized parts
    const result = await constituentSearcher.search({
      locale: 'nl',
      filters: {
        publishers: ['Het Museum'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 6,
      filters: {
        publishers: [
          {
            totalCount: 6,
            id: 'Het Museum',
            name: 'Het Museum',
          },
        ],
      },
    });
  });
});
