import {isIri} from '.';
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
