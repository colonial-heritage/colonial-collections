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

    // For now ignore order of elements in the array (until the events are sorted)
    expect(provenanceEvents).toHaveLength(4);
    expect(provenanceEvents).toEqual(
      expect.arrayContaining([
        {
          id: 'https://example.org/objects/1/provenance/event/3/activity/1',
          types: [
            {
              id: 'http://vocab.getty.edu/aat/300055292',
              name: 'theft (social issue)',
            },
          ],
          startDate: new Date('1901-01-01'),
          endDate: new Date('1901-01-01'),
          startsAfter: 'https://example.org/objects/1/provenance/event/2',
          endsBefore: 'https://example.org/objects/1/provenance/event/4',
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/ceaf631aca53f3ce08e746c704112976',
            name: 'Amsterdam',
          },
          transferredFrom: {
            id: 'https://museum.example.org/',
            type: 'Organization',
            name: 'Museum',
          },
        },
        {
          id: 'https://example.org/objects/1/provenance/event/4/activity/1',
          types: [
            {
              id: 'http://vocab.getty.edu/aat/300445014',
              name: 'returning',
            },
          ],
          description: 'Found in a basement',
          startDate: new Date('1939-01-01'),
          endDate: new Date('1939-01-01'),
          startsAfter: 'https://example.org/objects/1/provenance/event/3',
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/8b43a21440e4fc05eef803e11dd9bc81',
            name: 'Paris',
          },
          transferredTo: {
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
          startDate: new Date('1855-01-01'),
          endDate: new Date('1855-01-01'),
          endsBefore: 'https://example.org/objects/1/provenance/event/2',
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/284f309a0b4ecf92d513599a16d72cf0',
            name: 'Jakarta',
          },
          transferredFrom: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/c7540c5ed76b0e24f19eec08a72e6e9d',
            type: 'Person',
            name: 'Peter Hoekstra',
          },
          transferredTo: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/f759902c257ad6daff7d98c7e48cc9dc',
            type: 'Person',
            name: 'Jan de Vries',
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
          startDate: new Date('1879-01-01'),
          endDate: new Date('1879-01-01'),
          startsAfter: 'https://example.org/objects/1/provenance/event/1',
          endsBefore: 'https://example.org/objects/1/provenance/event/3',
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/54da9245ecfc5f53678052ed81f71e56',
            name: 'Amsterdam',
          },
          transferredFrom: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/bda53ad8480465982765f52ef0ad42dd',
            type: 'Person',
            name: 'Jan de Vries',
          },
        },
      ])
    );
  });
});
