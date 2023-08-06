import {ontologyUrl} from './definitions';
import {getPropertyValue, getPropertyValues, onlyOne} from './rdf-helpers';
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

    ex:object1 a cc:Object ;
      cc:name "Name" ;
      cc:description "Description 1", "Description 2" .
  `;

  const stringStream = streamifyString(triples);
  const streamParser = new StreamParser();
  stringStream.pipe(streamParser);
  await loader.import(streamParser);
  resource = loader.resources['https://example.org/object1'];
});

describe('getPropertyValue', () => {
  it('returns undefined if property does not exist', async () => {
    const value = getPropertyValue(resource, 'cc:unknown');

    expect(value).toBeUndefined();
  });

  it('returns value if property exists', async () => {
    const value = getPropertyValue(resource, 'cc:name');

    expect(value).toStrictEqual('Name');
  });
});

describe('getPropertyValues', () => {
  it('returns undefined if properties do not exist', async () => {
    const values = getPropertyValues(resource, 'cc:unknown');

    expect(values).toBeUndefined();
  });

  it('returns values if properties exist', async () => {
    const values = getPropertyValues(resource, 'cc:description');

    expect(values).toStrictEqual(['Description 1', 'Description 2']);
  });
});

describe('onlyOne', () => {
  it('returns undefined if input is not an array', async () => {
    const item = onlyOne(undefined);

    expect(item).toBeUndefined();
  });

  it('returns undefined if input array is empty', async () => {
    const item = onlyOne([]);

    expect(item).toBeUndefined();
  });

  it('returns the first item from the input array', async () => {
    const item = onlyOne([1, 2]);

    expect(item).toStrictEqual(1);
  });
});
