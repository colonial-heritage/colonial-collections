import {env} from 'node:process';
import {ProvenanceEventsFetcher} from './api/objects/provenance-events-fetcher';

const provenanceEvents = new ProvenanceEventsFetcher({
  endpointUrl: env.SPARQL_ENDPOINT_URL as string,
});

export default provenanceEvents;
