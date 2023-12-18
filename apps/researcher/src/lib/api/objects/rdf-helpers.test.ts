import {
  createAgents,
  createDatasets,
  createImages,
  createPlaces,
  createThings,
  createTimeSpans,
} from './rdf-helpers';
import {describe, expect, it} from '@jest/globals';
import {RdfObjectLoader, Resource} from 'rdf-object';
import streamifyString from 'streamify-string';
import {StreamParser} from 'n3';

const loader = new RdfObjectLoader({
  context: {
    ex: 'https://example.org/',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  },
});
let resource: Resource;

beforeAll(async () => {
  const triples = `
    @prefix ex: <https://example.org/> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

    ex:object1 a ex:Object ;
      ex:name "Name" ;
      ex:subject ex:subject1, ex:subject2 ;
      ex:creator ex:creator1, ex:creator2, ex:creator3, ex:creator4 ;
      ex:image ex:image1, ex:image2, ex:image3 ;
      ex:dateCreated ex:dateCreated1, ex:dateCreated2, ex:dateCreated3 ;
      ex:locationCreated ex:location1, ex:location2 ;
      ex:isPartOf ex:dataset1, ex:dataset2, ex:dataset3 .

    ex:subject1 a ex:Term ;
      ex:name "Term" .

    ex:subject2 a ex:Term .

    ex:creator1 a ex:Person ;
      ex:name "Person" .

    ex:creator2 a ex:Organization ;
      ex:name "Organization" .

    ex:creator3 a ex:Organization .

    ex:creator4 ex:name "Organization" .

    ex:image1 a ex:Image ;
      ex:contentUrl <https://example.org/image1.jpg> ;
      ex:license ex:license1 .

    ex:license1 a ex:DigitalDocument ;
      ex:name "License" .

    ex:image2 a ex:Image ;
      ex:contentUrl <https://example.org/image2.jpg> .

    ex:image3 a ex:Image .

    ex:dateCreated1 a ex:TimeSpan ;
      ex:startDate "1889"^^xsd:gYear ;
      ex:endDate "1900"^^xsd:gYear .

    # No end date
    ex:dateCreated2 a ex:TimeSpan ;
      ex:startDate "1889"^^xsd:gYear .

    # No start date
    ex:dateCreated3 a ex:TimeSpan ;
      ex:endDate "1900"^^xsd:gYear .

    ex:location1 a ex:Place ;
      ex:name "City 1" .

    ex:location2 a ex:Place ;
      ex:name "City 2" ;
      ex:isPartOf ex:location3 .

    ex:location3 a ex:Place ;
      ex:name "Country" .

    ex:dataset1 a ex:Dataset ;
      ex:name "Dataset 1" ;
      ex:publisher ex:publisher1 .

    ex:publisher1 a ex:Organization ;
      ex:name "Publishing organization" .

    ex:dataset2 a ex:Dataset ;
      ex:name "Dataset 2" ;
      ex:publisher ex:publisher2 .

    ex:publisher2 a ex:Person ;
      ex:name "Publishing person" .

    # No publisher
    ex:dataset3 a ex:Dataset ;
      ex:name "Dataset 3" .
  `;

  const stringStream = streamifyString(triples);
  const streamParser = new StreamParser();
  stringStream.pipe(streamParser);
  await loader.import(streamParser);
  resource = loader.resources['https://example.org/object1'];
});

describe('createThings', () => {
  it('returns undefined if properties do not exist', () => {
    const things = createThings(resource, 'ex:unknown');

    expect(things).toBeUndefined();
  });

  it('returns things if properties exist', () => {
    const things = createThings(resource, 'ex:subject');

    expect(things).toStrictEqual([
      {id: 'https://example.org/subject1', name: 'Term'},
      {id: 'https://example.org/subject2', name: undefined},
    ]);
  });
});

describe('createAgents', () => {
  it('returns undefined if properties do not exist', () => {
    const agents = createAgents(resource, 'ex:unknown');

    expect(agents).toBeUndefined();
  });

  it('returns agents if properties exist', () => {
    const agents = createAgents(resource, 'ex:creator');

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

describe('createPlaces', () => {
  it('returns undefined if properties do not exist', () => {
    const places = createPlaces(resource, 'ex:unknown');

    expect(places).toBeUndefined();
  });

  it('returns places if properties exist', () => {
    const places = createPlaces(resource, 'ex:locationCreated');

    expect(places).toStrictEqual([
      {
        id: 'https://example.org/location1',
        name: 'City 1',
      },
      {
        id: 'https://example.org/location2',
        name: 'City 2',
        isPartOf: {
          id: 'https://example.org/location3',
          name: 'Country',
        },
      },
    ]);
  });
});

describe('createImages', () => {
  it('returns undefined if properties do not exist', () => {
    const images = createImages(resource, 'ex:unknown');

    expect(images).toBeUndefined();
  });

  it('returns images if properties exist', () => {
    const images = createImages(resource, 'ex:image');

    expect(images).toStrictEqual([
      {
        id: 'https://example.org/image1',
        contentUrl: 'https://example.org/image1.jpg',
        license: {
          id: 'https://example.org/license1',
          name: 'License',
        },
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
    const timeSpans = createTimeSpans(resource, 'ex:unknown');

    expect(timeSpans).toBeUndefined();
  });

  it('returns time spans if properties exist', () => {
    const timeSpans = createTimeSpans(resource, 'ex:dateCreated');

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
    const datasets = createDatasets(resource, 'ex:unknown');

    expect(datasets).toBeUndefined();
  });

  it('returns datasets if properties exist', () => {
    const datasets = createDatasets(resource, 'ex:isPartOf');

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
