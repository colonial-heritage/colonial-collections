import {
  createActors,
  createDates,
  createThings,
  createTimeSpans,
  getProperty,
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
      ex:type ex:myType1, ex:myType2 ;
      ex:dateCreated "2023-01-01"^^xsd:date ;
      ex:timeSpan ex:myTimeSpan1, ex:myTimeSpan2, ex:myTimeSpan3, ex:myTimeSpan4 ;
      ex:creator ex:myPerson1, ex:myPerson2 .

    ex:myType1 a ex:DefinedTerm ;
      ex:name "Term" .

    ex:myType2 a ex:DefinedTerm .

    ex:myTimeSpan1 a ex:TimeSpan ;
      ex:startDate "-1900"^^xsd:gYear ;
      ex:endDate "-1889"^^xsd:gYear .

    # No end date
    ex:myTimeSpan2 a ex:TimeSpan ;
      ex:startDate "1889"^^xsd:gYear .

    # No start date
    ex:myTimeSpan3 a ex:TimeSpan ;
      ex:endDate "1900"^^xsd:gYear .

    # Invalid date
    ex:myTimeSpan4 a ex:TimeSpan ;
      ex:startDate "badValue" .

    # Is not a part of another actor
    ex:myPerson1 a ex:Actor ;
      ex:name "Person 1" .

    # Is a part of another actor (e.g. a community)
    ex:myPerson2 a ex:Actor ;
      ex:name "Person 2" ;
      ex:isPartOf ex:myGroup .

    ex:myGroup a ex:Actor ;
      ex:name "Group" .
  `;

  const stringStream = streamifyString(triples);
  const streamParser = new StreamParser();
  stringStream.pipe(streamParser);
  await loader.import(streamParser);

  enrichmentResource = loader.resources['https://example.org/enrichment1'];
});

describe('getProperty', () => {
  it('returns undefined if property does not exist', () => {
    const property = getProperty(enrichmentResource, 'ex:unknown');

    expect(property).toBeUndefined();
  });

  it('returns property if it exists', () => {
    const property = getProperty(enrichmentResource, 'ex:name');

    expect(property).toBeInstanceOf(Resource);
  });
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

  it('returns things', () => {
    const things = createThings(enrichmentResource, 'ex:type');

    expect(things).toStrictEqual([
      {id: 'https://example.org/myType1', name: 'Term'},
      {id: 'https://example.org/myType2', name: undefined},
    ]);
  });
});

describe('createDates', () => {
  it('returns undefined if properties do not exist', () => {
    const things = createDates(enrichmentResource, 'ex:unknown');

    expect(things).toBeUndefined();
  });

  it('returns dates', () => {
    const dates = createDates(enrichmentResource, 'ex:dateCreated');

    expect(dates).toStrictEqual([new Date('2023-01-01')]);
  });
});

describe('createTimeSpans', () => {
  it('returns undefined if properties do not exist', () => {
    const timeSpans = createTimeSpans(enrichmentResource, 'ex:unknown');

    expect(timeSpans).toBeUndefined();
  });

  it('returns time spans', () => {
    const timeSpans = createTimeSpans(enrichmentResource, 'ex:timeSpan');

    expect(timeSpans).toStrictEqual([
      {
        id: 'https://example.org/myTimeSpan1',
        startDate: new Date('-001900-01-01T00:00:00.000Z'),
        endDate: new Date('-001889-12-31T23:59:59.999Z'),
      },
      {
        id: 'https://example.org/myTimeSpan2',
        startDate: new Date('1889-01-01T00:00:00.000Z'),
        endDate: undefined,
      },
      {
        id: 'https://example.org/myTimeSpan3',
        startDate: undefined,
        endDate: new Date('1900-12-31T23:59:59.999Z'),
      },
      {
        id: 'https://example.org/myTimeSpan4',
        startDate: undefined,
        endDate: undefined,
      },
    ]);
  });
});

describe('createActors', () => {
  it('returns undefined if properties do not exist', () => {
    const actors = createActors(enrichmentResource, 'ex:unknown');

    expect(actors).toBeUndefined();
  });

  it('returns actors', () => {
    const actors = createActors(enrichmentResource, 'ex:creator');

    expect(actors).toStrictEqual([
      {
        id: 'https://example.org/myPerson1',
        name: 'Person 1',
      },
      {
        id: 'https://example.org/myPerson2',
        name: 'Person 2',
        isPartOf: {
          id: 'https://example.org/myGroup',
          name: 'Group',
        },
      },
    ]);
  });
});
