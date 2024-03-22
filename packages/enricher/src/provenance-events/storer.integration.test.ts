import {NanopubClient} from '../client';
import {ProvenanceEventType} from './definitions';
import {ProvenanceEventEnrichmentStorer} from './storer';
import {describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

const nanopubClient = new NanopubClient({
  endpointUrl: env.NANOPUB_WRITE_ENDPOINT_URL as string,
  proxyEndpointUrl: env.NANOPUB_WRITE_PROXY_ENDPOINT_URL as string,
});

const storer = new ProvenanceEventEnrichmentStorer({nanopubClient});

describe('add', () => {
  it('adds an acquisition event', async () => {
    const enrichment = await storer.add({
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
      description: 'Bought for 1500 US dollars',
      citation:
        'A citation or reference to a work that supports the information',
      inLanguage: 'en',
      about: {
        id: 'http://example.org/object',
      },
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

  it('adds a transfer of custody event', async () => {
    const enrichment = await storer.add({
      type: ProvenanceEventType.TransferOfCustody,
      additionalType: {
        id: 'http://vocab.getty.edu/aat/300445014',
        name: 'Returning',
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
        startDate: '1805-02',
        endDate: '1806-07-13',
      },
      description: 'Returned to the owner',
      citation:
        'A citation or reference to a work that supports the information',
      inLanguage: 'en',
      about: {
        id: 'http://example.org/object',
      },
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
