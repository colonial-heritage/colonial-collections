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

let basicEnrichmentResource: Resource;
let fullEnrichmentResource: Resource;

beforeAll(async () => {
  const triples = `
    @prefix ex: <https://example.org/> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

    ex:basicEnrichment a ex:TransferOfCustody ;
      ex:about <https://example.com/object> ;
      ex:creator ex:myPerson ;
      ex:license <https://example.com/license> ;
      ex:dateCreated "2023-01-01"^^xsd:date .

    ex:fullEnrichment a ex:Acquisition ;
      ex:about <https://example.com/object> ;
      ex:creator ex:myPerson ;
      ex:license <https://example.com/license> ;
      ex:dateCreated "2023-01-01"^^xsd:date ;
      ex:additionalType ex:myAdditionalType ;
      ex:citation "Citation" ;
      ex:description "Description" ;
      ex:inLanguage "en" ;
      ex:date ex:myTimeSpan ;
      ex:transferredFrom ex:myTransferredFrom ;
      ex:transferredTo ex:myTransferredTo ;
      ex:location ex:myLocation .

    ex:myPerson a ex:Actor ;
      ex:name "Person" ;
      ex:isPartOf ex:myGroup .

    ex:myGroup a ex:Actor ;
      ex:name "Group" .

    ex:myAdditionalType a ex:DefinedTerm ;
      ex:name "Term" .

    ex:myTimeSpan a ex:TimeSpan ;
      ex:startDate "1889"^^xsd:gYear ;
      ex:endDate "1900"^^xsd:gYear .

    ex:myTransferredFrom a ex:Actor ;
      ex:name "Transferred From" .

    ex:myTransferredTo a ex:Actor ;
      ex:name "Transferred To" .

    ex:myLocation a ex:Place ;
      ex:name "Location" .
  `;

  const stringStream = streamifyString(triples);
  const streamParser = new StreamParser();
  stringStream.pipe(streamParser);
  await loader.import(streamParser);

  basicEnrichmentResource =
    loader.resources['https://example.org/basicEnrichment'];
  fullEnrichmentResource =
    loader.resources['https://example.org/fullEnrichment'];
});

describe('toProvenanceEventEnrichment', () => {
  it('returns a basic enrichment', () => {
    const enrichment = toProvenanceEventEnrichment(basicEnrichmentResource);

    expect(enrichment).toStrictEqual({
      id: 'https://example.org/basicEnrichment',
      type: ProvenanceEventType.TransferOfCustody,
      about: 'https://example.com/object',
      pubInfo: {
        creator: {
          id: 'https://example.org/myPerson',
          name: 'Person',
          isPartOf: {
            id: 'https://example.org/myGroup',
            name: 'Group',
          },
        },
        license: 'https://example.com/license',
        dateCreated: new Date('2023-01-01T00:00:00.000Z'),
      },
    });
  });

  it('returns a full enrichment', () => {
    const enrichment = toProvenanceEventEnrichment(fullEnrichmentResource);

    expect(enrichment).toStrictEqual({
      id: 'https://example.org/fullEnrichment',
      type: ProvenanceEventType.Acquisition,
      about: 'https://example.com/object',
      pubInfo: {
        creator: {
          id: 'https://example.org/myPerson',
          name: 'Person',
          isPartOf: {
            id: 'https://example.org/myGroup',
            name: 'Group',
          },
        },
        license: 'https://example.com/license',
        dateCreated: new Date('2023-01-01T00:00:00.000Z'),
      },
      additionalTypes: [
        {
          id: 'https://example.org/myAdditionalType',
          name: 'Term',
        },
      ],
      citation: 'Citation',
      description: 'Description',
      inLanguage: 'en',
      date: {
        id: 'https://example.org/myTimeSpan',
        startDate: new Date('1889-01-01T00:00:00.000Z'),
        endDate: new Date('1900-12-31T23:59:59.999Z'),
      },
      transferredFrom: {
        id: 'https://example.org/myTransferredFrom',
        name: 'Transferred From',
      },
      transferredTo: {
        id: 'https://example.org/myTransferredTo',
        name: 'Transferred To',
      },
      location: {
        id: 'https://example.org/myLocation',
        name: 'Location',
      },
    });
  });
});
