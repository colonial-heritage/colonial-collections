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
  it('finds all datasets if query is not provided', async () => {
    const results = await datasetFetcher.search();

    expect(results).toMatchObject({
      totalCount: 12,
      offset: 0,
      limit: 10,
    });
  });

  it('does not find datasets if query does not match', async () => {
    const results = await datasetFetcher.search({
      query: 'ThisQueryWillNotReturnResults',
    });

    expect(results).toStrictEqual({
      totalCount: 0,
      offset: 0,
      limit: 10,
      datasets: [],
    });
  });

  it('finds datasets if query matches', async () => {
    const results = await datasetFetcher.search({query: 'maecenas dataset 7'});

    expect(results).toStrictEqual({
      totalCount: 1,
      offset: 0,
      limit: 10,
      datasets: [
        {
          id: 'https://archive.example.org/datasets/7',
          name: 'Dataset 7',
          description:
            'Maecenas quis sem ante. Vestibulum mattis lorem in mauris pulvinar tincidunt. Sed nisi ligula, mattis id vehicula at, faucibus vel quam.',
        },
      ],
    });
  });
});
