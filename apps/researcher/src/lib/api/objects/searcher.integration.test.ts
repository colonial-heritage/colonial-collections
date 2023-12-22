import {HeritageObjectFetcher} from './fetcher';
import {HeritageObjectSearcher} from './searcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let heritageObjectSearcher: HeritageObjectSearcher;

const heritageObjectFetcher = new HeritageObjectFetcher({
  endpointUrl: env.SPARQL_ENDPOINT_URL as string,
});

beforeEach(() => {
  heritageObjectSearcher = new HeritageObjectSearcher({
    endpointUrl: env.SEARCH_ENDPOINT_URL as string,
    heritageObjectFetcher,
  });
});

describe('search', () => {
  it('finds all heritage objects if no options are provided', async () => {
    const result = await heritageObjectSearcher.search();

    expect(result).toStrictEqual({
      totalCount: 5,
      offset: 0,
      limit: 10,
      sortBy: 'relevance',
      sortOrder: 'desc',
      heritageObjects: [
        {
          id: 'https://example.org/objects/1',
          identifier: '1234',
          name: 'Object 1',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultrices velit vitae vulputate tincidunt. Donec dictum tortor nec tempus mollis.',
          types: expect.arrayContaining([
            {
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              name: 'Painting',
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
              name: 'Canvas',
            },
            {
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              name: 'Oilpaint',
            },
          ]),
          creators: expect.arrayContaining([
            {
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              type: 'Person',
              name: 'Vincent van Gogh',
            },
          ]),
          dateCreated: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1889-05-01T00:00:00.000Z'),
            endDate: new Date('1890-12-01T00:00:00.000Z'),
          },
          locationCreated: {
            id: 'https://sws.geonames.org/3382998/',
            name: 'Suriname',
          },
          images: expect.arrayContaining([
            {
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              contentUrl:
                'http://images.memorix.nl/rce/thumb/1600x1600/e0164095-6a2d-b448-cc59-3a8ab2fafed7.jpg',
              license: {
                id: 'http://rightsstatements.org/vocab/InC/1.0/',
                name: 'In Copyright',
              },
            },
            {
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              contentUrl:
                'http://images.memorix.nl/rce/thumb/1600x1600/fceac847-88f4-8066-d960-326dc79be0d3.jpg',
            },
          ]),
          isPartOf: {
            id: 'https://example.org/datasets/1',
            name: 'Dataset 1',
            publisher: {
              id: 'https://museum.example.org/',
              type: 'Organization',
              name: 'Museum',
            },
          },
        },
        {
          id: 'https://example.org/objects/2',
          identifier: '5678',
          name: 'Object 2',
          description:
            'Suspendisse ut condimentum leo, et vulputate lectus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce vel volutpat nunc. Sed vel libero ac lorem dapibus euismod. Aenean a ante et turpis bibendum consectetur at pulvinar quam.',
          types: expect.arrayContaining([
            {
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              name: 'Photo',
            },
          ]),
          subjects: expect.arrayContaining([
            {
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              name: 'Palace',
            },
          ]),
          materials: expect.arrayContaining([
            {
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              name: 'Paper',
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
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              type: 'Person',
              name: 'Adriaan Boer',
            },
          ]),
          dateCreated: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1895-02-01T00:00:00.000Z'),
            endDate: new Date('1895-02-15T00:00:00.000Z'),
          },
          locationCreated: {
            id: 'https://sws.geonames.org/1642911/',
            name: 'Jakarta',
            isPartOf: {
              id: 'https://sws.geonames.org/1643084/',
              name: 'Indonesia',
            },
          },
          images: expect.arrayContaining([
            {
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              contentUrl:
                'http://images.memorix.nl/rce/thumb/1600x1600/1f3fd6a1-164c-2fe9-c222-3c6dbd32d33d.jpg',
            },
          ]),
          isPartOf: {
            id: 'https://example.org/datasets/13',
            name: 'Dataset 13',
            publisher: {
              id: 'https://research.example.org/',
              type: 'Organization',
              name: 'Research Organisation',
            },
          },
        },
        {
          id: 'https://example.org/objects/3',
          identifier: '9012',
          name: 'Object 3',
          description:
            'Ut dictum elementum augue sit amet sodales. Vivamus viverra ligula sed arcu cursus sagittis. Donec ac placerat lacus.',
          types: expect.arrayContaining([
            {
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              name: 'Drawing',
            },
          ]),
          subjects: expect.arrayContaining([
            {
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              name: 'Cottage',
            },
            {
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              name: 'Castle',
            },
          ]),
          inscriptions: ['Maecenas commodo est neque'],
          materials: expect.arrayContaining([
            {
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              name: 'Paper',
            },
            {
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              name: 'Ink',
            },
          ]),
          dateCreated: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1725-01-01T00:00:00.000Z'),
            endDate: new Date('1736-01-01T00:00:00.000Z'),
          },
          locationCreated: {
            id: 'https://sws.geonames.org/1642673/',
            name: 'Java',
            isPartOf: {
              id: 'https://sws.geonames.org/1643084/',
              name: 'Indonesia',
            },
          },
          isPartOf: {
            id: 'https://example.org/datasets/10',
            name: 'Dataset 10',
            publisher: {
              id: 'https://library.example.org/',
              type: 'Organization',
              name: 'Library',
            },
          },
        },
        {
          id: 'https://example.org/objects/4',
          isPartOf: {
            id: 'https://example.org/datasets/1',
            name: 'Dataset 1',
            publisher: {
              id: 'https://museum.example.org/',
              type: 'Organization',
              name: 'Museum',
            },
          },
        },
        {
          id: 'https://example.org/objects/5',
          identifier: '7890',
          name: 'Object 5',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultrices velit vitae vulputate tincidunt. Donec dictum tortor nec tempus mollis.',
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
          inscriptions: ['Maecenas commodo est neque'],
          materials: expect.arrayContaining([
            {
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              name: 'Canvas',
            },
            {
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              name: 'Oilpaint',
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
              id: expect.stringContaining(
                'https://data.colonialcollections.nl/.well-known/genid/'
              ),
              type: 'Person',
              name: 'Geeske van Châtellerault',
            },
          ]),
          dateCreated: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1901-01-01T00:00:00.000Z'),
            endDate: new Date('1902-06-01T00:00:00.000Z'),
          },
          locationCreated: {
            id: 'https://sws.geonames.org/1749659/',
            name: 'Pulau Sebang',
            isPartOf: {
              id: 'https://sws.geonames.org/1733045/',
              name: 'Malaysia',
            },
          },
          images: expect.arrayContaining([
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
          ]),
          isPartOf: {
            id: 'https://example.org/datasets/1',
            name: 'Dataset 1',
            publisher: {
              id: 'https://museum.example.org/',
              type: 'Organization',
              name: 'Museum',
            },
          },
        },
      ],
      filters: {
        types: [
          {
            totalCount: 1,
            id: 'Canvas Painting',
            name: 'Canvas Painting',
          },
          {
            totalCount: 1,
            id: 'Drawing',
            name: 'Drawing',
          },
          {
            totalCount: 1,
            id: 'Painting',
            name: 'Painting',
          },
          {
            totalCount: 1,
            id: 'Photo',
            name: 'Photo',
          },
        ],
        subjects: [
          {
            totalCount: 2,
            id: 'Celebrations',
            name: 'Celebrations',
          },
          {
            totalCount: 1,
            id: 'Castle',
            name: 'Castle',
          },
          {
            totalCount: 1,
            id: 'Cottage',
            name: 'Cottage',
          },
          {
            totalCount: 1,
            id: 'Palace',
            name: 'Palace',
          },
        ],
        locations: [
          {
            totalCount: 2,
            id: 'Indonesia',
            name: 'Indonesia',
          },
          {
            totalCount: 1,
            id: 'Malaysia',
            name: 'Malaysia',
          },
          {
            totalCount: 1,
            id: 'Suriname',
            name: 'Suriname',
          },
        ],
        materials: [
          {
            totalCount: 2,
            id: 'Canvas',
            name: 'Canvas',
          },
          {
            totalCount: 2,
            id: 'Oilpaint',
            name: 'Oilpaint',
          },
          {
            totalCount: 2,
            id: 'Paper',
            name: 'Paper',
          },
          {
            totalCount: 1,
            id: 'Ink',
            name: 'Ink',
          },
        ],
        creators: [
          {
            totalCount: 1,
            id: 'Adriaan Boer',
            name: 'Adriaan Boer',
          },
          {
            totalCount: 1,
            id: 'Geeske van Châtellerault',
            name: 'Geeske van Châtellerault',
          },
          {
            totalCount: 1,
            id: 'Vincent van Gogh',
            name: 'Vincent van Gogh',
          },
        ],
        publishers: [
          {
            totalCount: 3,
            id: 'Museum',
            name: 'Museum',
          },
          {
            totalCount: 1,
            id: 'Library',
            name: 'Library',
          },
          {
            totalCount: 1,
            id: 'Onderzoeksinstelling',
            name: 'Onderzoeksinstelling',
          },
          {
            totalCount: 1,
            id: 'Research Organisation',
            name: 'Research Organisation',
          },
        ],
        dateCreatedStart: [
          {
            totalCount: 1,
            id: 1725,
            name: 1725,
          },
          {
            totalCount: 1,
            id: 1889,
            name: 1889,
          },
          {
            totalCount: 1,
            id: 1895,
            name: 1895,
          },
          {
            totalCount: 1,
            id: 1901,
            name: 1901,
          },
        ],
        dateCreatedEnd: [
          {
            totalCount: 1,
            id: 1736,
            name: 1736,
          },
          {
            totalCount: 1,
            id: 1890,
            name: 1890,
          },
          {
            totalCount: 1,
            id: 1895,
            name: 1895,
          },
          {
            totalCount: 1,
            id: 1902,
            name: 1902,
          },
        ],
      },
    });
  });

  it('finds heritage objects if "types" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        types: ['Painting'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        types: [{totalCount: 1, id: 'Painting', name: 'Painting'}],
      },
    });
  });

  it('finds heritage objects if "subjects" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        subjects: ['Castle'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        subjects: [
          {totalCount: 1, id: 'Castle', name: 'Castle'},
          {totalCount: 1, id: 'Cottage', name: 'Cottage'},
        ],
      },
    });
  });

  it('finds heritage objects if "locations" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        locations: ['Malaysia'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        locations: [{totalCount: 1, id: 'Malaysia', name: 'Malaysia'}],
      },
    });
  });

  it('finds heritage objects if "materials" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        materials: ['Canvas'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 2,
      filters: {
        materials: [
          {
            totalCount: 2,
            id: 'Canvas',
            name: 'Canvas',
          },
          {
            totalCount: 2,
            id: 'Oilpaint',
            name: 'Oilpaint',
          },
        ],
      },
    });
  });

  it('finds heritage objects if "creators" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        creators: ['Adriaan Boer'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        creators: [
          {
            totalCount: 1,
            id: 'Adriaan Boer',
            name: 'Adriaan Boer',
          },
        ],
      },
    });
  });

  it('finds heritage objects if "publishers" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        publishers: ['Library'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        publishers: [
          {
            totalCount: 1,
            id: 'Library',
            name: 'Library',
          },
        ],
      },
    });
  });

  it('finds heritage objects if "dateCreatedStart" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        dateCreatedStart: 1901,
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        dateCreatedStart: [
          {
            totalCount: 1,
            id: 1901,
            name: 1901,
          },
        ],
      },
    });
  });

  it('finds heritage objects if "dateCreatedEnd" filter matches', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        dateCreatedEnd: 1736,
      },
    });

    expect(result).toMatchObject({
      totalCount: 1,
      filters: {
        dateCreatedEnd: [
          {
            totalCount: 1,
            id: 1736,
            name: 1736,
          },
        ],
      },
    });
  });

  it('finds heritage objects between "dateCreatedStart" and "dateCreatedEnd", inclusive', async () => {
    const result = await heritageObjectSearcher.search({
      filters: {
        dateCreatedStart: 1725,
        dateCreatedEnd: 1895,
      },
    });

    expect(result).toMatchObject({
      totalCount: 3,
      filters: {
        dateCreatedStart: [
          {
            totalCount: 1,
            id: 1725,
            name: 1725,
          },
          {
            totalCount: 1,
            id: 1889,
            name: 1889,
          },
          {
            totalCount: 1,
            id: 1895,
            name: 1895,
          },
        ],
        dateCreatedEnd: [
          {
            totalCount: 1,
            id: 1736,
            name: 1736,
          },
          {
            totalCount: 1,
            id: 1890,
            name: 1890,
          },
          {
            totalCount: 1,
            id: 1895,
            name: 1895,
          },
        ],
      },
    });
  });
});
