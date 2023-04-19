import {HeritageFetcher, SortBy, SortOrder} from '.';
import {LabelFetcher} from '@colonial-collections/label-fetcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

const labelFetcher = new LabelFetcher({
  endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
});
let heritageFetcher: HeritageFetcher;

beforeEach(() => {
  heritageFetcher = new HeritageFetcher({
    endpointUrl: env.SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL as string,
    labelFetcher,
  });
});

xdescribe('search', () => {
  it('finds all things if no options are provided', async () => {
    const result = await heritageFetcher.search();

    console.log(JSON.stringify(result, null, 2));
  });
});

describe('getById', () => {
  it('returns undefined if no heritage object matches the ID', async () => {
    const heritageObject = await heritageFetcher.getById({
      id: 'AnIdThatDoesNotExist',
    });

    expect(heritageObject).toBeUndefined();
  });

  it('returns the heritage object that matches the ID', async () => {
    const heritageObject = await heritageFetcher.getById({
      id: 'https://example.org/objects/1',
    });

    expect(heritageObject).toStrictEqual({
      id: 'https://example.org/objects/1',
      name: 'Object 1',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultrices velit vitae vulputate tincidunt. Donec dictum tortor nec tempus mollis.',
      types: [
        {
          id: 'http://vocab.getty.edu/aat/300033618',
          name: 'paintings (visual works)',
        },
      ],
      subjects: [
        {
          id: 'http://vocab.getty.edu/aat/300152441',
          name: 'celebrations',
        },
      ],
      materials: [
        {
          id: 'http://vocab.getty.edu/aat/300014078',
          name: 'canvas (textile material)',
        },
        {
          id: 'http://vocab.getty.edu/aat/300015050',
          name: 'oil paint (paint)',
        },
      ],
      creators: [
        {
          id: 'https://data.rkd.nl/artists/32439',
          name: 'Gogh, Vincent van',
        },
      ],
      owner: {
        id: 'https://museum.example.org/',
        name: 'Museum',
      },
      isPartOf: {
        id: 'https://example.org/datasets/1',
        name: 'Dataset 1',
      },
    });
  });
});
