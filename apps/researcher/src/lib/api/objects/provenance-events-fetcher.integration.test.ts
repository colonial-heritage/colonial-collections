import {ProvenanceEventsFetcher} from './provenance-events-fetcher';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let provenanceEventsFetcher: ProvenanceEventsFetcher;

beforeEach(() => {
  provenanceEventsFetcher = new ProvenanceEventsFetcher({
    endpointUrl: env.KG_SPARQL_ENDPOINT_URL as string,
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
          id: expect.stringContaining(
            'https://colonial-heritage.triply.cc/.well-known/genid/'
          ),
          name: 'Jakarta',
        },
        transferredFrom: {
          type: 'Person',
          id: expect.stringContaining(
            'https://colonial-heritage.triply.cc/.well-known/genid/'
          ),
          name: 'Peter Hoekstra',
        },
        transferredTo: {
          type: 'Person',
          id: expect.stringContaining(
            'https://colonial-heritage.triply.cc/.well-known/genid/'
          ),
          name: 'Jan de Vries',
        },
      },
      {
        id: 'https://example.org/objects/1/provenance/event/4/activity/1',
        types: [
          {id: 'http://vocab.getty.edu/aat/300445014', name: 'returning'},
        ],
        description: 'Found in a basement',
        startDate: new Date('1939-01-01T00:00:00.000Z'),
        endDate: new Date('1939-01-01T00:00:00.000Z'),
        startsAfter: 'https://example.org/objects/1/provenance/event/3',
        location: {
          id: expect.stringContaining(
            'https://colonial-heritage.triply.cc/.well-known/genid/'
          ),
          name: 'Paris',
        },
        transferredTo: {
          type: 'Organization',
          id: 'https://museum.example.org/',
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
          id: expect.stringContaining(
            'https://colonial-heritage.triply.cc/.well-known/genid/'
          ),
          name: 'Amsterdam',
        },
        transferredFrom: {
          type: 'Person',
          id: expect.stringContaining(
            'https://colonial-heritage.triply.cc/.well-known/genid/'
          ),
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
          id: expect.stringContaining(
            'https://colonial-heritage.triply.cc/.well-known/genid/'
          ),
          name: 'Amsterdam',
        },
        transferredFrom: {
          type: 'Organization',
          id: 'https://museum.example.org/',
          name: 'Museum',
        },
      },
    ]);
  });
});
