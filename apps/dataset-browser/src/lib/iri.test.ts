import {getIrisFromObject, isIri} from './iri';
import {describe, expect, it} from '@jest/globals';

describe('isIri', () => {
  it('returns true if input is a RFC 3987-compliant IRI', () => {
    expect(isIri('http://example.org')).toBe(true);
    expect(isIri('https://example.org')).toBe(true);
    expect(isIri('https://example.org/?a[]=b')).toBe(true);
  });

  it('returns false if input is not a RFC 3987-compliant IRI', () => {
    // @ts-expect-error:TS2345
    expect(isIri(null)).toBe(false);
    // @ts-expect-error:TS2345
    expect(isIri(1234)).toBe(false);
    expect(isIri('example.org')).toBe(false);
    expect(isIri('https://example.org/|')).toBe(false);
  });
});

describe('getIrisFromObject', () => {
  it('gets IRIs from an object', () => {
    const iris = getIrisFromObject({
      a: 'b',
      c: {
        d: 'http://example.org',
        e: {
          f: 'https://example.org',
        },
      },
      g: 12,
    });

    expect(iris).toStrictEqual(['http://example.org', 'https://example.org']);
  });

  it('gets IRIs from an array', () => {
    const iris = getIrisFromObject(['https://example.org']);

    expect(iris).toStrictEqual(['https://example.org']);
  });

  it('does not get IRIs if input is empty', () => {
    // @ts-expect-error:TS2553
    const iris = getIrisFromObject();

    expect(iris).toStrictEqual([]);
  });

  it('does not get IRIs if input is not an object or array', () => {
    const iris = getIrisFromObject('https://example.org');

    expect(iris).toStrictEqual([]);
  });

  it('does not get IRIs that are not RFC 3987-compliant', () => {
    const iris = getIrisFromObject(['https://example.org/|']);

    expect(iris).toStrictEqual([]);
  });
});
