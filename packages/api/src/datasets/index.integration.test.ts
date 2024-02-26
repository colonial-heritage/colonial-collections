import {Datasets} from '.';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

// This file contains some straightforward tests that make
// sure the API of 'index.ts' works. The real integration tests
// are in the files that 'index.ts' uses, e.g. 'fetcher.integration.test.ts'.

let datasets: Datasets;

beforeEach(() => {
  datasets = new Datasets({
    sparqlEndpointUrl: env.SPARQL_ENDPOINT_URL as string,
    elasticSearchEndpointUrl: env.SEARCH_ENDPOINT_URL as string,
  });
});

describe('getById', () => {
  it('returns a dataset', async () => {
    const dataset = await datasets.getById({
      id: 'https://example.org/datasets/1',
    });

    expect(dataset).not.toBeUndefined();
  });
});

describe('search', () => {
  it('finds datasets', async () => {
    const result = await datasets.search();

    expect(result).toMatchObject({
      totalCount: 14,
    });
  });
});
