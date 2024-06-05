import {ResearchGuides} from '@colonial-collections/api';
import {env} from 'node:process';

const researchGuides = new ResearchGuides({
  sparqlEndpointUrl: env.SPARQL_ENDPOINT_URL as string,
});

export default researchGuides;
