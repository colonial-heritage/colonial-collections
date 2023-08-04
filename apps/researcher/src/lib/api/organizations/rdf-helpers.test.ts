import {ontologyUrl} from '../definitions';
import {createAddressFromProperty} from './rdf-helpers';
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
        cc:streetAddress "Street" ;
        cc:postalCode "Postal code" ;
        cc:addressLocality "Locality" ;
        cc:addressCountry "Country"
      ] .
  `;

  const stringStream = streamifyString(triples);
  const streamParser = new StreamParser();
  stringStream.pipe(streamParser);
  await loader.import(streamParser);
  resource = loader.resources['https://example.org/organization1'];
});

describe('createAddressFromProperty', () => {
  it('returns undefined if property does not exist', async () => {
    const address = createAddressFromProperty(resource, 'cc:unknown');

    expect(address).toBeUndefined();
  });

  it('returns address if property exists', async () => {
    const address = createAddressFromProperty(resource, 'cc:address');

    expect(address).toStrictEqual({
      id: expect.stringContaining('n3-'),
      streetAddress: 'Street',
      postalCode: 'Postal code',
      addressLocality: 'Locality',
      addressCountry: 'Country',
    });
  });
});
