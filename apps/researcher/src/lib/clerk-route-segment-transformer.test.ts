import {describe, expect, it} from '@jest/globals';
import {
  encodeRouteSegment,
  decodeRouteSegment,
} from './clerk-route-segment-transformer';

describe('encodeRouteSegment', () => {
  it('encodes a string with dots', () => {
    const encodedUri = encodeRouteSegment('https://museum.example.org/');
    expect(encodedUri).toBe('https%3A%2F%2Fmuseum%252Eexample%252Eorg%2F');
  });
});

describe('decodeRouteSegment', () => {
  it('decodes a string with dots', () => {
    const decodedUri = decodeRouteSegment(
      'https%3A%2F%2Fmuseum%252Eexample%252Eorg%2F'
    );
    expect(decodedUri).toBe('https://museum.example.org/');
  });
});
