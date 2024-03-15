import {Constituents} from '.';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

// This file contains some straightforward tests that make
// sure the API of 'index.ts' works. The real integration tests
// are in the files that 'index.ts' uses, e.g. 'fetcher.integration.test.ts'.

let constituents: Constituents;

beforeEach(() => {
  constituents = new Constituents({
    sparqlEndpointUrl: env.SPARQL_ENDPOINT_URL as string,
    elasticSearchEndpointUrl: env.SEARCH_ENDPOINT_URL as string,
  });
});

describe('getById', () => {
  it('returns a constituent', async () => {
    const constituent = await constituents.getById({
      id: 'https://example.org/constituents/1',
    });

    expect(constituent).not.toBeUndefined();
  });
});

describe('search', () => {
  it('finds constituents', async () => {
    const result = await constituents.search();

    expect(result).toMatchObject({
      totalCount: 14,
    });
  });
});
