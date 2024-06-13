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

describe('add event', () => {
  it('adds an event with only a start date', async () => {
    const enrichment = await storer.add({
      type: ProvenanceEventType.Acquisition,
      about: 'http://example.org/object1',
      date: {
        startDate: '1805',
      },
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

  it('adds an event with only an end date', async () => {
    const enrichment = await storer.add({
      type: ProvenanceEventType.Acquisition,
      about: 'http://example.org/object1',
      date: {
        endDate: '1806',
      },
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
});

describe('add acquisition event', () => {
  it('adds a basic event, with only required properties', async () => {
    const enrichment = await storer.add({
      type: ProvenanceEventType.Acquisition,
      about: 'http://example.org/object1',
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

  it('adds a full event, with all properties', async () => {
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
      qualifier: {
        id: 'http://vocab.getty.edu/aat/300435722',
        name: 'Possibly',
      },
      about: 'http://example.org/object1',
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

describe('add transfer of custody event', () => {
  it('adds a basic event, with only required properties', async () => {
    const enrichment = await storer.add({
      type: ProvenanceEventType.TransferOfCustody,
      about: 'http://example.org/object1',
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

  it('adds a full event, with all properties', async () => {
    const enrichment = await storer.add({
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
      qualifier: {
        id: 'http://vocab.getty.edu/aat/300435722',
        name: 'Possibly',
      },
      about: 'http://example.org/object1',
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
