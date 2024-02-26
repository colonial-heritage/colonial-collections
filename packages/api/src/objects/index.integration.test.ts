import {HeritageObjects} from '.';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

// This file contains some straightforward tests that make
// sure the API of 'index.ts' works. The real integration tests
// are in the files that 'index.ts' uses, e.g. 'fetcher.integration.test.ts'.

let heritageObjects: HeritageObjects;

beforeEach(() => {
  heritageObjects = new HeritageObjects({
    sparqlEndpointUrl: env.SPARQL_ENDPOINT_URL as string,
    elasticSearchEndpointUrl: env.SEARCH_ENDPOINT_URL as string,
  });
});

describe('getById', () => {
  it('returns a heritage object', async () => {
    const heritageObject = await heritageObjects.getById({
      id: 'https://example.org/objects/5',
    });

    expect(heritageObject).not.toBeUndefined();
  });
});

describe('search', () => {
  it('finds heritage objects', async () => {
    const result = await heritageObjects.search();

    expect(result).toMatchObject({
      totalCount: 5,
    });
  });
});
