import {iriToHash} from './iriToHash';

describe('iriToHash', () => {
  it('returns a hash', () => {
    const hash = iriToHash('https://example.com');
    expect(hash).toBe('c984d06aafbecf6bc55569f964148ea3');
  });

  it('returns a hash of the same length', () => {
    const hash = iriToHash(
      'https://example.com/1234567890123456789012345678901234567890'
    );
    expect(hash.length).toBe(32);
  });
});
