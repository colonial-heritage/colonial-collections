import {parseWalkthrough} from './schema';

describe('parseWalkthrough', () => {
  it('returns parsed videos for valid YAML', () => {
    const yaml = `
videos:
  - title: Search
    text: Type a keyword.
    vimeoId: "123"
  - title: Add a narrative
    text: Click the button.
    vimeoId: "456"
    vimeoHash: abc
`;
    expect(parseWalkthrough(yaml)).toEqual([
      {title: 'Search', text: 'Type a keyword.', vimeoId: '123', active: true},
      {
        title: 'Add a narrative',
        text: 'Click the button.',
        vimeoId: '456',
        vimeoHash: 'abc',
        active: true,
      },
    ]);
  });

  it('skips invalid entries and reports them via onInvalid', () => {
    const yaml = `
videos:
  - title: Valid
    text: Good.
    vimeoId: "1"
  - title: ""
    text: Missing title
    vimeoId: "2"
  - title: Bad id
    text: Non-numeric
    vimeoId: "abc"
`;
    const onInvalid = jest.fn();
    const result = parseWalkthrough(yaml, {onInvalid});

    expect(result).toEqual([
      {title: 'Valid', text: 'Good.', vimeoId: '1', active: true},
    ]);
    expect(onInvalid).toHaveBeenCalledTimes(2);
    expect(onInvalid.mock.calls[0][0]).toBe(1);
    expect(onInvalid.mock.calls[1][0]).toBe(2);
  });

  it('accepts entries with empty or missing text', () => {
    const yaml = `
videos:
  - title: No text
    vimeoId: "1"
  - title: Empty text
    text: ""
    vimeoId: "2"
`;
    expect(parseWalkthrough(yaml)).toEqual([
      {title: 'No text', text: '', vimeoId: '1', active: true},
      {title: 'Empty text', text: '', vimeoId: '2', active: true},
    ]);
  });

  it('skips inactive entries', () => {
    const yaml = `
videos:
  - title: Active
    text: Visible.
    vimeoId: "1"
  - title: Inactive
    text: Hidden.
    vimeoId: "2"
    active: false
`;
    expect(parseWalkthrough(yaml)).toEqual([
      {title: 'Active', text: 'Visible.', vimeoId: '1', active: true},
    ]);
  });

  it('returns empty array for YAML with no videos key', () => {
    expect(parseWalkthrough('other: value')).toEqual([]);
  });

  it('returns empty array and calls onInvalid for malformed top-level shape', () => {
    const onInvalid = jest.fn();
    const result = parseWalkthrough('videos: "not an array"', {onInvalid});

    expect(result).toEqual([]);
    expect(onInvalid).toHaveBeenCalledWith(-1, expect.anything());
  });
});
