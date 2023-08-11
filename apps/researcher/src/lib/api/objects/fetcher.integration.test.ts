import {HeritageObjectFetcher} from './fetcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let heritageObjectFetcher: HeritageObjectFetcher;

beforeEach(() => {
  heritageObjectFetcher = new HeritageObjectFetcher({
    endpointUrl: env.KG_SPARQL_ENDPOINT_URL as string,
  });
});

describe('getById', () => {
  it('returns undefined if a malformed ID is used', async () => {
    const heritageObject = await heritageObjectFetcher.getById('malformedID');

    expect(heritageObject).toBeUndefined();
  });

  it('returns undefined if no heritage object matches the ID', async () => {
    const heritageObject = await heritageObjectFetcher.getById(
      'https://unknown.org/'
    );

    expect(heritageObject).toBeUndefined();
  });

  it('returns the heritage object that matches the ID', async () => {
    const heritageObject = await heritageObjectFetcher.getById(
      'https://example.org/objects/5'
    );

    expect(heritageObject).toStrictEqual({
      id: 'https://example.org/objects/5',
      name: 'Object 5',
      identifier: '7890',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultrices velit vitae vulputate tincidunt. Donec dictum tortor nec tempus mollis.',
      inscriptions: ['Maecenas commodo est neque'],
      types: [
        {
          id: expect.stringContaining(
            'https://colonial-heritage.triply.cc/.well-known/genid/'
          ),
          name: 'Canvas Painting',
        },
      ],
      subjects: [
        {
          id: expect.stringContaining(
            'https://colonial-heritage.triply.cc/.well-known/genid/'
          ),
          name: 'Celebrations',
        },
      ],
      materials: [
        {
          id: expect.stringContaining(
            'https://colonial-heritage.triply.cc/.well-known/genid/'
          ),
          name: 'Oilpaint',
        },
        {
          id: expect.stringContaining(
            'https://colonial-heritage.triply.cc/.well-known/genid/'
          ),
          name: 'Canvas',
        },
      ],
      techniques: [
        {
          id: expect.stringContaining(
            'https://colonial-heritage.triply.cc/.well-known/genid/'
          ),
          name: 'Albumen process',
        },
      ],
      creators: [
        {
          type: 'Person',
          id: expect.stringContaining(
            'https://colonial-heritage.triply.cc/.well-known/genid/'
          ),
          name: 'Geeske van Châtellerault',
        },
      ],
      dateCreated: {
        id: expect.stringContaining(
          'https://colonial-heritage.triply.cc/.well-known/genid/'
        ),
        startDate: new Date('1889-01-01'),
        endDate: new Date('1890-01-01'),
      },
      images: [
        {
          id: expect.stringContaining(
            'https://colonial-heritage.triply.cc/.well-known/genid/'
          ),
          contentUrl:
            'http://images.memorix.nl/rce/thumb/1600x1600/fceac847-88f4-8066-d960-326dc79be0d3.jpg',
        },
        {
          id: expect.stringContaining(
            'https://colonial-heritage.triply.cc/.well-known/genid/'
          ),
          contentUrl:
            'http://images.memorix.nl/rce/thumb/1600x1600/e0164095-6a2d-b448-cc59-3a8ab2fafed7.jpg',
        },
      ],
      owner: {
        type: 'Organization',
        id: 'https://museum.example.org/',
        name: 'Museum',
      },
      isPartOf: {
        id: 'https://example.org/datasets/1',
        name: 'Dataset 1',
        publisher: {
          id: 'https://museum.example.org/',
          type: 'Organization',
          name: 'Museum',
        },
      },
    });
  });
});
