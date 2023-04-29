import {LabelFetcher} from '@colonial-collections/label-fetcher';
import {DatasetEnricher} from '@/lib/dataset-fetcher/enricher';
import {DatasetFetcher} from '@/lib/dataset-fetcher/index';
import {env} from 'node:process';

const labelFetcher = new LabelFetcher({
  endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
});

const datasetEnricher = new DatasetEnricher({
  endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
});

const datasetFetcher = new DatasetFetcher({
  endpointUrl: env.SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL as string,
  labelFetcher,
  datasetEnricher,
});

export default datasetFetcher;
