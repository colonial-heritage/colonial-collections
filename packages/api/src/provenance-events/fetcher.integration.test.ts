import {ProvenanceEventType} from '../definitions';
import {ProvenanceEventsFetcher} from './fetcher';
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
    const heritageObject = await provenanceEventsFetcher.getByHeritageObjectId({
      id: 'malformedID',
    });

    expect(heritageObject).toBeUndefined();
  });

  it('returns undefined if no heritage object matches the ID', async () => {
    const heritageObject = await provenanceEventsFetcher.getByHeritageObjectId({
      id: 'https://unknown.org/',
    });

    expect(heritageObject).toBeUndefined();
  });

  it('returns empty array if heritage object does not have provenance events', async () => {
    const provenanceEvents =
      await provenanceEventsFetcher.getByHeritageObjectId({
        id: 'https://example.org/objects/5',
      });

    expect(provenanceEvents).toEqual([]);
  });

  it('returns the provenance events', async () => {
    const provenanceEvents =
      await provenanceEventsFetcher.getByHeritageObjectId({
        id: 'https://example.org/objects/1',
      });

    expect(provenanceEvents).toEqual(
      expect.arrayContaining([
        {
          id: 'https://example.org/objects/1/provenance/event/3/activity/1',
          type: ProvenanceEventType.TransferOfCustody,
          additionalTypes: expect.arrayContaining([
            {
              id: 'http://vocab.getty.edu/aat/300055292',
              name: 'theft (social issue)',
            },
          ]),
          date: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1901-01-01T00:00:00.000Z'),
            endDate: new Date('1901-12-31T23:59:59.999Z'),
          },
          location: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            name: 'Amsterdam',
          },
          transferredFrom: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            type: 'Organization',
            name: 'Organization A',
          },
        },
        {
          id: 'https://example.org/objects/1/provenance/event/5/activity/1',
          type: ProvenanceEventType.Acquisition,
          additionalTypes: expect.arrayContaining([
            {
              id: 'http://vocab.getty.edu/aat/300417642',
              name: 'purchase (method of acquisition)',
            },
          ]),
          description: 'Bought at an auction in Amsterdam',
          date: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1879-01-01T00:00:00.000Z'),
            endDate: new Date('1879-12-31T23:59:59.999Z'),
          },
          location: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            name: 'Amsterdam',
          },
          transferredFrom: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            type: 'Person',
            name: 'Jonathan Hansen',
          },
          transferredTo: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            type: 'Organization',
            name: 'Organization A',
          },
        },
        {
          id: 'https://example.org/objects/1/provenance/event/4/activity/1',
          type: ProvenanceEventType.TransferOfCustody,
          additionalTypes: expect.arrayContaining([
            {
              id: 'http://vocab.getty.edu/aat/300445014',
              name: 'returning',
            },
          ]),
          description: 'Found in a basement',
          date: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1939-01-01T00:00:00.000Z'),
            endDate: new Date('1940-12-31T23:59:59.999Z'),
          },
          location: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            name: 'Paris',
          },
          transferredTo: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            type: 'Organization',
            name: 'Organization A',
          },
        },
        {
          id: 'https://example.org/objects/1/provenance/event/2/activity/1',
          type: ProvenanceEventType.Acquisition,
          additionalTypes: expect.arrayContaining([
            {
              id: 'http://vocab.getty.edu/aat/300417642',
              name: 'purchase (method of acquisition)',
            },
          ]),
          description: 'Bought at an auction in The Hague',
          date: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1879-01-01T00:00:00.000Z'),
            endDate: new Date('1879-12-31T23:59:59.999Z'),
          },
          location: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            name: 'The Hague',
          },
          transferredFrom: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            type: 'Person',
            name: 'Jan de Vries',
          },
          transferredTo: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            type: 'Person',
            name: 'Jonathan Hansen',
          },
        },
        {
          id: 'https://example.org/objects/1/provenance/event/1/activity/1',
          type: ProvenanceEventType.Acquisition,
          additionalTypes: expect.arrayContaining([
            {
              id: 'http://vocab.getty.edu/aat/300417644',
              name: 'transfer (method of acquisition)',
            },
            {
              id: 'http://vocab.getty.edu/aat/300417642',
              name: 'purchase (method of acquisition)',
            },
          ]),
          description: 'Bought for 1500 US dollars',
          date: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            startDate: new Date('1855-01-01T00:00:00.000Z'),
            endDate: new Date('1857-12-31T23:59:59.999Z'),
          },
          location: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            name: 'Jakarta',
          },
          transferredFrom: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            type: 'Person',
            name: 'Peter Hoekstra',
          },
          transferredTo: {
            id: expect.stringContaining(
              'https://data.colonialcollections.nl/.well-known/genid/'
            ),
            type: 'Person',
            name: 'Jan de Vries',
          },
        },
      ])
    );
  });
});

describe('get with localized names', () => {
  it('returns the provenance events with English names', async () => {
    const provenanceEvents =
      await provenanceEventsFetcher.getByHeritageObjectId({
        locale: 'en',
        id: 'https://example.org/objects/1',
      });

    // Currently the only localized parts
    expect(provenanceEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'https://example.org/objects/1/provenance/event/3/activity/1',
          additionalTypes: expect.arrayContaining([
            {
              id: 'http://vocab.getty.edu/aat/300055292',
              name: 'theft (social issue)',
            },
          ]),
        }),
        expect.objectContaining({
          id: 'https://example.org/objects/1/provenance/event/5/activity/1',
          additionalTypes: expect.arrayContaining([
            {
              id: 'http://vocab.getty.edu/aat/300417642',
              name: 'purchase (method of acquisition)',
            },
          ]),
        }),
        expect.objectContaining({
          id: 'https://example.org/objects/1/provenance/event/4/activity/1',
          additionalTypes: expect.arrayContaining([
            {
              id: 'http://vocab.getty.edu/aat/300445014',
              name: 'returning',
            },
          ]),
        }),
        expect.objectContaining({
          id: 'https://example.org/objects/1/provenance/event/2/activity/1',
          additionalTypes: expect.arrayContaining([
            {
              id: 'http://vocab.getty.edu/aat/300417642',
              name: 'purchase (method of acquisition)',
            },
          ]),
        }),
        expect.objectContaining({
          id: 'https://example.org/objects/1/provenance/event/1/activity/1',
          additionalTypes: expect.arrayContaining([
            {
              id: 'http://vocab.getty.edu/aat/300417642',
              name: 'purchase (method of acquisition)',
            },
            {
              id: 'http://vocab.getty.edu/aat/300417644',
              name: 'transfer (method of acquisition)',
            },
          ]),
        }),
      ])
    );
  });

  it('returns the provenance events with Dutch names', async () => {
    const provenanceEvents =
      await provenanceEventsFetcher.getByHeritageObjectId({
        locale: 'nl',
        id: 'https://example.org/objects/1',
      });

    // Currently the only localized parts
    expect(provenanceEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'https://example.org/objects/1/provenance/event/3/activity/1',
          additionalTypes: [
            {
              id: 'http://vocab.getty.edu/aat/300055292',
              name: 'diefstal',
            },
          ],
        }),
        expect.objectContaining({
          id: 'https://example.org/objects/1/provenance/event/5/activity/1',
        }),
        expect.objectContaining({
          id: 'https://example.org/objects/1/provenance/event/4/activity/1',
        }),
        expect.objectContaining({
          id: 'https://example.org/objects/1/provenance/event/2/activity/1',
        }),
        expect.objectContaining({
          id: 'https://example.org/objects/1/provenance/event/1/activity/1',
        }),
      ])
    );
  });
});
