import {LabelFetcher} from '@colonial-collections/label-fetcher';
import {HeritageObjects} from '@/lib/objects';
import {env} from 'node:process';

const labelFetcher = new LabelFetcher({
  endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
});

const heritageObjects = new HeritageObjects({
  sparqlEndpointUrl: env.KG_SPARQL_ENDPOINT_URL as string,
  elasticSearchEndpointUrl: env.SEARCH_PLATFORM_ELASTIC_ENDPOINT_URL as string,
  labelFetcher,
});

export default heritageObjects;
