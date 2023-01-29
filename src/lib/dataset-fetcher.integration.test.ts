import {DatasetFetcher} from './dataset-fetcher';
import {beforeEach, describe, it} from '@jest/globals';
import {env} from 'node:process';

let datasetFetcher: DatasetFetcher;

beforeEach(() => {
  datasetFetcher = new DatasetFetcher({
    endpointUrl: env.SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL as string,
  });
});

describe('search', () => {
  it('searches', async () => {
    const results = await datasetFetcher.search({query: 'Delft'});
    console.log(results);
  });
});
