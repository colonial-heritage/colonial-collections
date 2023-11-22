import {EnrichmentFetcher} from './fetcher';
import {EnrichmentStorer} from './storer';
import {NanopubWriter} from './writer';
import {beforeAll, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';
import {setTimeout} from 'node:timers/promises';

const fetcher = new EnrichmentFetcher({
  endpointUrl: env.NANOPUB_SPARQL_ENDPOINT_URL as string,
});

const resourceId = `http://example.org/${Date.now()}`;

// Create some enrichments
beforeAll(async () => {
  const nanopubWriter = new NanopubWriter({
    endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
    proxyEndpointUrl: env.NANOPUB_WRITE_PROXY_ENDPOINT_URL as string,
  });

  const storer = new EnrichmentStorer({nanopubWriter});

  await storer.addText({
    description: 'Comment 1 about the resource',
    citation: 'A citation or reference to a work that supports the comment',
    about: resourceId,
    creator: 'http://example.com/person1',
    license: 'http://example.org/license',
  });

  await storer.addText({
    description: 'Comment 2 about the resource',
    citation: 'A citation or reference to a work that supports the comment',
    about: resourceId,
    creator: 'http://example.com/person2',
    license: 'http://example.org/license',
  });

  // Wait a bit: storing the nanopubs takes some time
  await setTimeout(2000);
});

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

    expect(enrichments).toStrictEqual([
      {
        id: expect.stringContaining('https://'),
        about: resourceId,
        description: 'Comment 1 about the resource',
        source: 'A citation or reference to a work that supports the comment',
        creator: 'http://example.com/person1',
        license: 'http://example.org/license',
        dateCreated: expect.any(Date),
      },
      {
        id: expect.stringContaining('https://'),
        about: resourceId,
        description: 'Comment 2 about the resource',
        source: 'A citation or reference to a work that supports the comment',
        creator: 'http://example.com/person2',
        license: 'http://example.org/license',
        dateCreated: expect.any(Date),
      },
    ]);
  });
});