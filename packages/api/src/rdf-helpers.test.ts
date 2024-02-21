import {
  createAgents,
  createDatasets,
  createDates,
  createMeasurements,
  createPlaces,
  createThings,
  createTimeSpans,
  getProperty,
  getPropertyValue,
  getPropertyValues,
  onlyOne,
  removeNullish,
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

let datasetResource: Resource;
let objectResource: Resource;

beforeAll(async () => {
  const triples = `
    @prefix ex: <https://example.org/> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

    ex:object1 a ex:Object ;
      ex:name "Name" ;
      ex:description "Description 1", "Description 2" ;
      ex:subject ex:subject1, ex:subject2 ;
      ex:creator ex:creator1, ex:creator2, ex:creator3, ex:creator4 ;
      ex:dateCreated ex:dateCreated1, ex:dateCreated2, ex:dateCreated3, ex:dateCreated4 ;
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

    ex:dateCreated1 a ex:TimeSpan ;
      ex:startDate "-1900"^^xsd:gYear ;
      ex:endDate "-1889"^^xsd:gYear .

    # No end date
    ex:dateCreated2 a ex:TimeSpan ;
      ex:startDate "1889"^^xsd:gYear .

    # No start date
    ex:dateCreated3 a ex:TimeSpan ;
      ex:endDate "1900"^^xsd:gYear .

    # Invalid date
    ex:dateCreated4 a ex:TimeSpan ;
      ex:startDate "badValue" .

    ex:location1 a ex:Place ;
      ex:name "City 1" .

    ex:location2 a ex:Place ;
      ex:name "City 2" ;
      ex:isPartOf ex:location3 .

    ex:location3 a ex:Place ;
      ex:name "Country" .

    ex:dataset1 a ex:Dataset ;
      ex:name "Dataset 1" ;
      ex:publisher ex:publisher1 ;
      ex:dateCreated "2023-01-01"^^xsd:date ;
      ex:measurements ex:measurement1 .

    ex:publisher1 a ex:Organization ;
      ex:name "Publishing organization" .

    ex:measurement1 a ex:Measurement ;
      ex:value "true"^^xsd:boolean ;
      ex:measurementOf ex:metric1 .

    ex:metric1 a ex:Metric ;
      ex:name "Metric 1" ;
      ex:order 1 .

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

  datasetResource = loader.resources['https://example.org/dataset1'];
  objectResource = loader.resources['https://example.org/object1'];
});

describe('getProperty', () => {
  it('returns undefined if property does not exist', () => {
    const property = getProperty(objectResource, 'ex:unknown');

    expect(property).toBeUndefined();
  });

  it('returns property if it exists', () => {
    const property = getProperty(objectResource, 'ex:name');

    expect(property).toBeInstanceOf(Resource);
  });
});

describe('getPropertyValue', () => {
  it('returns undefined if property does not exist', () => {
    const value = getPropertyValue(objectResource, 'ex:unknown');

    expect(value).toBeUndefined();
  });

  it('returns value if property exists', () => {
    const value = getPropertyValue(objectResource, 'ex:name');

    expect(value).toStrictEqual('Name');
  });
});

describe('getPropertyValues', () => {
  it('returns undefined if properties do not exist', () => {
    const values = getPropertyValues(objectResource, 'ex:unknown');

    expect(values).toBeUndefined();
  });

  it('returns values if properties exist', () => {
    const values = getPropertyValues(objectResource, 'ex:description');

    expect(values).toStrictEqual(['Description 1', 'Description 2']);
  });
});

describe('onlyOne', () => {
  it('returns undefined if input is not an array', () => {
    const item = onlyOne(undefined);

    expect(item).toBeUndefined();
  });

  it('returns undefined if input array is empty', () => {
    const item = onlyOne([]);

    expect(item).toBeUndefined();
  });

  it('returns the first item from the input array', () => {
    const item = onlyOne([1, 2]);

    expect(item).toStrictEqual(1);
  });
});

describe('removeNullish', () => {
  it('returns empty object if input is not an object', () => {
    // @ts-expect-error:TS2345
    const object = removeNullish(undefined);

    expect(object).toStrictEqual({});
  });

  it('returns object without nullish values', () => {
    const object = removeNullish({
      1: 2,
      3: undefined,
    });

    expect(object).toStrictEqual({1: 2});
  });

  // TBD: will this pose a problem?
  it('returns object with nullish values in nested objects', () => {
    const object = removeNullish({
      4: {
        5: 6,
        7: undefined,
      },
    });

    expect(object).toStrictEqual({4: {5: 6, 7: undefined}});
  });
});

describe('createThings', () => {
  it('returns undefined if properties do not exist', () => {
    const things = createThings(objectResource, 'ex:unknown');

    expect(things).toBeUndefined();
  });

  it('returns things if properties exist', () => {
    const things = createThings(objectResource, 'ex:subject');

    expect(things).toStrictEqual([
      {id: 'https://example.org/subject1', name: 'Term'},
      {id: 'https://example.org/subject2', name: undefined},
    ]);
  });
});

describe('createPlaces', () => {
  it('returns undefined if properties do not exist', () => {
    const places = createPlaces(objectResource, 'ex:unknown');

    expect(places).toBeUndefined();
  });

  it('returns places if properties exist', () => {
    const places = createPlaces(objectResource, 'ex:locationCreated');

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

describe('createTimeSpan', () => {
  it('returns undefined if properties do not exist', () => {
    const timeSpans = createTimeSpans(objectResource, 'ex:unknown');

    expect(timeSpans).toBeUndefined();
  });

  it('returns time spans if properties exist', () => {
    const timeSpans = createTimeSpans(objectResource, 'ex:dateCreated');

    expect(timeSpans).toStrictEqual([
      {
        id: 'https://example.org/dateCreated1',
        startDate: new Date('-001900-01-01T00:00:00.000Z'),
        endDate: new Date('-001889-12-31T23:59:59.999Z'),
      },
      {
        id: 'https://example.org/dateCreated2',
        startDate: new Date('1889-01-01T00:00:00.000Z'),
        endDate: undefined,
      },
      {
        id: 'https://example.org/dateCreated3',
        startDate: undefined,
        endDate: new Date('1900-12-31T23:59:59.999Z'),
      },
      {
        id: 'https://example.org/dateCreated4',
        startDate: undefined,
        endDate: undefined,
      },
    ]);
  });
});

describe('createAgents', () => {
  it('returns undefined if properties do not exist', () => {
    const agents = createAgents(objectResource, 'ex:unknown');

    expect(agents).toBeUndefined();
  });

  it('returns agents if properties exist', () => {
    const agents = createAgents(objectResource, 'ex:creator');

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

describe('createDataset', () => {
  it('returns undefined if properties do not exist', () => {
    const datasets = createDatasets(objectResource, 'ex:unknown');

    expect(datasets).toBeUndefined();
  });

  it('returns datasets if properties exist', () => {
    const datasets = createDatasets(objectResource, 'ex:isPartOf');

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

describe('createDates', () => {
  it('returns undefined if properties do not exist', () => {
    const things = createDates(datasetResource, 'ex:unknown');

    expect(things).toBeUndefined();
  });

  it('returns dates if properties exist', () => {
    const dates = createDates(datasetResource, 'ex:dateCreated');

    expect(dates).toStrictEqual([new Date('2023-01-01')]);
  });
});

describe('createMeasurements', () => {
  it('returns undefined if properties do not exist', () => {
    const measurements = createMeasurements(datasetResource, 'ex:unknown');

    expect(measurements).toBeUndefined();
  });

  it('returns measurements if properties exist', () => {
    const measurements = createMeasurements(datasetResource, 'ex:measurements');

    expect(measurements).toStrictEqual([
      {
        id: 'https://example.org/measurement1',
        value: true,
        metric: {id: 'https://example.org/metric1', name: 'Metric 1', order: 1},
      },
    ]);
  });
});
