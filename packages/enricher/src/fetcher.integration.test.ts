import {NanopubClient} from './client';
import {EnrichmentCreator} from './creator';
import {AdditionalType} from './definitions';
import {EnrichmentFetcher} from './fetcher';
import {beforeAll, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';
import {setTimeout} from 'node:timers/promises';

const fetcher = new EnrichmentFetcher({
  endpointUrl: env.NANOPUB_SPARQL_ENDPOINT_URL as string,
});

const resourceId = `http://example.org/${Date.now()}`;

// Create some enrichments
beforeAll(async () => {
  const nanopubClient = new NanopubClient({
    endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
    proxyEndpointUrl: env.NANOPUB_WRITE_PROXY_ENDPOINT_URL as string,
  });

  const creator = new EnrichmentCreator({
    endpointUrl: env.SPARQL_ENDPOINT_URL as string,
    nanopubClient,
  });

  await creator.addText({
    additionalType: AdditionalType.Name,
    description: 'Comment about the name of the resource',
    citation: 'A citation or reference to a work that supports the comment',
    inLanguage: 'en-gb',
    creator: {
      id: 'http://example.com/person1',
      name: 'Person 1',
    },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    about: resourceId,
  });

  await creator.addText({
    additionalType: AdditionalType.Description,
    description: 'Comment about the description of the resource',
    citation: 'A citation or reference to a work that supports the comment',
    creator: {
      id: 'http://example.com/person2',
      name: 'Person 2',
    },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    about: resourceId,
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
        additionalType: AdditionalType.Name,
        description: 'Comment about the name of the resource',
        citation: 'A citation or reference to a work that supports the comment',
        inLanguage: 'en-gb',
        creator: {
          id: 'http://example.com/person1',
          name: 'Person 1',
        },
        license: 'https://creativecommons.org/licenses/by/4.0/',
        dateCreated: expect.any(Date),
        about: resourceId,
      },
      {
        id: expect.stringContaining('https://'),
        additionalType: AdditionalType.Description,
        description: 'Comment about the description of the resource',
        citation: 'A citation or reference to a work that supports the comment',
        creator: {
          id: 'http://example.com/person2',
          name: 'Person 2',
        },
        license: 'https://creativecommons.org/licenses/by/4.0/',
        dateCreated: expect.any(Date),
        about: resourceId,
      },
    ]);
  });
});
