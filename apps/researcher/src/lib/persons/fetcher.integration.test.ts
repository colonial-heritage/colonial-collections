import {PersonFetcher} from '.';
import {LabelFetcher} from '@colonial-collections/label-fetcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

const labelFetcher = new LabelFetcher({
  endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
});
let personFetcher: PersonFetcher;

beforeEach(() => {
  personFetcher = new PersonFetcher({
    endpointUrl: env.SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL as string,
    labelFetcher,
  });
});

describe('search', () => {
  it('finds all persons if no options are provided', async () => {
    const result = await personFetcher.search();

    expect(result).toStrictEqual({
      totalCount: 8,
      offset: 0,
      limit: 10,
      sortBy: 'relevance',
      sortOrder: 'desc',
      persons: [
        {
          id: 'https://example.org/persons/1',
          name: 'Michiel Adriaensz. de Ruyter',
          birthPlace: {id: 'Flushing', name: 'Flushing'},
          birthDate: new Date('1607-03-24'),
          deathPlace: {id: 'Syracuse', name: 'Syracuse'},
          deathDate: new Date('1676-04-29'),
          isPartOf: {id: 'https://example.org/datasets/1', name: 'Dataset 1'},
        },
        {
          id: 'https://example.org/persons/2',
          name: 'Jan de Vries',
          birthPlace: {id: 'Amersfoort', name: 'Amersfoort'},
          birthDate: new Date('1645-12-05'),
          deathPlace: {id: 'Flushing', name: 'Flushing'},
          deathDate: new Date('1701-09-29'),
          isPartOf: {id: 'https://example.org/datasets/1', name: 'Dataset 1'},
        },
        {
          id: 'https://example.org/persons/3',
          name: 'Kees Jansen',
          birthPlace: {id: 'Groningen', name: 'Groningen'},
          birthDate: new Date('1645-12-05'),
          deathPlace: {id: 'Jakarta', name: 'Jakarta'},
          isPartOf: {id: 'https://example.org/datasets/3', name: 'Dataset 3'},
        },
        {
          id: 'https://example.org/persons/4',
          name: 'Gert Nooitgedacht',
          birthPlace: {id: 'Bali', name: 'Bali'},
          birthDate: new Date('1815-09-27'),
          isPartOf: {id: 'https://example.org/datasets/3', name: 'Dataset 3'},
        },
        {
          id: 'https://example.org/persons/5',
          name: 'Beatrice Vlieger',
          birthPlace: {id: 'Rotterdam', name: 'Rotterdam'},
          isPartOf: {id: 'https://example.org/datasets/4', name: 'Dataset 4'},
        },
        {
          id: 'https://example.org/persons/6',
          name: 'Geeske van Châtellerault',
          birthPlace: {id: 'New York', name: 'New York'},
          isPartOf: {id: 'https://example.org/datasets/4', name: 'Dataset 4'},
        },
        {
          id: 'https://example.org/persons/7',
          name: 'Theodora Noord',
          isPartOf: {id: 'https://example.org/datasets/5', name: 'Dataset 5'},
        },
        {
          id: 'https://example.org/persons/8',
          name: 'Welmoed Zuid',
          isPartOf: {id: 'https://example.org/datasets/5', name: 'Dataset 5'},
        },
      ],
      filters: {
        birthPlaces: [
          {totalCount: 1, id: 'Amersfoort', name: 'Amersfoort'},
          {totalCount: 1, id: 'Bali', name: 'Bali'},
          {totalCount: 1, id: 'Flushing', name: 'Flushing'},
          {totalCount: 1, id: 'Groningen', name: 'Groningen'},
          {totalCount: 1, id: 'New York', name: 'New York'},
          {totalCount: 1, id: 'Rotterdam', name: 'Rotterdam'},
        ],
        deathPlaces: [
          {totalCount: 1, id: 'Flushing', name: 'Flushing'},
          {totalCount: 1, id: 'Jakarta', name: 'Jakarta'},
          {totalCount: 1, id: 'Syracuse', name: 'Syracuse'},
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
      birthPlace: {id: 'Flushing', name: 'Flushing'},
      birthDate: new Date('1607-03-24'),
      deathPlace: {id: 'Syracuse', name: 'Syracuse'},
      deathDate: new Date('1676-04-29'),
      isPartOf: {id: 'https://example.org/datasets/1', name: 'Dataset 1'},
    });
  });
});
