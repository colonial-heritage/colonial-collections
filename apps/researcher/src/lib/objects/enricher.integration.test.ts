import {HeritageObjectEnricher} from '.';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let heritageObjectEnricher: HeritageObjectEnricher;

beforeEach(() => {
  heritageObjectEnricher = new HeritageObjectEnricher({
    endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
  });
});

describe('getByIri', () => {
  xit('returns undefined if IRIs have not been loaded', async () => {
    const result = heritageObjectEnricher.getByIri({
      iri: 'https://example.org/datasets/1',
    });

    expect(result).toBeUndefined();
  });

  xit('returns undefined if the resource of the provided IRI does not exist', async () => {
    await heritageObjectEnricher.loadByIris({
      iris: ['https://doesnotexist.org'],
    });

    const label = heritageObjectEnricher.getByIri({
      iri: 'https://doesnotexist.org',
    });

    expect(label).toBeUndefined();
  });

  it('gets data by IRI', async () => {
    const iris = ['https://example.org/objects/1'];
    await heritageObjectEnricher.loadByIris({iris});

    const result = heritageObjectEnricher.getByIri({
      iri: 'https://example.org/objects/1',
    });

    console.log(result);

    // Expect(result).toStrictEqual({});
  });
});
