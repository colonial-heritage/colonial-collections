import {ConstituentFetcher} from './fetcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let constituentFetcher: ConstituentFetcher;

beforeEach(() => {
  constituentFetcher = new ConstituentFetcher({
    endpointUrl: env.SPARQL_ENDPOINT_URL as string,
  });
});

describe('getByIds', () => {
  it('returns empty list if no IDs were provided', async () => {
    const constituents = await constituentFetcher.getByIds({ids: []});

    expect(constituents).toEqual([]);
  });

  it('returns empty list if no constituents match the IDs', async () => {
    const constituents = await constituentFetcher.getByIds({
      ids: ['https://unknown.org/'],
    });

    expect(constituents).toEqual([]);
  });

  it('returns the constituents that match the IDs', async () => {
    const constituents = await constituentFetcher.getByIds({
      ids: [
        'https://example.org/constituents/1',
        'https://example.org/constituents/2',
      ],
    });

    expect(constituents).toMatchObject([
      {
        id: 'https://example.org/constituents/1',
      },
      {
        id: 'https://example.org/constituents/2',
      },
    ]);
  });
});

describe('getById', () => {
  it('returns undefined if a malformed ID is used', async () => {
    const constituent = await constituentFetcher.getById({
      id: 'malformedID',
    });

    expect(constituent).toBeUndefined();
  });

  it('returns undefined if no constituent matches the ID', async () => {
    const constituent = await constituentFetcher.getById({
      id: 'https://unknown.org/',
    });

    expect(constituent).toBeUndefined();
  });

  it('returns the constituent that matches the ID', async () => {
    const constituent = await constituentFetcher.getById({
      id: 'https://example.org/constituents/1',
    });

    expect(constituent).toStrictEqual({
      id: 'https://example.org/constituents/1',
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
    });
  });
});
