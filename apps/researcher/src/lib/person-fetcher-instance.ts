import {PersonFetcher} from '@/lib/api/persons';
import {env} from 'node:process';

const personFetcher = new PersonFetcher({
  endpointUrl: env.SEARCH_ENDPOINT_URL as string,
});

export default personFetcher;
