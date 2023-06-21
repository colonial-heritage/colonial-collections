import {HeritageObjectEnricher, HeritageObjectFetcher} from '.';
import {LabelFetcher} from '@colonial-collections/label-fetcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

const labelFetcher = new LabelFetcher({
  endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
});

const heritageObjectEnricher = new HeritageObjectEnricher({
  endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
});

let heritageObjectFetcher: HeritageObjectFetcher;

beforeEach(() => {
  heritageObjectFetcher = new HeritageObjectFetcher({
    endpointUrl: env.SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL as string,
    labelFetcher,
    heritageObjectEnricher,
  });
});

describe('search', () => {
  it('finds all heritage objects if no options are provided', async () => {
    const result = await heritageObjectFetcher.search();

    expect(result).toStrictEqual({
      totalCount: 5,
      offset: 0,
      limit: 10,
      sortBy: 'relevance',
      sortOrder: 'desc',
      heritageObjects: [
        {
          id: 'https://example.org/objects/1',
          name: 'Object 1',
          identifier: '1234',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultrices velit vitae vulputate tincidunt. Donec dictum tortor nec tempus mollis.',
          types: [{id: 'Painting', name: 'Painting'}],
          subjects: [{id: 'Celebrations', name: 'Celebrations'}],
          materials: [
            {id: 'Canvas', name: 'Canvas'},
            {id: 'Oilpaint', name: 'Oilpaint'},
          ],
          creators: [{id: 'Vincent van Gogh', name: 'Vincent van Gogh'}],
          images: [
            {
              id: 'http://images.memorix.nl/rce/thumb/1600x1600/e0164095-6a2d-b448-cc59-3a8ab2fafed7.jpg',
              contentUrl:
                'http://images.memorix.nl/rce/thumb/1600x1600/e0164095-6a2d-b448-cc59-3a8ab2fafed7.jpg',
            },
            {
              id: 'http://images.memorix.nl/rce/thumb/1600x1600/fceac847-88f4-8066-d960-326dc79be0d3.jpg',
              contentUrl:
                'http://images.memorix.nl/rce/thumb/1600x1600/fceac847-88f4-8066-d960-326dc79be0d3.jpg',
            },
          ],
          owner: {id: 'Museum', name: 'Museum'},
          isPartOf: {id: 'https://example.org/datasets/1', name: 'Dataset 1'},
        },
        {
          id: 'https://example.org/objects/2',
          name: 'Object 2',
          identifier: '5678',
          description:
            'Suspendisse ut condimentum leo, et vulputate lectus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce vel volutpat nunc. Sed vel libero ac lorem dapibus euismod. Aenean a ante et turpis bibendum consectetur at pulvinar quam.',
          types: [{id: 'Photo', name: 'Photo'}],
          subjects: [{id: 'Palace', name: 'Palace'}],
          materials: [{id: 'Paper', name: 'Paper'}],
          techniques: [{id: 'Albumen process', name: 'Albumen process'}],
          creators: [{id: 'Adriaan Boer', name: 'Adriaan Boer'}],
          images: [
            {
              id: 'http://images.memorix.nl/rce/thumb/1600x1600/1f3fd6a1-164c-2fe9-c222-3c6dbd32d33d.jpg',
              contentUrl:
                'http://images.memorix.nl/rce/thumb/1600x1600/1f3fd6a1-164c-2fe9-c222-3c6dbd32d33d.jpg',
            },
          ],
          owner: {id: 'Research Organisation', name: 'Research Organisation'},
          isPartOf: {id: 'https://example.org/datasets/13', name: 'Dataset 13'},
        },
        {
          id: 'https://example.org/objects/3',
          name: 'Object 3',
          identifier: '9012',
          description:
            'Ut dictum elementum augue sit amet sodales. Vivamus viverra ligula sed arcu cursus sagittis. Donec ac placerat lacus.',
          inscriptions: ['Maecenas commodo est neque'],
          types: [{id: 'Drawing', name: 'Drawing'}],
          subjects: [
            {id: 'Castle', name: 'Castle'},
            {id: 'Cottage', name: 'Cottage'},
          ],
          materials: [
            {id: 'Ink', name: 'Ink'},
            {id: 'Paper', name: 'Paper'},
          ],
          owner: {id: 'Library', name: 'Library'},
          isPartOf: {id: 'https://example.org/datasets/10', name: '(No name)'},
        },
        {
          id: 'https://example.org/objects/4',
          identifier: '3456',
          isPartOf: {id: 'https://example.org/datasets/1', name: 'Dataset 1'},
        },
        {
          id: 'https://example.org/objects/5',
          name: 'Object 5',
          identifier: '7890',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultrices velit vitae vulputate tincidunt. Donec dictum tortor nec tempus mollis.',
          inscriptions: ['Maecenas commodo est neque'],
          types: [{id: 'Canvas Painting', name: 'Canvas Painting'}],
          subjects: [{id: 'Celebrations', name: 'Celebrations'}],
          materials: [
            {id: 'Canvas', name: 'Canvas'},
            {id: 'Oilpaint', name: 'Oilpaint'},
          ],
          techniques: [{id: 'Albumen process', name: 'Albumen process'}],
          creators: [
            {id: 'Geeske van Châtellerault', name: 'Geeske van Châtellerault'},
          ],
          images: [
            {
              id: 'http://images.memorix.nl/rce/thumb/1600x1600/e0164095-6a2d-b448-cc59-3a8ab2fafed7.jpg',
              contentUrl:
                'http://images.memorix.nl/rce/thumb/1600x1600/e0164095-6a2d-b448-cc59-3a8ab2fafed7.jpg',
            },
            {
              id: 'http://images.memorix.nl/rce/thumb/1600x1600/fceac847-88f4-8066-d960-326dc79be0d3.jpg',
              contentUrl:
                'http://images.memorix.nl/rce/thumb/1600x1600/fceac847-88f4-8066-d960-326dc79be0d3.jpg',
            },
          ],
          owner: {id: 'Museum', name: 'Museum'},
          isPartOf: {id: 'https://example.org/datasets/1', name: 'Dataset 1'},
        },
      ],
      filters: {
        owners: [
          {totalCount: 1, id: 'Library', name: 'Library'},
          {totalCount: 2, id: 'Museum', name: 'Museum'},
          {
            totalCount: 1,
            id: 'Research Organisation',
            name: 'Research Organisation',
          },
        ],
        types: [
          {totalCount: 1, id: 'Canvas Painting', name: 'Canvas Painting'},
          {totalCount: 1, id: 'Drawing', name: 'Drawing'},
          {totalCount: 1, id: 'Painting', name: 'Painting'},
          {totalCount: 1, id: 'Photo', name: 'Photo'},
        ],
        subjects: [
          {totalCount: 1, id: 'Castle', name: 'Castle'},
          {totalCount: 2, id: 'Celebrations', name: 'Celebrations'},
          {totalCount: 1, id: 'Cottage', name: 'Cottage'},
          {totalCount: 1, id: 'Palace', name: 'Palace'},
        ],
      },
    });
  });
});

describe('getById', () => {
  it('returns undefined if no heritage object matches the ID', async () => {
    const heritageObject = await heritageObjectFetcher.getById({
      id: 'AnIdThatDoesNotExist',
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
      types: [{id: 'Canvas Painting', name: 'Canvas Painting'}],
      subjects: [{id: 'Celebrations', name: 'Celebrations'}],
      materials: [
        {id: 'Canvas', name: 'Canvas'},
        {id: 'Oilpaint', name: 'Oilpaint'},
      ],
      techniques: [{id: 'Albumen process', name: 'Albumen process'}],
      creators: [
        {id: 'Geeske van Châtellerault', name: 'Geeske van Châtellerault'},
      ],
      images: [
        {
          id: 'http://images.memorix.nl/rce/thumb/1600x1600/e0164095-6a2d-b448-cc59-3a8ab2fafed7.jpg',
          contentUrl:
            'http://images.memorix.nl/rce/thumb/1600x1600/e0164095-6a2d-b448-cc59-3a8ab2fafed7.jpg',
        },
        {
          id: 'http://images.memorix.nl/rce/thumb/1600x1600/fceac847-88f4-8066-d960-326dc79be0d3.jpg',
          contentUrl:
            'http://images.memorix.nl/rce/thumb/1600x1600/fceac847-88f4-8066-d960-326dc79be0d3.jpg',
        },
      ],
      owner: {id: 'Museum', name: 'Museum'},
      isPartOf: {id: 'https://example.org/datasets/1', name: 'Dataset 1'},
    });
  });

  it('returns the heritage object that matches the ID', async () => {
    const heritageObject = await heritageObjectFetcher.getById({
      id: 'https://example.org/objects/1',
    });

    expect(heritageObject).toStrictEqual({
      id: 'https://example.org/objects/1',
      name: 'Object 1',
      identifier: '1234',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultrices velit vitae vulputate tincidunt. Donec dictum tortor nec tempus mollis.',
      types: [
        {
          id: 'Painting',
          name: 'Painting',
        },
      ],
      subjects: [
        {
          id: 'Celebrations',
          name: 'Celebrations',
        },
      ],
      materials: [
        {
          id: 'Canvas',
          name: 'Canvas',
        },
        {
          id: 'Oilpaint',
          name: 'Oilpaint',
        },
      ],
      creators: [
        {
          id: 'Vincent van Gogh',
          name: 'Vincent van Gogh',
        },
      ],
      images: [
        {
          id: 'http://images.memorix.nl/rce/thumb/1600x1600/e0164095-6a2d-b448-cc59-3a8ab2fafed7.jpg',
          contentUrl:
            'http://images.memorix.nl/rce/thumb/1600x1600/e0164095-6a2d-b448-cc59-3a8ab2fafed7.jpg',
        },
        {
          id: 'http://images.memorix.nl/rce/thumb/1600x1600/fceac847-88f4-8066-d960-326dc79be0d3.jpg',
          contentUrl:
            'http://images.memorix.nl/rce/thumb/1600x1600/fceac847-88f4-8066-d960-326dc79be0d3.jpg',
        },
      ],
      owner: {
        id: 'Museum',
        name: 'Museum',
      },
      isPartOf: {
        id: 'https://example.org/datasets/1',
        name: 'Dataset 1',
      },
      subjectOf: [
        {
          id: 'https://example.org/objects/1/provenance/event/3/activity/1',
          types: [
            {
              id: 'http://vocab.getty.edu/aat/300055292',
              name: 'theft (social issue)',
            },
          ],
          startDate: new Date('1901-01-01T00:00:00.000Z'),
          endDate: new Date('1901-01-01T00:00:00.000Z'),
          startsAfter: 'https://example.org/objects/1/provenance/event/2',
          endsBefore: 'https://example.org/objects/1/provenance/event/4',
          transferredFrom: {
            id: 'https://museum.example.org/',
            name: 'Museum',
          },
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/937f142f267171484afa9f5add32dee2',
            name: 'Amsterdam',
          },
        },
        {
          id: 'https://example.org/objects/1/provenance/event/4/activity/1',
          types: [
            {
              id: 'http://vocab.getty.edu/aat/300445014',
              name: 'returning',
            },
          ],
          description: 'Found in a basement',
          startDate: new Date('1939-01-01T00:00:00.000Z'),
          endDate: new Date('1939-01-01T00:00:00.000Z'),
          startsAfter: 'https://example.org/objects/1/provenance/event/3',
          transferredTo: {
            id: 'https://museum.example.org/',
            name: 'Museum',
          },
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/e3b1549a503d5ff866dabe0c91d29f7d',
            name: 'Paris',
          },
        },
        {
          id: 'https://example.org/objects/1/provenance/event/1/activity/1',
          types: [
            {
              id: 'http://vocab.getty.edu/aat/300417642',
              name: 'purchase (method of acquisition)',
            },
            {
              id: 'http://vocab.getty.edu/aat/300417644',
              name: 'transfer (method of acquisition)',
            },
          ],
          description: 'Bought for 1500 US dollars',
          startDate: new Date('1855-01-01T00:00:00.000Z'),
          endDate: new Date('1855-01-01T00:00:00.000Z'),
          endsBefore: 'https://example.org/objects/1/provenance/event/2',
          transferredFrom: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/dcd4ee3b11315a1e92bf5ed922a873f0',
            name: 'Peter Hoekstra',
          },
          transferredTo: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/9a1d94f7d8f54e015c893c30367df756',
            name: 'Jan de Vries',
          },
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/136e95a2e1aa9f7e4d19e29a4f1af3d8',
            name: 'Jakarta',
          },
        },
        {
          id: 'https://example.org/objects/1/provenance/event/2/activity/1',
          types: [
            {
              id: 'http://vocab.getty.edu/aat/300417642',
              name: 'purchase (method of acquisition)',
            },
          ],
          description: 'Bought at an auction',
          startDate: new Date('1879-01-01T00:00:00.000Z'),
          endDate: new Date('1879-01-01T00:00:00.000Z'),
          startsAfter: 'https://example.org/objects/1/provenance/event/1',
          endsBefore: 'https://example.org/objects/1/provenance/event/3',
          transferredFrom: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/25022ed592e76e082dd63c7a6024b4b0',
            name: 'Jan de Vries',
          },
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/989fa5e7105587ce72fe616eb6bd23a4',
            name: 'Amsterdam',
          },
        },
      ],
    });
  });
});
