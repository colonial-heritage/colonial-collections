import {describe, expect, it} from '@jest/globals';
import {StreamParser} from 'n3';
import {RdfObjectLoader, Resource} from 'rdf-object';
import streamifyString from 'streamify-string';
import {
  createCitations,
  createEvents,
  createResearchGuide,
} from './rdf-helpers';

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
      ex:alternateName "Alternate name 2", "Alternate name 3" ;
      ex:abstract "Abstract 2" ;
      ex:text "Text" ;
      ex:encodingFormat "text/html" ;
      ex:contentReferenceTime [
        a ex:Event ;
        ex:startDate "1924" ;
        ex:endDate "1996" ;
      ] ;
      ex:contentLocation [
        ex:name "Content Location" ;
        ex:sameAs <https://example.org/place> ;
      ] ;
      ex:keyword [
        ex:name "Keyword" ;
        ex:sameAs <https://example.org/keyword> ;
      ] ;
      ex:citation [
        ex:additionalType "Type of primary source:Publicatie" ;
        ex:inLanguage "en" ;
        ex:name "Citation 1" ;
        ex:description "Citation Description 1" ;
        ex:url <https://example.org/citation1> ;
      ], [
        ex:additionalType "Type of secondary source:Publicatie" ;
        ex:inLanguage "en", "nl" ;
        ex:name "Citation 2" ;
        ex:description "Citation Description 2" ;
        ex:url <https://example.org/citation2> ;
      ], [
        # Intentionally missing 'ex:additionalType' and 'ex:inLanguage'
        ex:name "Citation 3" ;
        ex:description "Citation Description 3" ;
        ex:url <https://example.org/citation3> ;
      ] ;
      ex:hasPart [
        a ex:ListItem ;
        ex:position 1 ;
        ex:item ex:researchGuide3
      ], [
        a ex:ListItem ;
        # Intentionally not set
        #ex:position 2 ;
        ex:item ex:researchGuide6
      ] ;
      ex:seeAlso [
        a ex:ListItem ;
        ex:position 1 ;
        ex:item ex:researchGuide3
      ], [
        a ex:ListItem ;
        # Intentionally not set
        #ex:position 2 ;
        ex:item ex:researchGuide6
      ] .

    ex:researchGuide3 a ex:CreativeWork ;
      ex:name "Name 3" ;
      ex:hasPart [
        a ex:ListItem ;
        ex:position 1 ;
        ex:item ex:researchGuide5
      ] ;
      ex:seeAlso [
        a ex:ListItem ;
        ex:position 1 ;
        ex:item ex:researchGuide5
      ] .

    ex:researchGuide5 a ex:CreativeWork ;
      ex:name "Name 5" ;
      ex:abstract "Abstract 5" ;
      ex:hasPart [
        a ex:ListItem ;
        ex:position 1 ;
        # Intentionally not set
        #ex:item ex:researchGuide6
      ] ;
      ex:seeAlso [
        a ex:ListItem ;
        ex:position 1 ;
        ex:item ex:researchGuide6
      ] .

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

describe('contentReferenceTimes', () => {
  let resource: Resource;

  beforeEach(() => {
    resource = loader.resources['https://example.org/researchGuide2'];
  });

  it('returns undefined if property does not exist', () => {
    const citations = createCitations(resource, 'ex:unknown');

    expect(citations).toBeUndefined();
  });

  it('returns events if property exists', () => {
    const events = createEvents(resource, 'ex:contentReferenceTime');

    expect(events).toStrictEqual([
      {
        id: expect.any(String),
        date: {
          id: expect.any(String),
          startDate: new Date('1924-01-01T00:00:00.000Z'),
          endDate: new Date('1996-12-31T23:59:59.999Z'),
        },
      },
    ]);
  });
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
        id: expect.any(String),
        type: 'primary',
        inLanguage: ['en'],
        name: 'Citation 1',
        description: 'Citation Description 1',
        url: 'https://example.org/citation1',
      },
      {
        id: expect.any(String),
        type: 'secondary',
        inLanguage: ['en', 'nl'],
        name: 'Citation 2',
        description: 'Citation Description 2',
        url: 'https://example.org/citation2',
      },
      {
        id: expect.any(String),
        type: 'primary',
        inLanguage: [],
        name: 'Citation 3',
        description: 'Citation Description 3',
        url: 'https://example.org/citation3',
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
      alternateNames: ['Alternate name 2', 'Alternate name 3'],
      abstract: 'Abstract 2',
      text: 'Text',
      encodingFormat: 'text/html',
      contentReferenceTimes: [
        {
          id: expect.any(String),
          date: {
            id: expect.any(String),
            startDate: new Date('1924-01-01T00:00:00.000Z'),
            endDate: new Date('1996-12-31T23:59:59.999Z'),
          },
        },
      ],
      contentLocations: [
        {
          id: expect.any(String),
          name: 'Content Location',
          sameAs: 'https://example.org/place',
        },
      ],
      keywords: [
        {
          id: expect.any(String),
          name: 'Keyword',
          sameAs: 'https://example.org/keyword',
        },
      ],
      citations: [
        {
          id: expect.any(String),
          type: 'primary',
          inLanguage: ['en'],
          name: 'Citation 1',
          description: 'Citation Description 1',
          url: 'https://example.org/citation1',
        },
        {
          id: expect.any(String),
          type: 'secondary',
          inLanguage: ['en', 'nl'],
          name: 'Citation 2',
          description: 'Citation Description 2',
          url: 'https://example.org/citation2',
        },
        {
          id: expect.any(String),
          type: 'primary',
          inLanguage: [],
          name: 'Citation 3',
          description: 'Citation Description 3',
          url: 'https://example.org/citation3',
        },
      ],
      hasParts: [
        {
          id: 'https://example.org/researchGuide3',
          name: 'Name 3',
          hasParts: [
            {
              id: 'https://example.org/researchGuide5',
              name: 'Name 5',
              abstract: 'Abstract 5',
              seeAlso: [
                {
                  id: 'https://example.org/researchGuide6',
                  name: 'Name 6',
                  abstract: 'Abstract 6',
                  position: 1,
                },
              ],
              position: 1,
            },
          ],
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
                  position: 1,
                },
              ],
              position: 1,
            },
          ],
          position: 1,
        },
        {
          id: 'https://example.org/researchGuide6',
          name: 'Name 6',
          abstract: 'Abstract 6',
        },
      ],
      seeAlso: [
        {
          id: 'https://example.org/researchGuide3',
          name: 'Name 3',
          hasParts: [
            {
              id: 'https://example.org/researchGuide5',
              name: 'Name 5',
              abstract: 'Abstract 5',
              seeAlso: [
                {
                  id: 'https://example.org/researchGuide6',
                  name: 'Name 6',
                  abstract: 'Abstract 6',
                  position: 1,
                },
              ],
              position: 1,
            },
          ],
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
                  position: 1,
                },
              ],
              position: 1,
            },
          ],
          position: 1,
        },
        {
          id: 'https://example.org/researchGuide6',
          name: 'Name 6',
          abstract: 'Abstract 6',
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
