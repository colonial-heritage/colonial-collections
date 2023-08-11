import {ontologyUrl} from '../definitions';
import {
  createAgents,
  createDatasets,
  createImages,
  createThings,
  createTimeSpans,
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
      cc:dateCreated ex:dateCreated1, ex:dateCreated2, ex:dateCreated3 ;
      cc:isPartOf ex:dataset1, ex:dataset2, ex:dataset3 .

    ex:subject1 a cc:Term ;
      cc:name "Term" .

    ex:subject2 a cc:Term .

    ex:creator1 a cc:Person ;
      cc:name "Person" .

    ex:creator2 a cc:Organization ;
      cc:name "Organization" .

    ex:creator3 a cc:Organization .

    ex:creator4 cc:name "Organization" .

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

    ex:dataset1 a cc:Dataset ;
      cc:name "Dataset 1" ;
      cc:publisher ex:publisher1 .

    ex:publisher1 a cc:Organization ;
      cc:name "Publishing organization" .

    ex:dataset2 a cc:Dataset ;
      cc:name "Dataset 2" ;
      cc:publisher ex:publisher2 .

    ex:publisher2 a cc:Person ;
      cc:name "Publishing person" .

    # No publisher
    ex:dataset3 a cc:Dataset ;
      cc:name "Dataset 3" .
  `;

  const stringStream = streamifyString(triples);
  const streamParser = new StreamParser();
  stringStream.pipe(streamParser);
  await loader.import(streamParser);
  resource = loader.resources['https://example.org/object1'];
});

describe('createThings', () => {
  it('returns undefined if properties do not exist', () => {
    const things = createThings(resource, 'cc:unknown');

    expect(things).toBeUndefined();
  });

  it('returns things if properties exist', () => {
    const things = createThings(resource, 'cc:subject');

    expect(things).toStrictEqual([
      {id: 'https://example.org/subject1', name: 'Term'},
      {id: 'https://example.org/subject2', name: undefined},
    ]);
  });
});

describe('createAgents', () => {
  it('returns undefined if properties do not exist', () => {
    const agents = createAgents(resource, 'cc:unknown');

    expect(agents).toBeUndefined();
  });

  it('returns agents if properties exist', () => {
    const agents = createAgents(resource, 'cc:creator');

    expect(agents).toStrictEqual([
      {type: 'Person', id: 'https://example.org/creator1', name: 'Person'},
      {
        type: 'Organization',
        id: 'https://example.org/creator2',
        name: 'Organization',
      },
      {
        type: 'Organization',
        id: 'https://example.org/creator3',
        name: undefined,
      },
      {
        type: 'Unknown',
        id: 'https://example.org/creator4',
        name: 'Organization',
      },
    ]);
  });
});

describe('createImages', () => {
  it('returns undefined if properties do not exist', () => {
    const images = createImages(resource, 'cc:unknown');

    expect(images).toBeUndefined();
  });

  it('returns images if properties exist', () => {
    const images = createImages(resource, 'cc:image');

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

describe('createTimeSpan', () => {
  it('returns undefined if properties do not exist', () => {
    const timeSpans = createTimeSpans(resource, 'cc:unknown');

    expect(timeSpans).toBeUndefined();
  });

  it('returns time spans if properties exist', () => {
    const timeSpans = createTimeSpans(resource, 'cc:dateCreated');

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

describe('createDataset', () => {
  it('returns undefined if properties do not exist', () => {
    const datasets = createDatasets(resource, 'cc:unknown');

    expect(datasets).toBeUndefined();
  });

  it('returns datasets if properties exist', () => {
    const datasets = createDatasets(resource, 'cc:isPartOf');

    expect(datasets).toStrictEqual([
      {
        id: 'https://example.org/dataset1',
        name: 'Dataset 1',
        publisher: {
          type: 'Organization',
          id: 'https://example.org/publisher1',
          name: 'Publishing organization',
        },
      },
      {
        id: 'https://example.org/dataset2',
        name: 'Dataset 2',
        publisher: {
          type: 'Person',
          id: 'https://example.org/publisher2',
          name: 'Publishing person',
        },
      },
      {
        id: 'https://example.org/dataset3',
        name: 'Dataset 3',
        publisher: undefined,
      },
    ]);
  });
});
