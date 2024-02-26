import {HeritageObjects} from '@colonial-collections/api';
import {env} from 'node:process';

const heritageObjects = new HeritageObjects({
  sparqlEndpointUrl: env.SPARQL_ENDPOINT_URL as string,
  elasticSearchEndpointUrl: env.SEARCH_ENDPOINT_URL as string,
});

export default heritageObjects;
