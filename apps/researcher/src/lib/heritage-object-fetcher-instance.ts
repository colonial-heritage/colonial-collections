import {LabelFetcher} from '@colonial-collections/label-fetcher';
import {HeritageObjectFetcher} from '@/lib/objects';
import {env} from 'node:process';

const labelFetcher = new LabelFetcher({
  endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
});

const heritageObjectFetcher = new HeritageObjectFetcher({
  endpointUrl: env.SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL as string,
  labelFetcher,
});

export default heritageObjectFetcher;
