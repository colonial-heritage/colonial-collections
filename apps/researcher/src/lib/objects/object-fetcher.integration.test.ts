import {HeritageObjectFetcher} from './object-fetcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let heritageObjectFetcher: HeritageObjectFetcher;

beforeEach(() => {
  heritageObjectFetcher = new HeritageObjectFetcher({
    endpointUrl: env.KG_SPARQL_ENDPOINT_URL as string,
  });
});

describe('getById', () => {
  xit('returns undefined if no heritage object matches the ID', async () => {
    const heritageObject = await heritageObjectFetcher.getById({
      id: 'AnIdThatDoesNotExist',
    });

    expect(heritageObject).toBeUndefined();
  });

  it('returns the heritage object that matches the ID', async () => {
    const heritageObject = await heritageObjectFetcher.getById({
      id: 'https://example.org/objects/5',
    });

    console.log(heritageObject);
  });
});
