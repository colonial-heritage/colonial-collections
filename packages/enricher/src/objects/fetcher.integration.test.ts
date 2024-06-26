import {NanopubClient} from '../client';
import {EnrichmentCreator} from '../creator';
import {HeritageObjectEnrichmentType} from './definitions';
import {HeritageObjectEnrichmentFetcher} from './fetcher';
import {beforeAll, describe, expect, it} from '@jest/globals';
import {randomUUID} from 'node:crypto';
import {env} from 'node:process';
import {setTimeout} from 'node:timers/promises';

const nanopubClient = new NanopubClient({
  endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
  proxyEndpointUrl: env.NANOPUB_WRITE_PROXY_ENDPOINT_URL as string,
});

const creator = new EnrichmentCreator({nanopubClient});

const fetcher = new HeritageObjectEnrichmentFetcher({
  endpointUrl: env.NANOPUB_SPARQL_ENDPOINT_URL as string,
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
});

describe('getById - basic enrichments, with only required properties', () => {
  const resourceId = `http://example.org/${randomUUID()}`;

  // Create some enrichments
  beforeAll(async () => {
    await creator.addText({
      type: HeritageObjectEnrichmentType.Name,
      about: resourceId,
      pubInfo: {
        creator: {
          id: 'http://example.com/person1',
          name: 'Person 1',
        },
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
    });

    await creator.addText({
      type: HeritageObjectEnrichmentType.Description,
      about: resourceId,
      pubInfo: {
        creator: {
          id: 'http://example.com/person1',
          name: 'Person 1',
        },
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
    });

    // Wait a bit: storing the nanopubs takes some time
    await setTimeout(2000);
  });

  it('gets the enrichments of a resource', async () => {
    const enrichments = await fetcher.getById(resourceId);

    expect(enrichments).toStrictEqual([
      {
        id: expect.stringContaining('https://'),
        type: HeritageObjectEnrichmentType.Name,
        about: resourceId,
        pubInfo: {
          creator: {
            id: 'http://example.com/person1',
            name: 'Person 1',
          },
          license: 'https://creativecommons.org/licenses/by/4.0/',
          dateCreated: expect.any(Date),
        },
      },
      {
        id: expect.stringContaining('https://'),
        type: HeritageObjectEnrichmentType.Description,
        about: resourceId,
        pubInfo: {
          creator: {
            id: 'http://example.com/person1',
            name: 'Person 1',
          },
          license: 'https://creativecommons.org/licenses/by/4.0/',
          dateCreated: expect.any(Date),
        },
      },
    ]);
  });
});

describe('getById - full enrichments, with all properties', () => {
  const resourceId = `http://example.org/${randomUUID()}`;

  // Create some enrichments
  beforeAll(async () => {
    await creator.addText({
      type: HeritageObjectEnrichmentType.Name,
      description: 'Comment about the name of the resource',
      citation: 'A citation or reference to a work that supports the comment',
      inLanguage: 'en-gb',
      about: resourceId,
      pubInfo: {
        creator: {
          id: 'http://example.com/person1',
          name: 'Person 1',
          isPartOf: {
            id: 'http://example.com/group1',
            name: 'Group 1',
          },
        },
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
    });

    await creator.addText({
      type: HeritageObjectEnrichmentType.Description,
      description: 'Comment about the description of the resource',
      citation: 'A citation or reference to a work that supports the comment',
      about: resourceId,
      inLanguage: 'en-gb',
      pubInfo: {
        creator: {
          id: 'http://example.com/person1',
          name: 'Person 1',
          isPartOf: {
            id: 'http://example.com/group2',
            name: 'Group 2',
          },
        },
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
    });

    // Wait a bit: storing the nanopubs takes some time
    await setTimeout(2000);
  });

  it('gets the enrichments of a resource', async () => {
    const enrichments = await fetcher.getById(resourceId);

    expect(enrichments).toStrictEqual([
      {
        id: expect.stringContaining('https://'),
        type: HeritageObjectEnrichmentType.Name,
        description: 'Comment about the name of the resource',
        citation: 'A citation or reference to a work that supports the comment',
        inLanguage: 'en-gb',
        about: resourceId,
        pubInfo: {
          creator: {
            id: 'http://example.com/person1',
            name: 'Person 1',
            isPartOf: {
              id: 'http://example.com/group1',
              name: 'Group 1',
            },
          },
          license: 'https://creativecommons.org/licenses/by/4.0/',
          dateCreated: expect.any(Date),
        },
      },
      {
        id: expect.stringContaining('https://'),
        type: HeritageObjectEnrichmentType.Description,
        description: 'Comment about the description of the resource',
        citation: 'A citation or reference to a work that supports the comment',
        inLanguage: 'en-gb',
        about: resourceId,
        pubInfo: {
          creator: {
            id: 'http://example.com/person1',
            name: 'Person 1',
            isPartOf: {
              id: 'http://example.com/group2',
              name: 'Group 2',
            },
          },
          license: 'https://creativecommons.org/licenses/by/4.0/',
          dateCreated: expect.any(Date),
        },
      },
    ]);
  });
});
