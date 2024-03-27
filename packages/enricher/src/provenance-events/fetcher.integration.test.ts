import {NanopubClient} from '../client';
import {EnrichmentCreator} from '../creator';
import {ProvenanceEventEnrichmentFetcher} from './fetcher';
import {beforeAll, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';
import {setTimeout} from 'node:timers/promises';

const fetcher = new ProvenanceEventEnrichmentFetcher({
  endpointUrl: env.NANOPUB_SPARQL_ENDPOINT_URL as string,
});

const resourceId = 'http://example.org/object1';

describe('getById', () => {
  it('returns undefined if the ID of the resource is invalid', async () => {
    const enrichments = await fetcher.getById('badValue');

    expect(enrichments).toBeUndefined();
  });

  it('returns no enrichments if a resource does not have enrichments', async () => {
    const enrichments = await fetcher.getById('http://example.org/unknown');

    expect(enrichments).toEqual([]);
  });

  it('gets the enrichments of a resource', async () => {
    const enrichments = await fetcher.getById(resourceId);

    console.log(JSON.stringify(enrichments, null, 2));
  });
});
