import {describe, expect, it} from '@jest/globals';
import {
  encodeRouteSegment,
  decodeRouteSegment,
} from './clerk-route-segment-transformer';

describe('encodeRouteSegment', () => {
  it('encodes a string with dots', () => {
    const encodedUri = encodeRouteSegment('https://museum.example.org/');
    expect(encodedUri).toBe(
      '68747470733a2f2f6d757365756d2e6578616d706c652e6f72672f'
    );
  });
});

describe('decodeRouteSegment', () => {
  it('decodes a string with dots', () => {
    const decodedUri = decodeRouteSegment(
      '68747470733a2f2f6d757365756d2e6578616d706c652e6f72672f'
    );
    expect(decodedUri).toBe('https://museum.example.org/');
  });
});
