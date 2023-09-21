import {iriToHash} from './iri-to-hash';

describe('iriToHash', () => {
  it('returns a hash', () => {
    const hash = iriToHash('https://example.com');
    expect(hash).toBe('c984d06aafbecf6bc55569f964148ea3');
    expect(hash.length).toBe(32);
  });
});
