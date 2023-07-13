import {describe, expect, it} from '@jest/globals';
import {encodeUri, decodeUri} from './uri-transformer';

describe('encodeUri', () => {
  it('encodes an url', () => {
    const encodedUri = encodeUri('https://museum.example.org/');
    expect(encodedUri).toBe('https%3A%2F%2Fmuseum%2Eexample%2Eorg%2F');
  });

  it('encodes a string with spaces', () => {
    const encodedUri = encodeUri('A string with spaces');
    expect(encodedUri).toBe('A%20string%20with%20spaces');
  });
});

describe('decodeUri', () => {
  it('decodes an url', () => {
    const decodedUri = decodeUri('https%3A%2F%2Fmuseum%2Eexample%2Eorg%2F');
    expect(decodedUri).toBe('https://museum.example.org/');
  });

  it('decodes a string with spaces', () => {
    const decodedUri = decodeUri('A%20string%20with%20spaces');
    expect(decodedUri).toBe('A string with spaces');
  });
});
