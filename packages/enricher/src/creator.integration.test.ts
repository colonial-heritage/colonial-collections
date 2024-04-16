import {
  EnrichmentCreator,
  HeritageObjectEnrichmentType,
  NanopubClient,
  ProvenanceEventType,
} from '.';
import {describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

const nanopubClient = new NanopubClient({
  endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
  proxyEndpointUrl: env.NANOPUB_WRITE_PROXY_ENDPOINT_URL as string,
});

const creator = new EnrichmentCreator({
  knowledgeGraphEndpointUrl: env.SPARQL_ENDPOINT_URL as string,
  nanopubClient,
});

describe('addText', () => {
  it('adds a textual enrichment', async () => {
    const enrichment = await creator.addText({
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
            id: 'http://example.com/community',
            name: 'Community',
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

describe('addProvenanceEvent', () => {
  it('adds a provenance event enrichment', async () => {
    const enrichment = await creator.addProvenanceEvent({
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
      about: 'http://example.org/object',
      pubInfo: {
        creator: {
          id: 'http://example.com/person',
          name: 'Person',
          isPartOf: {
            id: 'http://example.com/community',
            name: 'Community',
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
