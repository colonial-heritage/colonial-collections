import {NanopubClient} from './client';
import {Enricher} from './enricher';
import {describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

const nanopubClient = new NanopubClient({
  endpointUrl: env.NANOPUB_ENDPOINT_URL as string,
  proxyEndpointUrl: env.NANOPUB_PROXY_ENDPOINT_URL as string,
});

const enricher = new Enricher({
  nanopubClient,
});

describe('add', () => {
  it('adds a text enrichment', async () => {
    await enricher.addText({
      value: 'A comment',
      about: 'http://example.org/object',
      creator: 'http://example.com/person',
      license: 'http://example.org/license',
    });
  });
});
