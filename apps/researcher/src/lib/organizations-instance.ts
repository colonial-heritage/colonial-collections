import {Organizations} from '@/lib/api/organizations';
import {env} from 'node:process';

const organizations = new Organizations({
  sparqlEndpointUrl: env.KG_SPARQL_ENDPOINT_URL as string,
});

export default organizations;
