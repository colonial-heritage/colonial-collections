import {ontologyUrl} from '../definitions';
import {createAddresses} from './rdf-helpers';
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

    ex:organization1 a cc:Organization ;
      cc:name "Name" ;
      cc:url <https://example.org/> ;
      cc:address [
        a cc:PostalAddress ;
        cc:streetAddress "Street 1" ;
        cc:postalCode "Postal code 1" ;
        cc:addressLocality "Locality 1" ;
        cc:addressCountry "Country 1"
      ], [
        a cc:PostalAddress ;
        cc:streetAddress "Street 2" ;
        cc:postalCode "Postal code 2" ;
        cc:addressLocality "Locality 2" ;
        cc:addressCountry "Country 2"
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
    const addresses = createAddresses(resource, 'cc:unknown');

    expect(addresses).toBeUndefined();
  });

  it('returns addresses if property exists', () => {
    const addresses = createAddresses(resource, 'cc:address');

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
