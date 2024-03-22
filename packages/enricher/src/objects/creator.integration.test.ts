import {NanopubClient} from '../client';
import {HeritageObjectEnrichmentCreator} from './creator';
import {AdditionalType} from './definitions';
import {describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

const nanopubClient = new NanopubClient({
  endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
  proxyEndpointUrl: env.NANOPUB_WRITE_PROXY_ENDPOINT_URL as string,
});

const creator = new HeritageObjectEnrichmentCreator({
  endpointUrl: env.SPARQL_ENDPOINT_URL as string,
  nanopubClient,
});

describe('add', () => {
  it('adds a textual enrichment', async () => {
    const enrichment = await creator.addText({
      additionalType: AdditionalType.Name,
      description: 'A comment about the name of an object',
      citation: 'A citation or reference to a work that supports the comment',
      inLanguage: 'en',
      about: 'http://example.org/object',
      creator: {
        id: 'http://example.com/person',
        name: 'Person',
      },
      license: 'https://creativecommons.org/licenses/by/4.0/',
    });

    expect(enrichment).toEqual({
      id: expect.stringContaining('https://'),
    });
  });
});
