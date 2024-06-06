import {describe, expect, it} from '@jest/globals';
import {StreamParser} from 'n3';
import {RdfObjectLoader, Resource} from 'rdf-object';
import streamifyString from 'streamify-string';
import {createCitations, createResearchGuide} from './rdf-helpers';

const loader = new RdfObjectLoader({
  context: {
    ex: 'https://example.org/',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  },
});

beforeAll(async () => {
  const triples = `
    @prefix ex: <https://example.org/> .

    ex:researchGuide1 a ex:CreativeWork ;
      ex:name "Name 1" .

    ex:researchGuide2 a ex:CreativeWork ;
      ex:name "Name 2" ;
      ex:abstract "Abstract" ;
      ex:text "Text" ;
      ex:encodingFormat "text/html" ;
      ex:hasPart ex:researchGuide3 ;
      ex:isPartOf ex:researchGuide1 ;
      ex:contentLocation [
        ex:name "Content Location" ;
        ex:sameAs <https://example.org/place> ;
      ] ;
      ex:keyword [
        ex:name "Keyword" ;
        ex:sameAs <https://example.org/keyword> ;
      ] ;
      ex:citation [
        ex:name "Citation" ;
        ex:description "Citation Description" ;
        ex:url <https://example.org/citation> ;
      ] .

    ex:researchGuide3 a ex:CreativeWork ;
      ex:name "Name 3" .

    ex:researchGuide4 a ex:CreativeWork ;
      ex:name "Name A", "Name B" ;
      ex:abstract "Abstract A", "Abstract B" ;
      ex:text "Text A", "Text B" ;
      ex:encodingFormat "text/html", "text/plain" .
  `;

  const stringStream = streamifyString(triples);
  const streamParser = new StreamParser();
  stringStream.pipe(streamParser);
  await loader.import(streamParser);
});

describe('createCitations', () => {
  let resource: Resource;

  beforeEach(() => {
    resource = loader.resources['https://example.org/researchGuide2'];
  });

  it('returns undefined if property does not exist', () => {
    const citations = createCitations(resource, 'ex:unknown');

    expect(citations).toBeUndefined();
  });

  it('returns citations if property exists', () => {
    const citations = createCitations(resource, 'ex:citation');

    expect(citations).toStrictEqual([
      {
        id: 'n3-2',
        name: 'Citation',
        description: 'Citation Description',
        url: 'https://example.org/citation',
      },
    ]);
  });
});

describe('createResearchGuide', () => {
  it('returns a research guide with minimal properties', () => {
    const resource = loader.resources['https://example.org/researchGuide1'];
    const researchGuide = createResearchGuide(resource);

    expect(researchGuide).toStrictEqual({
      id: 'https://example.org/researchGuide1',
      name: 'Name 1',
    });
  });

  it('returns a research guide with all properties', () => {
    const resource = loader.resources['https://example.org/researchGuide2'];
    const researchGuide = createResearchGuide(resource);

    expect(researchGuide).toStrictEqual({
      id: 'https://example.org/researchGuide2',
      name: 'Name 2',
      abstract: 'Abstract',
      text: 'Text',
      encodingFormat: 'text/html',
      hasParts: [{id: 'https://example.org/researchGuide3', name: 'Name 3'}],
      isPartOf: [{id: 'https://example.org/researchGuide1', name: 'Name 1'}],
      contentLocations: [
        {
          id: 'n3-0',
          name: 'Content Location',
          sameAs: 'https://example.org/place',
        },
      ],
      keywords: [
        {id: 'n3-1', name: 'Keyword', sameAs: 'https://example.org/keyword'},
      ],
      citations: [
        {
          id: 'n3-2',
          name: 'Citation',
          description: 'Citation Description',
          url: 'https://example.org/citation',
        },
      ],
    });
  });

  it('returns a research guide with just one value if it has multiple values in the source', () => {
    const resource = loader.resources['https://example.org/researchGuide4'];
    const researchGuide = createResearchGuide(resource);

    expect(researchGuide).toStrictEqual({
      id: 'https://example.org/researchGuide4',
      name: 'Name A',
      abstract: 'Abstract A',
      text: 'Text A',
      encodingFormat: 'text/html',
    });
  });
});
