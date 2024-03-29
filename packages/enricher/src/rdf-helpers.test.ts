import {
  createDates,
  createThings,
  createTimeSpans,
  getPropertyValue,
  onlyOne,
} from './rdf-helpers';
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

let enrichmentResource: Resource;

beforeAll(async () => {
  const triples = `
    @prefix ex: <https://example.org/> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

    ex:enrichment1 a ex:Enrichment ;
      ex:name "Name" ;
      ex:type ex:type1, ex:type2 ;
      ex:dateCreated "2023-01-01"^^xsd:date ;
      ex:timeSpan ex:timeSpan1, ex:timeSpan2, ex:timeSpan3, ex:timeSpan4 .

    ex:type1 a ex:DefinedTerm ;
      ex:name "Term" .

    ex:type2 a ex:DefinedTerm .

    ex:timeSpan1 a ex:TimeSpan ;
      ex:startDate "-1900"^^xsd:gYear ;
      ex:endDate "-1889"^^xsd:gYear .

    # No end date
    ex:timeSpan2 a ex:TimeSpan ;
      ex:startDate "1889"^^xsd:gYear .

    # No start date
    ex:timeSpan3 a ex:TimeSpan ;
      ex:endDate "1900"^^xsd:gYear .

    # Invalid date
    ex:timeSpan4 a ex:TimeSpan ;
      ex:startDate "badValue" .
  `;

  const stringStream = streamifyString(triples);
  const streamParser = new StreamParser();
  stringStream.pipe(streamParser);
  await loader.import(streamParser);

  enrichmentResource = loader.resources['https://example.org/enrichment1'];
});

describe('getPropertyValue', () => {
  it('returns undefined if property does not exist', () => {
    const value = getPropertyValue(enrichmentResource, 'ex:unknown');

    expect(value).toBeUndefined();
  });

  it('returns value if property exists', () => {
    const value = getPropertyValue(enrichmentResource, 'ex:name');

    expect(value).toStrictEqual('Name');
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

describe('createThings', () => {
  it('returns undefined if properties do not exist', () => {
    const things = createThings(enrichmentResource, 'ex:unknown');

    expect(things).toBeUndefined();
  });

  it('returns things if properties exist', () => {
    const things = createThings(enrichmentResource, 'ex:type');

    expect(things).toStrictEqual([
      {id: 'https://example.org/type1', name: 'Term'},
      {id: 'https://example.org/type2', name: undefined},
    ]);
  });
});

describe('createDates', () => {
  it('returns undefined if properties do not exist', () => {
    const things = createDates(enrichmentResource, 'ex:unknown');

    expect(things).toBeUndefined();
  });

  it('returns dates if properties exist', () => {
    const dates = createDates(enrichmentResource, 'ex:dateCreated');

    expect(dates).toStrictEqual([new Date('2023-01-01')]);
  });
});

describe('createTimeSpan', () => {
  it('returns undefined if properties do not exist', () => {
    const timeSpans = createTimeSpans(enrichmentResource, 'ex:unknown');

    expect(timeSpans).toBeUndefined();
  });

  it('returns time spans if properties exist', () => {
    const timeSpans = createTimeSpans(enrichmentResource, 'ex:timeSpan');

    expect(timeSpans).toStrictEqual([
      {
        id: 'https://example.org/timeSpan1',
        startDate: new Date('-001900-01-01T00:00:00.000Z'),
        endDate: new Date('-001889-12-31T23:59:59.999Z'),
      },
      {
        id: 'https://example.org/timeSpan2',
        startDate: new Date('1889-01-01T00:00:00.000Z'),
        endDate: undefined,
      },
      {
        id: 'https://example.org/timeSpan3',
        startDate: undefined,
        endDate: new Date('1900-12-31T23:59:59.999Z'),
      },
      {
        id: 'https://example.org/timeSpan4',
        startDate: undefined,
        endDate: undefined,
      },
    ]);
  });
});
