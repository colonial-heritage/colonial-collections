import {createImages} from './rdf-helpers';
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
      ex:image ex:image1, ex:image2, ex:image3 .

    ex:image1 a ex:Image ;
      ex:contentUrl <https://example.org/image1.jpg> ;
      ex:license ex:license1 .

    ex:license1 a ex:DigitalDocument ;
      ex:name "License" .

    ex:image2 a ex:Image ;
      ex:contentUrl <https://example.org/image2.jpg> .

    ex:image3 a ex:Image .
  `;

  const stringStream = streamifyString(triples);
  const streamParser = new StreamParser();
  stringStream.pipe(streamParser);
  await loader.import(streamParser);
  resource = loader.resources['https://example.org/object1'];
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
