import {ProvenanceEvents} from '.';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

// This file contains some straightforward tests that make
// sure the API of 'index.ts' works. The real integration tests
// are in the files that 'index.ts' uses, e.g. 'fetcher.integration.test.ts'.

let provenanceEvents: ProvenanceEvents;

beforeEach(() => {
  provenanceEvents = new ProvenanceEvents({
    sparqlEndpointUrl: env.SPARQL_ENDPOINT_URL as string,
  });
});

describe('getByHeritageObjectId', () => {
  it('returns the provenance events of a heritage object', async () => {
    const events = await provenanceEvents.getByHeritageObjectId({
      id: 'https://example.org/objects/1',
    });

    expect(events).toHaveLength(5);
  });
});
