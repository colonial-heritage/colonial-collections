import {textToSlug, getMarkdownHeaders} from './linkable-headers';

describe('textToSlug', () => {
  it('converts simple text to slug', () => {
    expect(textToSlug('Hello World')).toBe('hello-world');
  });

  it('removes diacritics and special characters', () => {
    expect(textToSlug('Café déjà-vu!')).toBe('cafe-deja-vu');
  });

  it('collapses multiple spaces and dashes', () => {
    expect(textToSlug('A   B--C')).toBe('a-b-c');
  });

  it('trims leading and trailing spaces', () => {
    expect(textToSlug('  Hello  ')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(textToSlug('')).toBe('');
  });
});

describe('getMarkdownHeaders', () => {
  it('extracts level 1-3 headers and slugs', () => {
    const md =
      '# Title\nSome text\n\n## Subtitle\nMore text\n\n### Section\nEven more text';
    expect(getMarkdownHeaders(md)).toEqual([
      {name: 'Title', slug: 'title'},
      {name: 'Subtitle', slug: 'subtitle'},
      {name: 'Section', slug: 'section'},
    ]);
  });

  it('ignores deeper headers', () => {
    const md = '#### Not included\n# Included';
    expect(getMarkdownHeaders(md)).toEqual([
      {name: 'Included', slug: 'included'},
    ]);
  });

  it('handles headers with diacritics and punctuation', () => {
    const md = '## Café déjà-vu!';
    expect(getMarkdownHeaders(md)).toEqual([
      {name: 'Café déjà-vu!', slug: 'cafe-deja-vu'},
    ]);
  });

  it('returns empty array if no headers', () => {
    expect(getMarkdownHeaders('No headers here')).toEqual([]);
  });

  it('handles multiple headers with same name', () => {
    const md = '# Repeat\n# Repeat';
    expect(getMarkdownHeaders(md)).toEqual([
      {name: 'Repeat', slug: 'repeat'},
      {name: 'Repeat', slug: 'repeat'},
    ]);
  });
});
