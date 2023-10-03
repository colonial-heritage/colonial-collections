import {ProvenanceEventsFetcher} from './provenance-events-fetcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let provenanceEventsFetcher: ProvenanceEventsFetcher;

beforeEach(() => {
  provenanceEventsFetcher = new ProvenanceEventsFetcher({
    endpointUrl: env.SPARQL_ENDPOINT_URL as string,
  });
});

describe('getByHeritageObjectId', () => {
  it('returns undefined if a malformed ID is used', async () => {
    const heritageObject =
      await provenanceEventsFetcher.getByHeritageObjectId('malformedID');

    expect(heritageObject).toBeUndefined();
  });

  it('returns undefined if no heritage object matches the ID', async () => {
    const heritageObject = await provenanceEventsFetcher.getByHeritageObjectId(
      'https://unknown.org/'
    );

    expect(heritageObject).toBeUndefined();
  });

  it('returns empty array if heritage object does not have provenance events', async () => {
    const provenanceEvents =
      await provenanceEventsFetcher.getByHeritageObjectId(
        'https://example.org/objects/5'
      );

    expect(provenanceEvents).toEqual([]);
  });

  it('returns the provenance events of the heritage object', async () => {
    const provenanceEvents =
      await provenanceEventsFetcher.getByHeritageObjectId(
        'https://example.org/objects/1'
      );

    expect(provenanceEvents).toStrictEqual([
      {
        id: 'https://example.org/objects/1/provenance/event/4/activity/1',
        types: [
          {
            id: 'http://vocab.getty.edu/aat/300445014',
            name: 'returning',
          },
        ],
        description: 'Found in a basement',
        startDate: new Date('1939-01-01T00:00:00.000Z'),
        endDate: new Date('1939-01-01T00:00:00.000Z'),
        startsAfter: 'https://example.org/objects/1/provenance/event/3',
        location: {
          id: 'https://colonial-heritage.triply.cc/.well-known/genid/37089eb37f9f3698fab5e4c7f71ee71a',
          name: 'Paris',
        },
        transferredTo: {
          id: 'https://museum.example.org/',
          type: 'Organization',
          name: 'Museum',
        },
      },
      {
        id: 'https://example.org/objects/1/provenance/event/2/activity/1',
        types: [
          {
            id: 'http://vocab.getty.edu/aat/300417642',
            name: 'purchase (method of acquisition)',
          },
        ],
        description: 'Bought at an auction',
        startDate: new Date('1879-01-01T00:00:00.000Z'),
        endDate: new Date('1879-01-01T00:00:00.000Z'),
        startsAfter: 'https://example.org/objects/1/provenance/event/1',
        endsBefore: 'https://example.org/objects/1/provenance/event/3',
        location: {
          id: 'https://colonial-heritage.triply.cc/.well-known/genid/b021732a97a8b2b1244b60c64adb95bb',
          name: 'Amsterdam',
        },
        transferredFrom: {
          id: 'https://colonial-heritage.triply.cc/.well-known/genid/4e2e99583b9b0491a9ea06f41e9c1b9c',
          type: 'Person',
          name: 'Jan de Vries',
        },
      },
      {
        id: 'https://example.org/objects/1/provenance/event/3/activity/1',
        types: [
          {
            id: 'http://vocab.getty.edu/aat/300055292',
            name: 'theft (social issue)',
          },
        ],
        startDate: new Date('1901-01-01T00:00:00.000Z'),
        endDate: new Date('1901-01-01T00:00:00.000Z'),
        startsAfter: 'https://example.org/objects/1/provenance/event/2',
        endsBefore: 'https://example.org/objects/1/provenance/event/4',
        location: {
          id: 'https://colonial-heritage.triply.cc/.well-known/genid/242a0c6c6b6536e2e42202521f5ee29e',
          name: 'Amsterdam',
        },
        transferredFrom: {
          id: 'https://museum.example.org/',
          type: 'Organization',
          name: 'Museum',
        },
      },
      {
        id: 'https://example.org/objects/1/provenance/event/1/activity/1',
        types: [
          {
            id: 'http://vocab.getty.edu/aat/300417642',
            name: 'purchase (method of acquisition)',
          },
          {
            id: 'http://vocab.getty.edu/aat/300417644',
            name: 'transfer (method of acquisition)',
          },
        ],
        description: 'Bought for 1500 US dollars',
        startDate: new Date('1855-01-01T00:00:00.000Z'),
        endDate: new Date('1855-01-01T00:00:00.000Z'),
        endsBefore: 'https://example.org/objects/1/provenance/event/2',
        location: {
          id: 'https://colonial-heritage.triply.cc/.well-known/genid/e14682a5898674f0a1db2bae57df3df7',
          name: 'Jakarta',
        },
        transferredFrom: {
          id: 'https://colonial-heritage.triply.cc/.well-known/genid/e2139ec691f860d6bcdd915e6e38a42d',
          type: 'Person',
          name: 'Peter Hoekstra',
        },
        transferredTo: {
          id: 'https://colonial-heritage.triply.cc/.well-known/genid/172854a675881c202013b5f6901247a2',
          type: 'Person',
          name: 'Jan de Vries',
        },
      },
    ]);
  });
});
