import {ProvenanceEventType} from './definitions';
import {toProvenanceEventEnrichment} from './rdf-helpers';
import {describe, expect, it} from '@jest/globals';
import {StreamParser} from 'n3';
import {RdfObjectLoader, Resource} from 'rdf-object';
import streamifyString from 'streamify-string';

const loader = new RdfObjectLoader({
  context: {
    ex: 'https://example.org/',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  },
});

let enrichmentResource1: Resource;
let enrichmentResource2: Resource;

beforeAll(async () => {
  const triples = `
    @prefix ex: <https://example.org/> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

    ex:enrichment1 a ex:Acquisition ;
      ex:about <https://example.com/object> ;
      ex:creator ex:creator1 ;
      ex:license <https://example.com/license> ;
      ex:dateCreated "2023-01-01"^^xsd:date ;
      ex:additionalType ex:additionalType1 ;
      ex:citation "Citation" ;
      ex:description "Description" ;
      ex:inLanguage "en" ;
      ex:date ex:timeSpan1 ;
      ex:transferredFrom ex:transferredFrom1 ;
      ex:transferredTo ex:transferredTo1 ;
      ex:location ex:location1 .

    ex:creator1 a ex:Actor ;
      ex:id <https://example.com/creator> ;
      ex:name "Creator Name" .

    ex:additionalType1 a ex:Term ;
      ex:name "Term Name" .

    ex:timeSpan1 a ex:TimeSpan ;
      ex:startDate "1889"^^xsd:gYear ;
      ex:endDate "1900"^^xsd:gYear .

    ex:transferredFrom1 a ex:Actor ;
      ex:id <https://example.com/transferredFrom> ;
      ex:name "Transferred From Name" .

    ex:transferredTo1 a ex:Actor ;
      ex:id <https://example.com/transferredTo> ;
      ex:name "Transferred To Name" .

    ex:location1 a ex:Place ;
      ex:id <https://example.com/location> ;
      ex:name "Location Name" .

    ex:enrichment2 a ex:TransferOfCustody ;
      ex:about <https://example.com/object> ;
      ex:creator ex:creator1 ;
      ex:license <https://example.com/license> ;
      ex:dateCreated "2023-01-01"^^xsd:date .
  `;

  const stringStream = streamifyString(triples);
  const streamParser = new StreamParser();
  stringStream.pipe(streamParser);
  await loader.import(streamParser);

  enrichmentResource1 = loader.resources['https://example.org/enrichment1'];
  enrichmentResource2 = loader.resources['https://example.org/enrichment2'];
});

describe('toProvenanceEventEnrichment', () => {
  it('returns a full enrichment', () => {
    const enrichment = toProvenanceEventEnrichment(enrichmentResource1);

    expect(enrichment).toStrictEqual({
      id: 'https://example.org/enrichment1',
      type: ProvenanceEventType.Acquisition,
      about: 'https://example.com/object',
      pubInfo: {
        creator: {
          id: 'https://example.org/creator1',
          name: 'Creator Name',
        },
        license: 'https://example.com/license',
        dateCreated: new Date('2023-01-01T00:00:00.000Z'),
      },
      additionalTypes: [
        {
          id: 'https://example.org/additionalType1',
          name: 'Term Name',
        },
      ],
      citation: 'Citation',
      description: 'Description',
      inLanguage: 'en',
      date: {
        id: 'https://example.org/timeSpan1',
        startDate: new Date('1889-01-01T00:00:00.000Z'),
        endDate: new Date('1900-12-31T23:59:59.999Z'),
      },
      transferredFrom: {
        id: 'https://example.org/transferredFrom1',
        name: 'Transferred From Name',
      },
      transferredTo: {
        id: 'https://example.org/transferredTo1',
        name: 'Transferred To Name',
      },
      location: {
        id: 'https://example.org/location1',
        name: 'Location Name',
      },
    });
  });

  it('returns a basic enrichment', () => {
    const enrichment = toProvenanceEventEnrichment(enrichmentResource2);

    expect(enrichment).toStrictEqual({
      id: 'https://example.org/enrichment2',
      type: ProvenanceEventType.TransferOfCustody,
      about: 'https://example.com/object',
      pubInfo: {
        creator: {
          id: 'https://example.org/creator1',
          name: 'Creator Name',
        },
        license: 'https://example.com/license',
        dateCreated: new Date('2023-01-01T00:00:00.000Z'),
      },
    });
  });
});
