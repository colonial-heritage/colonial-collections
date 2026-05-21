import {readFileSync} from 'node:fs';
import {join} from 'node:path';
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

  it('does not throw on unparseable YAML and reports via onInvalid', () => {
    const onInvalid = jest.fn();
    const broken =
      'videos:\n  - title: Bad\n    text: a: b\n    vimeoId: "1"\n';
    const result = parseWalkthrough(broken, {onInvalid});

    expect(result).toEqual([]);
    expect(onInvalid).toHaveBeenCalledWith(-1, expect.anything());
  });

  // Guards against shipping a broken translation that would crash the
  // Walkthrough server component at render time.
  describe.each(['en', 'nl'])('shipped %s walkthrough.yaml', locale => {
    const raw = readFileSync(
      join(__dirname, '..', '..', 'messages', locale, 'walkthrough.yaml'),
      'utf8'
    );

    it('parses without falling through to onInvalid(-1, ...)', () => {
      const onInvalid = jest.fn();
      const videos = parseWalkthrough(raw, {onInvalid});

      const topLevelFailures = onInvalid.mock.calls.filter(
        ([index]) => index === -1
      );
      expect(topLevelFailures).toEqual([]);
      expect(videos.length).toBeGreaterThan(0);
    });
  });
});
