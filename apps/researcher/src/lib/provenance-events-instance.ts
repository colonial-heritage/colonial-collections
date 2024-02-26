import {ProvenanceEvents} from '@colonial-collections/api';
import {env} from 'node:process';

const provenanceEvents = new ProvenanceEvents({
  sparqlEndpointUrl: env.SPARQL_ENDPOINT_URL as string,
});

export default provenanceEvents;
