import {NanopubClient} from '.';
import {describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

const nanopub = new NanopubClient({
  endpointUrl: env.NANOPUB_ENDPOINT_URL as string,
  proxyEndpointUrl: env.NANOPUB_PROXY_ENDPOINT_URL as string,
});

describe('create', () => {
  it('creates a nanopub', async () => {
    await nanopub.create({
      signerIri: 'http://example.com/signer',
    });
  });
});
