import {createDates, createMeasurements, createThings} from './rdf-helpers';
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
  `;

  const stringStream = streamifyString(triples);
  const streamParser = new StreamParser();
  stringStream.pipe(streamParser);
  await loader.import(streamParser);
  resource = loader.resources['https://example.org/dataset1'];
});

describe('createThings', () => {
  it('returns undefined if properties do not exist', () => {
    const things = createThings(resource, 'ex:unknown');

    expect(things).toBeUndefined();
  });

  it('returns things if properties exist', () => {
    const things = createThings(resource, 'ex:publisher');

    expect(things).toStrictEqual([
      {id: 'https://example.org/publisher1', name: 'Publishing organization'},
    ]);
  });
});

describe('createDates', () => {
  it('returns undefined if properties do not exist', () => {
    const things = createDates(resource, 'ex:unknown');

    expect(things).toBeUndefined();
  });

  it('returns dates if properties exist', () => {
    const dates = createDates(resource, 'ex:dateCreated');

    expect(dates).toStrictEqual([new Date('2023-01-01')]);
  });
});

describe('createMeasurements', () => {
  it('returns undefined if properties do not exist', () => {
    const measurements = createMeasurements(resource, 'ex:unknown');

    expect(measurements).toBeUndefined();
  });

  it('returns measurements if properties exist', () => {
    const measurements = createMeasurements(resource, 'ex:measurements');

    expect(measurements).toStrictEqual([
      {
        id: 'https://example.org/measurement1',
        value: true,
        metric: {id: 'https://example.org/metric1', name: 'Metric 1', order: 1},
      },
    ]);
  });
});
