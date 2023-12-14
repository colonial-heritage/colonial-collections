import {sortEvents} from './sort-events';
import {describe, expect} from '@jest/globals';

describe('sortEvents', () => {
  it('sorts events based on `startsAfter` and `endsBefore`', () => {
    const events = [
      {id: '5', startsAfter: '3', endsBefore: null},
      {id: '3', startsAfter: '1', endsBefore: '4'},
      {id: '4', startsAfter: '3', endsBefore: '5'},
      {id: '1', startsAfter: null, endsBefore: null},
      {id: '2', startsAfter: '1', endsBefore: '3'},
    ];
    // @ts-expect-error:TS2322
    const sorted = sortEvents(events);
    expect(sorted).toEqual([
      {id: '1', startsAfter: null, endsBefore: null},
      {id: '2', startsAfter: '1', endsBefore: '3'},
      {id: '3', startsAfter: '1', endsBefore: '4'},
      {id: '4', startsAfter: '3', endsBefore: '5'},
      {id: '5', startsAfter: '3', endsBefore: null},
    ]);
  });
});
