import {createAddresses} from './rdf-helpers';
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

    ex:organization1 a ex:Organization ;
      ex:name "Name" ;
      ex:url <https://example.org/> ;
      ex:address [
        a ex:PostalAddress ;
        ex:streetAddress "Street 1" ;
        ex:postalCode "Postal code 1" ;
        ex:addressLocality "Locality 1" ;
        ex:addressCountry "Country 1"
      ], [
        a ex:PostalAddress ;
        ex:streetAddress "Street 2" ;
        ex:postalCode "Postal code 2" ;
        ex:addressLocality "Locality 2" ;
        ex:addressCountry "Country 2"
      ] .
  `;

  const stringStream = streamifyString(triples);
  const streamParser = new StreamParser();
  stringStream.pipe(streamParser);
  await loader.import(streamParser);
  resource = loader.resources['https://example.org/organization1'];
});

describe('createAddresses', () => {
  it('returns undefined if property does not exist', () => {
    const addresses = createAddresses(resource, 'ex:unknown');

    expect(addresses).toBeUndefined();
  });

  it('returns addresses if property exists', () => {
    const addresses = createAddresses(resource, 'ex:address');

    expect(addresses).toStrictEqual([
      {
        id: expect.stringContaining('n3-'),
        streetAddress: 'Street 1',
        postalCode: 'Postal code 1',
        addressLocality: 'Locality 1',
        addressCountry: 'Country 1',
      },
      {
        id: expect.stringContaining('n3-'),
        streetAddress: 'Street 2',
        postalCode: 'Postal code 2',
        addressLocality: 'Locality 2',
        addressCountry: 'Country 2',
      },
    ]);
  });
});
