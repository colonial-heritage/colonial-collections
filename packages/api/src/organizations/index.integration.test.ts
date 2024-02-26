import {Organizations} from '.';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

// This file contains some straightforward tests that make
// sure the API of 'index.ts' works. The real integration tests
// are in the files that 'index.ts' uses, e.g. 'fetcher.integration.test.ts'.

let organizations: Organizations;

beforeEach(() => {
  organizations = new Organizations({
    sparqlEndpointUrl: env.SPARQL_ENDPOINT_URL as string,
  });
});

describe('getById', () => {
  it('returns an organization', async () => {
    const organization = await organizations.getById({
      id: 'https://museum.example.org/',
    });

    expect(organization).not.toBeUndefined();
  });
});
