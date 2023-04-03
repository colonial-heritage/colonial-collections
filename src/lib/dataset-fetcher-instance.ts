import {LabelFetcher} from '@/lib/label-fetcher';
import {DatasetFetcher} from '@/lib/dataset-fetcher/index';
import {env} from 'node:process';

const labelFetcher = new LabelFetcher({
  endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
});

const datasetFetcher = new DatasetFetcher({
  endpointUrl: env.SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL as string,
  labelFetcher,
});

export default datasetFetcher;
