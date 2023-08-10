import {LabelFetcher} from '@colonial-collections/label-fetcher';
import {PersonFetcher} from '@/lib/api/persons';
import {env} from 'node:process';

const labelFetcher = new LabelFetcher({
  endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
});

const personFetcher = new PersonFetcher({
  endpointUrl: env.SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL as string,
  labelFetcher,
});

export default personFetcher;
