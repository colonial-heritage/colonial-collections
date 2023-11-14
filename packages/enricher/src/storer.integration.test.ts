import {NanopubWriter} from './writer';
import {EnrichmentStorer} from './storer';
import {describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

const nanopubWriter = new NanopubWriter({
  endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
  proxyEndpointUrl: env.NANOPUB_WRITE_PROXY_ENDPOINT_URL as string,
});

const storer = new EnrichmentStorer({nanopubWriter});

describe('add', () => {
  it('adds a textual enrichment', async () => {
    const enrichment = await storer.addText({
      description: 'A comment about the object',
      citation: 'A citation or reference to a work that supports the comment',
      about: 'http://example.org/object',
      creator: 'http://example.com/person',
      license: 'http://example.org/license',
    });

    expect(enrichment).toEqual({
      id: expect.stringContaining('https://'),
    });
  });
});
