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
          id: 'https://colonial-heritage.triply.cc/.well-known/genid/a86b708044fb2747b8a0a19bb5af4000',
          name: 'Canvas Painting',
        },
      ],
      subjects: [
        {
          id: 'https://colonial-heritage.triply.cc/.well-known/genid/22d7dbb448084adb9c2bf97c3ee5534b',
          name: 'Celebrations',
        },
      ],
      materials: [
        {
          id: 'https://colonial-heritage.triply.cc/.well-known/genid/e3c906fec3e484ff40e352b6cea0fcfb',
          name: 'Canvas',
        },
        {
          id: 'https://colonial-heritage.triply.cc/.well-known/genid/787fb3814853b8d0bc5d5d3dc9e9d3d4',
          name: 'Oilpaint',
        },
      ],
      techniques: [
        {
          id: 'https://colonial-heritage.triply.cc/.well-known/genid/10131e19f03d8005ce2dcdd491fcf715',
          name: 'Albumen process',
        },
      ],
      creators: [
        {
          type: 'Person',
          id: 'https://colonial-heritage.triply.cc/.well-known/genid/c7d1bbe2c664b1f8272bfc07e1779dfd',
          name: 'Geeske van Châtellerault',
        },
      ],
      images: [
        {
          id: 'https://colonial-heritage.triply.cc/.well-known/genid/6a7a6d27e9147b14cd6c09758ffce757',
          contentUrl:
            'http://images.memorix.nl/rce/thumb/1600x1600/e0164095-6a2d-b448-cc59-3a8ab2fafed7.jpg',
        },
        {
          id: 'https://colonial-heritage.triply.cc/.well-known/genid/81f8c1e4eb12d17df1403bc51d1eae49',
          contentUrl:
            'http://images.memorix.nl/rce/thumb/1600x1600/fceac847-88f4-8066-d960-326dc79be0d3.jpg',
        },
      ],
      owner: {
        type: 'Organization',
        id: 'https://museum.example.org/',
        name: 'Museum',
      },
      isPartOf: {id: 'https://example.org/datasets/1', name: 'Dataset 1'},
    });
  });
});
