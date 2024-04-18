import {NanopubClient} from '../client';
import {EnrichmentCreator} from '../creator';
import {ProvenanceEventType} from './definitions';
import {ProvenanceEventEnrichmentFetcher} from './fetcher';
import {beforeAll, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';
import {setTimeout} from 'node:timers/promises';

const fetcher = new ProvenanceEventEnrichmentFetcher({
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
  const resourceId = `http://example.org/${Date.now()}`;

  // Create some enrichments
  beforeAll(async () => {
    const nanopubClient = new NanopubClient({
      endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
      proxyEndpointUrl: env.NANOPUB_WRITE_PROXY_ENDPOINT_URL as string,
    });

    const creator = new EnrichmentCreator({
      knowledgeGraphEndpointUrl: env.SPARQL_ENDPOINT_URL as string,
      nanopubClient,
    });

    await creator.addProvenanceEvent({
      type: ProvenanceEventType.Acquisition,
      about: resourceId,
      pubInfo: {
        creator: {
          id: 'http://example.com/person1',
          name: 'Person 1',
        },
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
    });

    await creator.addProvenanceEvent({
      type: ProvenanceEventType.TransferOfCustody,
      about: resourceId,
      pubInfo: {
        creator: {
          id: 'http://example.com/person2',
          name: 'Person 2',
        },
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
    });

    // Wait a bit: storing the nanopubs takes some time
    await setTimeout(2000);
  });

  it('gets the enrichments of a resource', async () => {
    const enrichments = await fetcher.getById(resourceId);

    expect(enrichments).toEqual(
      expect.arrayContaining([
        {
          id: expect.stringContaining('https://'),
          type: ProvenanceEventType.Acquisition,
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
          type: ProvenanceEventType.TransferOfCustody,
          about: resourceId,
          pubInfo: {
            creator: {
              id: 'http://example.com/person2',
              name: 'Person 2',
            },
            license: 'https://creativecommons.org/licenses/by/4.0/',
            dateCreated: expect.any(Date),
          },
        },
      ])
    );
  });
});

describe('getById - full enrichments, with all properties', () => {
  const resourceId = `http://example.org/${Date.now()}`;

  // Create some enrichments
  beforeAll(async () => {
    const nanopubClient = new NanopubClient({
      endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
      proxyEndpointUrl: env.NANOPUB_WRITE_PROXY_ENDPOINT_URL as string,
    });

    const creator = new EnrichmentCreator({
      knowledgeGraphEndpointUrl: env.SPARQL_ENDPOINT_URL as string,
      nanopubClient,
    });

    await creator.addProvenanceEvent({
      type: ProvenanceEventType.Acquisition,
      additionalType: {
        id: 'http://vocab.getty.edu/aat/300417642',
        name: 'Purchase',
      },
      transferredFrom: {
        id: 'http://www.wikidata.org/entity/Q517',
        name: 'Napoleon',
      },
      transferredTo: {
        id: 'http://www.wikidata.org/entity/Q171480',
        name: 'Joséphine de Beauharnais',
      },
      location: {
        id: 'https://sws.geonames.org/2988507/',
        name: 'Paris',
      },
      date: {
        startDate: '1805',
        endDate: '1806',
      },
      description: 'A comment',
      citation:
        'A citation or reference to a work that supports the information',
      inLanguage: 'en',
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

    await creator.addProvenanceEvent({
      type: ProvenanceEventType.TransferOfCustody,
      additionalType: {
        id: 'http://vocab.getty.edu/aat/300445014',
        name: 'Returning',
      },
      transferredFrom: {
        id: 'http://www.wikidata.org/entity/Q131691',
        name: 'Arthur Wellesley',
      },
      transferredTo: {
        id: 'http://www.wikidata.org/entity/Q9439',
        name: 'Victoria',
      },
      location: {
        id: 'https://sws.geonames.org/2643743/',
        name: 'London',
      },
      date: {
        startDate: '1850-02',
        endDate: '1850-07-13',
      },
      description: 'Returned to the owner',
      citation:
        'A citation or reference to a work that supports the information',
      inLanguage: 'en',
      about: resourceId,
      pubInfo: {
        creator: {
          id: 'http://example.com/person2',
          name: 'Person 2',
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

    expect(enrichments).toEqual(
      expect.arrayContaining([
        {
          id: expect.stringContaining('https://'),
          type: ProvenanceEventType.Acquisition,
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
          additionalTypes: [
            {
              id: 'http://vocab.getty.edu/aat/300417642',
              name: 'Purchase',
            },
          ],
          citation:
            'A citation or reference to a work that supports the information',
          description: 'A comment',
          inLanguage: 'en',
          date: {
            id: expect.stringContaining('https://'),
            startDate: new Date('1805-01-01T00:00:00.000Z'),
            endDate: new Date('1806-12-31T23:59:59.999Z'),
          },
          transferredFrom: {
            id: 'http://www.wikidata.org/entity/Q517',
            name: 'Napoleon',
          },
          transferredTo: {
            id: 'http://www.wikidata.org/entity/Q171480',
            name: 'Joséphine de Beauharnais',
          },
          location: {
            id: 'https://sws.geonames.org/2988507/',
            name: 'Paris',
          },
        },
        {
          id: expect.stringContaining('https://'),
          type: ProvenanceEventType.TransferOfCustody,
          about: resourceId,
          pubInfo: {
            creator: {
              id: 'http://example.com/person2',
              name: 'Person 2',
              isPartOf: {
                id: 'http://example.com/group2',
                name: 'Group 2',
              },
            },
            license: 'https://creativecommons.org/licenses/by/4.0/',
            dateCreated: expect.any(Date),
          },
          additionalTypes: [
            {
              id: 'http://vocab.getty.edu/aat/300445014',
              name: 'Returning',
            },
          ],
          citation:
            'A citation or reference to a work that supports the information',
          description: 'Returned to the owner',
          inLanguage: 'en',
          date: {
            id: expect.stringContaining('https://'),
            startDate: new Date('1850-02-01T00:00:00.000Z'),
            endDate: new Date('1850-07-13T23:59:59.999Z'),
          },
          transferredFrom: {
            id: 'http://www.wikidata.org/entity/Q131691',
            name: 'Arthur Wellesley',
          },
          transferredTo: {
            id: 'http://www.wikidata.org/entity/Q9439',
            name: 'Victoria',
          },
          location: {
            id: 'https://sws.geonames.org/2643743/',
            name: 'London',
          },
        },
      ])
    );
  });
});
