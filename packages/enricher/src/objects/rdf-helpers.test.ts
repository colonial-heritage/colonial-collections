import {ontologyUrl} from '../definitions';
import {HeritageObjectEnrichmentType} from './definitions';
import {toHeritageObjectEnrichment} from './rdf-helpers';
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

    ex:basicEnrichment a ex:HeritageObjectEnrichment ;
      ex:additionalType <${ontologyUrl}material> ;
      ex:about <https://example.com/object> ;
      ex:creator ex:myPerson ;
      ex:license <https://example.com/license> ;
      ex:dateCreated "2023-01-01"^^xsd:date .

    ex:fullEnrichment a ex:HeritageObjectEnrichment ;
      ex:additionalType <${ontologyUrl}material> ;
      ex:about <https://example.com/object> ;
      ex:creator ex:myPerson ;
      ex:license <https://example.com/license> ;
      ex:dateCreated "2023-01-01"^^xsd:date ;
      ex:citation "Citation" ;
      ex:description "Description" ;
      ex:inLanguage "en" .

    ex:myPerson a ex:Actor ;
      ex:name "Person" ;
      ex:isPartOf ex:myGroup .

    ex:myGroup a ex:Actor ;
      ex:name "Group" .
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

describe('toHeritageObjectEnrichment', () => {
  it('returns a basic enrichment', () => {
    const enrichment = toHeritageObjectEnrichment(basicEnrichmentResource);

    expect(enrichment).toStrictEqual({
      id: 'https://example.org/basicEnrichment',
      type: HeritageObjectEnrichmentType.Material,
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
    const enrichment = toHeritageObjectEnrichment(fullEnrichmentResource);

    expect(enrichment).toStrictEqual({
      id: 'https://example.org/fullEnrichment',
      type: HeritageObjectEnrichmentType.Material,
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
      citation: 'Citation',
      description: 'Description',
      inLanguage: 'en',
    });
  });
});
