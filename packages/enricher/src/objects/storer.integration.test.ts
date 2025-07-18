import {NanopubClient} from '../native-client';
import {HeritageObjectEnrichmentType} from './definitions';
import {HeritageObjectEnrichmentStorer} from './storer';
import {describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

const nanopubClient = new NanopubClient({
  endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
  privateKey: env.NANOPUB_PRIVATE_KEY as string,
});

const storer = new HeritageObjectEnrichmentStorer({nanopubClient});

describe('add', () => {
  it('adds a basic textual enrichment, with only required properties', async () => {
    const enrichment = await storer.addText({
      type: HeritageObjectEnrichmentType.Name,
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

  it('adds a full textual enrichment, with all properties', async () => {
    const enrichment = await storer.addText({
      type: HeritageObjectEnrichmentType.Name,
      description: 'A comment about the name of an object',
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
