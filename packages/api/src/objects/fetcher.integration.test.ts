import {HeritageObjectFetcher} from './fetcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let heritageObjectFetcher: HeritageObjectFetcher;

beforeEach(() => {
  heritageObjectFetcher = new HeritageObjectFetcher({
    endpointUrl: env.SPARQL_ENDPOINT_URL as string,
  });
});

describe('getByIds', () => {
  it('returns empty list if no IDs were provided', async () => {
    const heritageObjects = await heritageObjectFetcher.getByIds({ids: []});

    expect(heritageObjects).toEqual([]);
  });

  it('returns empty list if no heritage objects match the IDs', async () => {
    const heritageObjects = await heritageObjectFetcher.getByIds({
      ids: ['https://unknown.org/'],
    });

    expect(heritageObjects).toEqual([]);
  });

  it('returns the heritage objects that match the IDs', async () => {
    const heritageObjects = await heritageObjectFetcher.getByIds({
      ids: ['https://example.org/objects/1', 'https://example.org/objects/5'],
    });

    expect(heritageObjects).toMatchObject([
      {
        id: 'https://example.org/objects/1',
      },
      {
        id: 'https://example.org/objects/5',
      },
    ]);
  });
});

describe('getById', () => {
  it('returns undefined if a malformed ID is used', async () => {
    const heritageObject = await heritageObjectFetcher.getById({
      id: 'malformedID',
    });

    expect(heritageObject).toBeUndefined();
  });

  it('returns undefined if no heritage object matches the ID', async () => {
    const heritageObject = await heritageObjectFetcher.getById({
      id: 'https://unknown.org/',
    });

    expect(heritageObject).toBeUndefined();
  });

  it('returns the heritage object that matches the ID', async () => {
    const heritageObject = await heritageObjectFetcher.getById({
      id: 'https://example.org/objects/5',
    });

    expect(heritageObject).toStrictEqual({
      id: 'https://example.org/objects/5',
      name: 'Object 5',
      identifier: '7890',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultrices velit vitae vulputate tincidunt. Donec dictum tortor nec tempus mollis.',
      inscriptions: ['Maecenas commodo est neque'],
      types: expect.arrayContaining([
        {
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          name: 'Canvas Painting',
        },
      ]),
      subjects: expect.arrayContaining([
        {
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          name: 'Celebrations',
        },
      ]),
      materials: expect.arrayContaining([
        {
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          name: 'Oilpaint',
        },
        {
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          name: 'Canvas',
        },
      ]),
      techniques: expect.arrayContaining([
        {
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          name: 'Albumen process',
        },
      ]),
      creators: expect.arrayContaining([
        {
          type: 'Person',
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          name: 'Geeske van Châtellerault',
        },
      ]),
      dateCreated: {
        id: expect.stringContaining(
          'https://data.colonialcollections.nl/.well-known/genid/'
        ),
        startDate: new Date('1901-01-01T00:00:00.000Z'),
        endDate: new Date('1902-06-30T23:59:59.999Z'),
      },
      locationsCreated: expect.arrayContaining([
        {
          id: 'https://sws.geonames.org/1749659/',
          name: 'Pulau Sebang',
          isPartOf: {
            id: 'https://sws.geonames.org/1733045/',
            name: 'Malaysia',
          },
        },
      ]),
      images: expect.arrayContaining([
        {
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          contentUrl:
            'http://images.memorix.nl/rce/thumb/1600x1600/fceac847-88f4-8066-d960-326dc79be0d3.jpg',
          license: {
            id: 'https://creativecommons.org/licenses/by/4.0/',
            name: 'Attribution 4.0 International (CC BY 4.0)',
          },
        },
        {
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          contentUrl:
            'http://images.memorix.nl/rce/thumb/1600x1600/e0164095-6a2d-b448-cc59-3a8ab2fafed7.jpg',
          license: {
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          },
        },
      ]),
      mainEntityOfPage: 'https://id.rijksmuseum.nl/200112226',
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

describe('get with localized names', () => {
  it('returns a heritage object with English names', async () => {
    const heritageObject = await heritageObjectFetcher.getById({
      locale: 'en',
      id: 'https://example.org/objects/5',
    });

    // Currently the only localized parts
    expect(heritageObject).toMatchObject({
      id: 'https://example.org/objects/5',
      locationsCreated: [
        {
          id: 'https://sws.geonames.org/1749659/',
          name: 'Pulau Sebang',
          isPartOf: {
            id: 'https://sws.geonames.org/1733045/',
            name: 'Malaysia',
          },
        },
      ],
      types: expect.arrayContaining([
        {
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          name: 'Canvas Painting',
        },
      ]),
      materials: expect.arrayContaining([
        {
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          name: 'Oilpaint',
        },
        {
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          name: 'Canvas',
        },
      ]),
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

  it('returns a heritage object with Dutch names', async () => {
    const heritageObject = await heritageObjectFetcher.getById({
      locale: 'nl',
      id: 'https://example.org/objects/5',
    });

    // Currently the only localized parts
    expect(heritageObject).toMatchObject({
      id: 'https://example.org/objects/5',
      locationsCreated: [
        {
          id: 'https://sws.geonames.org/1749659/',
          name: 'Pulau Sebang',
          isPartOf: {
            id: 'https://sws.geonames.org/1733045/',
            name: 'Maleisië',
          },
        },
      ],
      types: expect.arrayContaining([
        {
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          name: 'Schildering op doek',
        },
      ]),
      materials: expect.arrayContaining([
        {
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          name: 'Olieverf',
        },
        {
          id: expect.stringContaining(
            'https://data.colonialcollections.nl/.well-known/genid/'
          ),
          name: 'Canvas',
        },
      ]),
      isPartOf: {
        id: 'https://example.org/datasets/1',
        name: 'Dataset 1',
        publisher: {
          id: 'https://museum.example.org/',
          type: 'Organization',
          name: 'Het Museum',
        },
      },
    });
  });
});
