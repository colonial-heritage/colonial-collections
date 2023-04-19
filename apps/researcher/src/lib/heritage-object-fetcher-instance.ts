import {LabelFetcher} from '@colonial-collections/label-fetcher';
import {HeritageFetcher} from '@/lib/heritage-fetcher';
import {env} from 'node:process';

const labelFetcher = new LabelFetcher({
  endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
});

const heritageFetcher = new HeritageFetcher({
  endpointUrl: env.SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL as string,
  labelFetcher,
});

export default heritageFetcher;
