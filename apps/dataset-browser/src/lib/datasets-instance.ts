import {Datasets} from '@colonial-collections/api';
import {env} from 'node:process';

const datasets = new Datasets({
  sparqlEndpointUrl: env.SPARQL_ENDPOINT_URL as string,
  elasticSearchEndpointUrl: env.SEARCH_ENDPOINT_URL as string,
});

export default datasets;
