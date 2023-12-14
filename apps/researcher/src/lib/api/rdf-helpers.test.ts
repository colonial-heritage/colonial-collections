import {
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
let resource: Resource;

beforeAll(async () => {
  const triples = `
    @prefix ex: <https://example.org/> .

    ex:object1 a ex:Object ;
      ex:name "Name" ;
      ex:description "Description 1", "Description 2" .
  `;

  const stringStream = streamifyString(triples);
  const streamParser = new StreamParser();
  stringStream.pipe(streamParser);
  await loader.import(streamParser);
  resource = loader.resources['https://example.org/object1'];
});

describe('getProperty', () => {
  it('returns undefined if property does not exist', () => {
    const property = getProperty(resource, 'ex:unknown');

    expect(property).toBeUndefined();
  });

  it('returns property if it exists', () => {
    const property = getProperty(resource, 'ex:name');

    expect(property).toBeInstanceOf(Resource);
  });
});

describe('getPropertyValue', () => {
  it('returns undefined if property does not exist', () => {
    const value = getPropertyValue(resource, 'ex:unknown');

    expect(value).toBeUndefined();
  });

  it('returns value if property exists', () => {
    const value = getPropertyValue(resource, 'ex:name');

    expect(value).toStrictEqual('Name');
  });
});

describe('getPropertyValues', () => {
  it('returns undefined if properties do not exist', () => {
    const values = getPropertyValues(resource, 'ex:unknown');

    expect(values).toBeUndefined();
  });

  it('returns values if properties exist', () => {
    const values = getPropertyValues(resource, 'ex:description');

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
