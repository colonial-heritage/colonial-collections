import {SparqlFetcher} from './sparql-fetcher';
import {beforeEach, describe, it} from '@jest/globals';
import {env} from 'node:process';

let sparqlFetcher: SparqlFetcher;

beforeEach(() => {
  sparqlFetcher = new SparqlFetcher({
    endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
  });
});

describe('getByIri', () => {
  it('gets data by IRI', async () => {
    const iris = [
      'https://example.org/datasets/1',
      'https://example.org/datasets/12',
    ];
    await sparqlFetcher.loadByIris({iris});
  });
});
