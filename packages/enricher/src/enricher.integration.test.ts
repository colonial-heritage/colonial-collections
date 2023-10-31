import {NanopubWriter} from './writer';
import {Enricher} from './enricher';
import {describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

const nanopubWriter = new NanopubWriter({
  endpointUrl: env.NANOPUB_ENDPOINT_URL as string,
  proxyEndpointUrl: env.NANOPUB_PROXY_ENDPOINT_URL as string,
});

const enricher = new Enricher({nanopubWriter});

describe('add', () => {
  it('adds a textual enrichment', async () => {
    const enrichment = await enricher.addText({
      description: 'A comment about the object',
      source: 'A source that supports the comment',
      about: 'http://example.org/object',
      creator: 'http://example.com/person',
      license: 'http://example.org/license',
    });

    expect(enrichment).toEqual({
      id: expect.stringContaining('https://w3id.org/np/'),
    });
  });
});
