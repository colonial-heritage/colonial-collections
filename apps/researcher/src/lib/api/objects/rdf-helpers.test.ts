import {ontologyUrl} from '../definitions';
import {
  createAgentsFromProperties,
  createImagesFromProperties,
  createThingsFromProperties,
  createTimeSpansFromProperties,
} from './rdf-helpers';
import {describe, expect, it} from '@jest/globals';
import {RdfObjectLoader, Resource} from 'rdf-object';
import streamifyString from 'streamify-string';
import {StreamParser} from 'n3';

const loader = new RdfObjectLoader({
  context: {
    cc: ontologyUrl,
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  },
});
let resource: Resource;

beforeAll(async () => {
  const triples = `
    @prefix cc: <${ontologyUrl}> .
    @prefix ex: <https://example.org/> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

    ex:object1 a cc:Object ;
      cc:name "Name" ;
      cc:subject ex:subject1, ex:subject2 ;
      cc:creator ex:creator1, ex:creator2, ex:creator3, ex:creator4 ;
      cc:image ex:image1, ex:image2, ex:image3 ;
      cc:dateCreated ex:dateCreated1, ex:dateCreated2, ex:dateCreated3 .

    ex:subject1 a cc:Term ;
      cc:name "Term 1" .

    ex:subject2 a cc:Term .

    ex:creator1 a cc:Person ;
      cc:name "Person 1" .

    ex:creator2 a cc:Organization ;
      cc:name "Organization 2" .

    ex:creator3 a cc:Organization .

    ex:creator4 cc:name "Organization 4" .

    ex:image1 a cc:Image ;
      cc:contentUrl <https://example.org/image1.jpg> .

    ex:image2 a cc:Image ;
      cc:contentUrl <https://example.org/image2.jpg> .

    ex:image3 a cc:Image .

    ex:dateCreated1 a cc:TimeSpan ;
      cc:startDate "1889"^^xsd:gYear ;
      cc:endDate "1900"^^xsd:gYear .

    # No end date
    ex:dateCreated2 a cc:TimeSpan ;
      cc:startDate "1889"^^xsd:gYear .

    # No start date
    ex:dateCreated3 a cc:TimeSpan ;
      cc:endDate "1900"^^xsd:gYear .
  `;

  const stringStream = streamifyString(triples);
  const streamParser = new StreamParser();
  stringStream.pipe(streamParser);
  await loader.import(streamParser);
  resource = loader.resources['https://example.org/object1'];
});

describe('createThingsFromProperties', () => {
  it('returns undefined if properties do not exist', async () => {
    const things = createThingsFromProperties(resource, 'cc:unknown');

    expect(things).toBeUndefined();
  });

  it('returns things if properties exist', async () => {
    const things = createThingsFromProperties(resource, 'cc:subject');

    expect(things).toStrictEqual([
      {id: 'https://example.org/subject1', name: 'Term 1'},
      {id: 'https://example.org/subject2', name: undefined},
    ]);
  });
});

describe('createAgentsFromProperties', () => {
  it('returns undefined if properties do not exist', async () => {
    const agents = createAgentsFromProperties(resource, 'cc:unknown');

    expect(agents).toBeUndefined();
  });

  it('returns agents if properties exist', async () => {
    const agents = createAgentsFromProperties(resource, 'cc:creator');

    expect(agents).toStrictEqual([
      {type: 'Person', id: 'https://example.org/creator1', name: 'Person 1'},
      {
        type: 'Organization',
        id: 'https://example.org/creator2',
        name: 'Organization 2',
      },
      {
        type: 'Organization',
        id: 'https://example.org/creator3',
        name: undefined,
      },
      {
        type: 'Unknown',
        id: 'https://example.org/creator4',
        name: 'Organization 4',
      },
    ]);
  });
});

describe('createImagesFromProperties', () => {
  it('returns undefined if properties do not exist', async () => {
    const images = createImagesFromProperties(resource, 'cc:unknown');

    expect(images).toBeUndefined();
  });

  it('returns images if properties exist', async () => {
    const images = createImagesFromProperties(resource, 'cc:image');

    expect(images).toStrictEqual([
      {
        id: 'https://example.org/image1',
        contentUrl: 'https://example.org/image1.jpg',
      },
      {
        id: 'https://example.org/image2',
        contentUrl: 'https://example.org/image2.jpg',
      },
      {id: 'https://example.org/image3', contentUrl: undefined},
    ]);
  });
});

describe('createTimeSpanFromProperties', () => {
  it('returns undefined if properties do not exist', async () => {
    const timeSpans = createTimeSpansFromProperties(resource, 'cc:unknown');

    expect(timeSpans).toBeUndefined();
  });

  it('returns time spans if properties exist', async () => {
    const timeSpans = createTimeSpansFromProperties(resource, 'cc:dateCreated');

    expect(timeSpans).toStrictEqual([
      {
        id: 'https://example.org/dateCreated1',
        startDate: new Date('1889-01-01'),
        endDate: new Date('1900-01-01'),
      },
      {
        id: 'https://example.org/dateCreated2',
        startDate: new Date('1889-01-01'),
        endDate: undefined,
      },
      {
        id: 'https://example.org/dateCreated3',
        startDate: undefined,
        endDate: new Date('1900-01-01'),
      },
    ]);
  });
});
