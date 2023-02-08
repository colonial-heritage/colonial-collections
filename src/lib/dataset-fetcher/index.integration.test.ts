import {DatasetFetcher, SortBy, SortOrder} from '.';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let datasetFetcher: DatasetFetcher;

beforeEach(() => {
  datasetFetcher = new DatasetFetcher({
    endpointUrl: env.SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL as string,
  });
});

describe('search', () => {
  it('finds all datasets if no options are provided', async () => {
    const result = await datasetFetcher.search();

    expect(result).toMatchObject({
      totalCount: 13,
      offset: 0,
      limit: 10,
      sortBy: SortBy.Relevance,
      sortOrder: SortOrder.Descending,
      filters: {
        publishers: [
          {
            totalCount: 4,
            id: 'https://archive.example.org/',
            name: 'Archive',
          },
          {
            totalCount: 4,
            id: 'https://library.example.org/',
            name: 'Library',
          },
          {
            totalCount: 4,
            id: 'https://museum.example.org/',
            name: 'Museum',
          },
          {
            totalCount: 1,
            id: 'https://research.example.org/',
            name: 'Research Organisation',
          },
        ],
        licenses: [
          {
            totalCount: 6,
            id: 'http://creativecommons.org/publicdomain/zero/1.0/',
            name: 'Publiek domein',
          },
          {
            totalCount: 3,
            id: 'http://creativecommons.org/publicdomain/zero/1.0/deed.nl',
            name: 'Publiek domein',
          },
          {
            totalCount: 3,
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'Public Domain',
          },
          {
            totalCount: 1,
            id: 'http://opendatacommons.org/licenses/by/1.0/',
            name: 'Open Data Commons Attribution',
          },
        ],
      },
    });
  });

  it('does not find datasets if query does not match', async () => {
    const result = await datasetFetcher.search({
      query: 'ThisQueryWillNotReturnResults',
    });

    expect(result).toStrictEqual({
      totalCount: 0,
      offset: 0,
      limit: 10,
      sortBy: SortBy.Relevance,
      sortOrder: SortOrder.Descending,
      datasets: [],
      filters: {
        publishers: [
          {
            totalCount: 0,
            id: 'https://archive.example.org/',
            name: 'Archive',
          },
          {
            totalCount: 0,
            id: 'https://library.example.org/',
            name: 'Library',
          },
          {
            totalCount: 0,
            id: 'https://museum.example.org/',
            name: 'Museum',
          },
          {
            totalCount: 0,
            id: 'https://research.example.org/',
            name: 'Research Organisation',
          },
        ],
        licenses: [
          {
            totalCount: 0,
            id: 'http://creativecommons.org/publicdomain/zero/1.0/',
            name: 'Publiek domein',
          },
          {
            totalCount: 0,
            id: 'http://creativecommons.org/publicdomain/zero/1.0/deed.nl',
            name: 'Publiek domein',
          },
          {
            totalCount: 0,
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'Public Domain',
          },
          {
            totalCount: 0,
            id: 'http://opendatacommons.org/licenses/by/1.0/',
            name: 'Open Data Commons Attribution',
          },
        ],
      },
    });
  });

  it('finds datasets if query matches', async () => {
    const result = await datasetFetcher.search({query: 'placerat dataset 4'});

    expect(result).toMatchObject({
      totalCount: 1,
      datasets: [
        {
          id: 'https://museum.example.org/datasets/4',
          name: 'Dataset 4',
          description:
            'Donec placerat orci vel erat commodo suscipit. Morbi elementum nunc ut dolor venenatis, vel ultricies nisi euismod. Sed aliquet ultricies sapien, vehicula malesuada nunc tristique ac.',
          publisher: {id: 'https://museum.example.org/', name: 'Museum'},
          license: {
            id: 'http://creativecommons.org/publicdomain/zero/1.0/',
            name: 'Publiek domein',
          },
          keywords: ['keyword1', 'keyword2'],
        },
      ],
    });
  });

  it('finds datasets, sorted by name in ascending order', async () => {
    const result = await datasetFetcher.search({
      query: 'placerat',
      sortBy: SortBy.Name,
      sortOrder: SortOrder.Ascending,
    });

    expect(result).toMatchObject({
      totalCount: 3,
      sortBy: SortBy.Name,
      sortOrder: SortOrder.Ascending,
      datasets: [
        {
          id: 'https://library.example.org/datasets/12',
          name: 'Dataset 12',
          description:
            'Donec placerat orci vel erat commodo suscipit. Morbi elementum nunc ut dolor venenatis, vel ultricies nisi euismod. Sed aliquet ultricies sapien, vehicula malesuada nunc tristique ac.',
          publisher: {
            id: 'https://library.example.org/',
            name: 'Library',
          },
          license: {
            id: 'http://creativecommons.org/publicdomain/zero/1.0/',
            name: 'Publiek domein',
          },
          keywords: ['keyword1', 'keyword3'],
        },
        {
          id: 'https://museum.example.org/datasets/4',
          name: 'Dataset 4',
          description:
            'Donec placerat orci vel erat commodo suscipit. Morbi elementum nunc ut dolor venenatis, vel ultricies nisi euismod. Sed aliquet ultricies sapien, vehicula malesuada nunc tristique ac.',
          publisher: {
            id: 'https://museum.example.org/',
            name: 'Museum',
          },
          license: {
            id: 'http://creativecommons.org/publicdomain/zero/1.0/',
            name: 'Publiek domein',
          },
          keywords: ['keyword1', 'keyword2'],
        },
        {
          id: 'https://archive.example.org/datasets/8',
          name: 'Dataset 8',
          description:
            'Donec placerat orci vel erat commodo suscipit. Morbi elementum nunc ut dolor venenatis, vel ultricies nisi euismod. Sed aliquet ultricies sapien, vehicula malesuada nunc tristique ac.',
          publisher: {
            id: 'https://archive.example.org/',
            name: 'Archive',
          },
          license: {
            id: 'http://creativecommons.org/publicdomain/zero/1.0/',
            name: 'Publiek domein',
          },
          keywords: ['keyword3', 'keyword4'],
        },
      ],
    });
  });

  it('finds datasets if "publishers" filter matches', async () => {
    const result = await datasetFetcher.search({
      filters: {
        publishers: ['https://library.example.org/'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 4,
      filters: {
        publishers: [
          {totalCount: 0, name: 'Archive', id: 'https://archive.example.org/'},
          {totalCount: 4, name: 'Library', id: 'https://library.example.org/'},
          {totalCount: 0, name: 'Museum', id: 'https://museum.example.org/'},
          {
            totalCount: 0,
            name: 'Research Organisation',
            id: 'https://research.example.org/',
          },
        ],
      },
    });
  });

  it('finds datasets if "licenses" filter matches', async () => {
    const result = await datasetFetcher.search({
      filters: {
        licenses: ['http://creativecommons.org/publicdomain/zero/1.0/'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 6,
      filters: {
        licenses: [
          {
            totalCount: 6,
            id: 'http://creativecommons.org/publicdomain/zero/1.0/',
            name: 'Publiek domein',
          },
          {
            totalCount: 0,
            id: 'http://creativecommons.org/publicdomain/zero/1.0/deed.nl',
            name: 'Publiek domein',
          },
          {
            totalCount: 0,
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'Public Domain',
          },
          {
            totalCount: 0,
            id: 'http://opendatacommons.org/licenses/by/1.0/',
            name: 'Open Data Commons Attribution',
          },
        ],
      },
    });
  });
});
