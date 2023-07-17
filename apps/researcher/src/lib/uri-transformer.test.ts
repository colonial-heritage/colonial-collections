import {describe, expect, it} from '@jest/globals';
import {encodeUri, decodeUri} from './uri-transformer';

describe('encodeUri', () => {
  it('encodes a URI', () => {
    const encodedUri = encodeUri('https://museum.example.org/');
    expect(encodedUri).toBe('https%3A%2F%2Fmuseum%252Eexample%252Eorg%2F');
  });
});

describe('decodeUri', () => {
  it('decodes a URI', () => {
    const decodedUri = decodeUri('https%3A%2F%2Fmuseum%252Eexample%252Eorg%2F');
    expect(decodedUri).toBe('https://museum.example.org/');
  });
});
