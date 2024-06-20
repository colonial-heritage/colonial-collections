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
      ex:identifier "1" ;
      ex:name "Name 2" ;
      ex:abstract "Abstract 2" ;
      ex:text "Text" ;
      ex:encodingFormat "text/html" ;
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
      ] ;
      ex:seeAlso ex:researchGuide3 .

    ex:researchGuide3 a ex:CreativeWork ;
      ex:name "Name 3" ;
      ex:seeAlso ex:researchGuide5 .

    ex:researchGuide5 a ex:CreativeWork ;
      ex:name "Name 5" ;
      ex:abstract "Abstract 5" ;
      ex:seeAlso ex:researchGuide6 .

    ex:researchGuide6 a ex:CreativeWork ;
      ex:name "Name 6" ;
      ex:abstract "Abstract 6" .

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
      identifier: '1',
      name: 'Name 2',
      abstract: 'Abstract 2',
      text: 'Text',
      encodingFormat: 'text/html',
      seeAlso: [
        {
          id: 'https://example.org/researchGuide3',
          name: 'Name 3',
          seeAlso: [
            {
              id: 'https://example.org/researchGuide5',
              name: 'Name 5',
              abstract: 'Abstract 5',
              seeAlso: [
                {
                  id: 'https://example.org/researchGuide6',
                  name: 'Name 6',
                  abstract: 'Abstract 6',
                },
              ],
            },
          ],
        },
      ],
      contentLocations: [
        {
          id: 'n3-0',
          name: 'Content Location',
          sameAs: 'https://example.org/place',
        },
      ],
      keywords: [
        {
          id: 'n3-1',
          name: 'Keyword',
          sameAs: 'https://example.org/keyword',
        },
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
