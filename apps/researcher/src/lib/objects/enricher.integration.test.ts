import {HeritageObjectEnricher} from '.';
import {beforeEach, describe, expect, it} from '@jest/globals';
import {env} from 'node:process';

let heritageObjectEnricher: HeritageObjectEnricher;

beforeEach(() => {
  heritageObjectEnricher = new HeritageObjectEnricher({
    endpointUrl: env.SEARCH_PLATFORM_SPARQL_ENDPOINT_URL as string,
  });
});

describe('getByIri', () => {
  it('returns undefined if IRIs have not been loaded', async () => {
    const result = heritageObjectEnricher.getByIri({
      iri: 'https://example.org/datasets/1',
    });

    expect(result).toBeUndefined();
  });

  it('returns undefined if the resource of the provided IRI does not exist', async () => {
    await heritageObjectEnricher.loadByIris({
      iris: ['https://doesnotexist.org'],
    });

    const label = heritageObjectEnricher.getByIri({
      iri: 'https://doesnotexist.org',
    });

    expect(label).toBeUndefined();
  });

  it('gets data by IRI', async () => {
    const iris = ['https://example.org/objects/1'];
    await heritageObjectEnricher.loadByIris({iris});

    const result = heritageObjectEnricher.getByIri({
      iri: 'https://example.org/objects/1',
    });

    expect(result).toStrictEqual({
      id: 'https://example.org/objects/1',
      subjectOf: [
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
          transferredFrom: {
            id: 'https://museum.example.org/',
            name: 'Museum',
          },
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/937f142f267171484afa9f5add32dee2',
            name: 'Amsterdam',
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
          endDate: new Date('1939-01-01T00:00:00.000Z'),
          startsAfter: 'https://example.org/objects/1/provenance/event/3',
          transferredTo: {
            id: 'https://museum.example.org/',
            name: 'Museum',
          },
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/e3b1549a503d5ff866dabe0c91d29f7d',
            name: 'Paris',
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
          transferredFrom: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/dcd4ee3b11315a1e92bf5ed922a873f0',
            name: 'Peter Hoekstra',
          },
          transferredTo: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/9a1d94f7d8f54e015c893c30367df756',
            name: 'Jan de Vries',
          },
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/136e95a2e1aa9f7e4d19e29a4f1af3d8',
            name: 'Jakarta',
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
          transferredFrom: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/25022ed592e76e082dd63c7a6024b4b0',
            name: 'Jan de Vries',
          },
          location: {
            id: 'https://colonial-heritage.triply.cc/.well-known/genid/989fa5e7105587ce72fe616eb6bd23a4',
            name: 'Amsterdam',
          },
        },
      ],
    });
  });
});
