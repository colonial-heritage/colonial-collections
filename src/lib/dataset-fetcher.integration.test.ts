import {beforeEach, describe, expect, it} from '@jest/globals';
import {DatasetFetcher} from './dataset-fetcher';
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
      totalCount: 12,
      offset: 0,
      limit: 10,
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
        ],
        licenses: [
          {
            totalCount: 0,
            id: 'http://creativecommons.org/publicdomain/zero/1.0/',
            name: 'Public Domain',
          },
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
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'Publiek domein',
          },
        ],
      },
    });
  });

  it('finds datasets if query matches', async () => {
    const result = await datasetFetcher.search({query: 'maecenas dataset 7'});

    expect(result).toMatchObject({
      totalCount: 1,
      offset: 0,
      limit: 10,
      datasets: [
        {
          id: 'https://archive.example.org/datasets/7',
          name: 'Dataset 7',
          description:
            'Maecenas quis sem ante. Vestibulum mattis lorem in mauris pulvinar tincidunt. Sed nisi ligula, mattis id vehicula at, faucibus vel quam.',
          publisher: {id: 'https://archive.example.org/', name: 'Archive'},
          license: {
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'Public Domain',
          },
        },
      ],
    });
  });

  it('finds datasets if "publishers" filter matches', async () => {
    const result = await datasetFetcher.search({
      filters: {
        publishers: ['https://archive.example.org/'],
      },
    });

    expect(result).toMatchObject({
      totalCount: 4,
      offset: 0,
      limit: 10,
      filters: {
        publishers: [
          {totalCount: 4, name: 'Archive', id: 'https://archive.example.org/'},
          {totalCount: 0, name: 'Library', id: 'https://library.example.org/'},
          {totalCount: 0, name: 'Museum', id: 'https://museum.example.org/'},
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
      offset: 0,
      limit: 10,
      filters: {
        licenses: [
          {
            totalCount: 6,
            id: 'http://creativecommons.org/publicdomain/zero/1.0/',
            name: 'Public Domain',
          },
          {
            totalCount: 6,
            id: 'http://creativecommons.org/publicdomain/zero/1.0/',
            name: 'Public Domain',
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
            id: 'https://creativecommons.org/publicdomain/zero/1.0/',
            name: 'Publiek domein',
          },
        ],
      },
    });
  });
});
