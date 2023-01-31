import {DatasetFetcher} from '@/lib/dataset-fetcher';

const datasetFetcher = new DatasetFetcher({
  endpointUrl: process.env.SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL as string,
});

export default datasetFetcher;
