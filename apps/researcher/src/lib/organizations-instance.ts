import {Organizations} from '@colonial-collections/api';
import {env} from 'node:process';

const organizations = new Organizations({
  sparqlEndpointUrl: env.SPARQL_ENDPOINT_URL as string,
});

export default organizations;
