import {NanopubClient} from '../client';
import {HeritageObjectEnrichmentType} from './definitions';
import {HeritageObjectEnrichmentStorer} from './storer';
import {describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

const nanopubClient = new NanopubClient({
  endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
  proxyEndpointUrl: env.NANOPUB_WRITE_PROXY_ENDPOINT_URL as string,
});

const storer = new HeritageObjectEnrichmentStorer({nanopubClient});

describe('add', () => {
  it('adds a textual enrichment', async () => {
    const enrichment = await storer.addText({
      type: HeritageObjectEnrichmentType.Name,
      description: 'A comment about the name of an object',
      citation: 'A citation or reference to a work that supports the comment',
      inLanguage: 'en',
      about: {
        id: 'http://example.org/object#name',
        isPartOf: {
          id: 'http://example.org/object',
        },
      },
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
