import {NanopubClient} from '../client';
import {LocalContextsNoticeEnrichmentType} from './definitions';
import {LocalContextsNoticeEnrichmentStorer} from './storer';
import {describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

const nanopubClient = new NanopubClient({
  endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
  proxyEndpointUrl: env.NANOPUB_WRITE_PROXY_ENDPOINT_URL as string,
});

const storer = new LocalContextsNoticeEnrichmentStorer({nanopubClient});

describe('add', () => {
  it('adds a basic enrichment, with only required properties', async () => {
    const enrichment = await storer.add({
      type: LocalContextsNoticeEnrichmentType.Authorization,
      about: 'http://example.org/object',
      pubInfo: {
        creator: {
          id: 'http://example.com/person',
          name: 'Person',
        },
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
    });

    expect(enrichment).toEqual({
      id: expect.stringContaining('https://'),
    });
  });

  it('adds a full enrichment, with all properties', async () => {
    const enrichment = await storer.add({
      type: LocalContextsNoticeEnrichmentType.Authorization,
      description: 'A comment about the use of a Local Contexts Notice',
      citation: 'A citation or reference to a work that supports the comment',
      inLanguage: 'en',
      about: 'http://example.org/object',
      pubInfo: {
        creator: {
          id: 'http://example.com/person',
          name: 'Person',
          isPartOf: {
            id: 'http://example.com/group',
            name: 'Group',
          },
        },
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
    });

    expect(enrichment).toEqual({
      id: expect.stringContaining('https://'),
    });
  });
});
