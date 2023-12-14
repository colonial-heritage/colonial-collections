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
    expect(provenanceEvents).toEqual(
      expect.arrayContaining([
        {
          id: 'https://example.org/objects/1/provenance/event/5/activity/1',
          types: [
            {
              id: 'http://vocab.getty.edu/aat/300417642',
              name: 'purchase (method of acquisition)',
            },
          ],
          description: 'Bought at an auction in Amsterdam',
          startDate: new Date('1879-01-01T00:00:00.000Z'),
          endDate: new Date('1879-01-01T00:00:00.000Z'),
          startsAfter:
            'https://example.org/objects/1/provenance/event/2/activity/1',
          endsBefore:
            'https://example.org/objects/1/provenance/event/3/activity/1',
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/9cb5c59b958f4878937957c423d308b5',
            name: 'Amsterdam',
          },
          transferredFrom: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/c08aa36cf775e23c92dd2430c1bbb99b',
            type: 'Person',
            name: 'Jonathan Hansen',
          },
          transferredTo: {
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
          startDate: new Date('1939-01-01T00:00:00.000Z'),
          endDate: new Date('1940-01-01T00:00:00.000Z'),
          startsAfter:
            'https://example.org/objects/1/provenance/event/3/activity/1',
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/fa56164b9dd96e37a4e93e018c51018e',
            name: 'Paris',
          },
          transferredTo: {
            id: 'https://museum.example.org/',
            type: 'Organization',
            name: 'Museum',
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
          startsAfter:
            'https://example.org/objects/1/provenance/event/5/activity/1',
          endsBefore:
            'https://example.org/objects/1/provenance/event/4/activity/1',
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/cd7ccc86fb7b17d1fb0bf425de63c796',
            name: 'Amsterdam',
          },
          transferredFrom: {
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
          description: 'Bought at an auction in The Hague',
          startDate: new Date('1879-01-01T00:00:00.000Z'),
          endDate: new Date('1879-01-01T00:00:00.000Z'),
          startsAfter:
            'https://example.org/objects/1/provenance/event/1/activity/1',
          endsBefore:
            'https://example.org/objects/1/provenance/event/5/activity/1',
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/522af0fad56ad754c58f48768e06bb58',
            name: 'The Hague',
          },
          transferredFrom: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/552102cb8b424cc0d8b49e59b6a990df',
            type: 'Person',
            name: 'Jan de Vries',
          },
          transferredTo: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/c581b92d73922421a4b688595e0000be',
            type: 'Person',
            name: 'Jonathan Hansen',
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
          endDate: new Date('1857-01-01T00:00:00.000Z'),
          endsBefore:
            'https://example.org/objects/1/provenance/event/2/activity/1',
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/2b434a4d7ed20396b17ba591079edc09',
            name: 'Jakarta',
          },
          transferredFrom: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/32d1c530bc7643fcf73a5f4e9fc18594',
            type: 'Person',
            name: 'Peter Hoekstra',
          },
          transferredTo: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/f639c45571fe3eef8752501d0ca96720',
            type: 'Person',
            name: 'Jan de Vries',
          },
        },
      ])
    );
  });
});
