import {HeritageFetcher} from '.';
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

describe('search', () => {
  it('finds all heritage objects if no options are provided', async () => {
    const result = await heritageFetcher.search();

    expect(result).toStrictEqual({
      totalCount: 3,
      offset: 0,
      limit: 10,
      sortBy: 'relevance',
      sortOrder: 'desc',
      heritageObjects: [
        {
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
        },
        {
          id: 'https://example.org/objects/2',
          name: 'Object 2',
          description:
            'Suspendisse ut condimentum leo, et vulputate lectus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce vel volutpat nunc. Sed vel libero ac lorem dapibus euismod. Aenean a ante et turpis bibendum consectetur at pulvinar quam.',
          types: [
            {
              id: 'http://vocab.getty.edu/aat/300046300',
              name: 'photographs',
            },
          ],
          subjects: [
            {
              id: 'http://vocab.getty.edu/aat/300005734',
              name: 'palaces (official residences)',
            },
          ],
          materials: [
            {
              id: 'http://vocab.getty.edu/aat/300014109',
              name: 'paper (fiber product)',
            },
          ],
          techniques: [
            {
              id: 'http://vocab.getty.edu/aat/300133274',
              name: 'albumen process',
            },
          ],
          creators: [
            {
              id: 'https://data.rkd.nl/artists/120388',
              name: 'Boer, Adriaan',
            },
          ],
          owner: {
            id: 'https://research.example.org/',
            name: 'Research Organisation',
          },
          isPartOf: {
            id: 'https://example.org/datasets/13',
            name: 'Dataset 13',
          },
        },
        {
          id: 'https://example.org/objects/3',
          name: 'Object 3',
          description:
            'Ut dictum elementum augue sit amet sodales. Vivamus viverra ligula sed arcu cursus sagittis. Donec ac placerat lacus.',
          inscriptions: ['Maecenas commodo est neque'],
          types: [
            {
              id: 'http://vocab.getty.edu/aat/300033973',
              name: 'drawings (visual works)',
            },
          ],
          subjects: [
            {
              id: 'http://vocab.getty.edu/aat/300005500',
              name: 'cottages',
            },
            {
              id: 'http://vocab.getty.edu/aat/300006891',
              name: 'castles (fortifications)',
            },
          ],
          materials: [
            {
              id: 'http://vocab.getty.edu/aat/300014109',
              name: 'paper (fiber product)',
            },
            {
              id: 'http://vocab.getty.edu/aat/300015012',
              name: 'ink',
            },
          ],
          owner: {
            id: 'https://library.example.org/',
            name: 'Library',
          },
          isPartOf: {
            id: 'https://example.org/datasets/10',
            name: '(No name)',
          },
        },
      ],
      filters: {
        owners: [
          {
            totalCount: 1,
            id: 'https://library.example.org/',
            name: 'Library',
          },
          {
            totalCount: 1,
            id: 'https://museum.example.org/',
            name: 'Museum',
          },
          {
            totalCount: 1,
            id: 'https://research.example.org/',
            name: 'Research Organisation',
          },
        ],
        types: [
          {
            totalCount: 1,
            id: 'http://vocab.getty.edu/aat/300033618',
            name: 'paintings (visual works)',
          },
          {
            totalCount: 1,
            id: 'http://vocab.getty.edu/aat/300033973',
            name: 'drawings (visual works)',
          },
          {
            totalCount: 1,
            id: 'http://vocab.getty.edu/aat/300046300',
            name: 'photographs',
          },
        ],
        subjects: [
          {
            totalCount: 1,
            id: 'http://vocab.getty.edu/aat/300005500',
            name: 'cottages',
          },
          {
            totalCount: 1,
            id: 'http://vocab.getty.edu/aat/300005734',
            name: 'palaces (official residences)',
          },
          {
            totalCount: 1,
            id: 'http://vocab.getty.edu/aat/300006891',
            name: 'castles (fortifications)',
          },
          {
            totalCount: 1,
            id: 'http://vocab.getty.edu/aat/300152441',
            name: 'celebrations',
          },
        ],
      },
    });
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
