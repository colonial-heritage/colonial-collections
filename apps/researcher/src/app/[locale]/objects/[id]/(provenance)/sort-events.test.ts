import {sortEvents} from './sort-events';
import {describe, expect} from '@jest/globals';

describe('sortEvents', () => {
  it('sorts events based on `startDate` and `endDate`', () => {
    const events = [
      {id: '5', date: {startDate: new Date('2022-04-01'), endDate: null}},
      {
        id: '3',
        date: {
          startDate: new Date('2022-02-01'),
          endDate: new Date('2022-04-01'),
        },
      },
      {
        id: '4',
        date: {
          startDate: new Date('2022-03-01'),
          endDate: new Date('2022-05-01'),
        },
      },
      {id: '1', date: {startDate: null, endDate: new Date('2022-02-01')}},
      {
        id: '2',
        date: {
          startDate: new Date('2022-01-01'),
          endDate: new Date('2022-03-01'),
        },
      },
    ];

    // @ts-expect-error:TS2322
    const sorted = sortEvents(events);

    expect(sorted).toEqual([
      {id: '1', date: {startDate: null, endDate: new Date('2022-02-01')}},
      {
        id: '2',
        date: {
          startDate: new Date('2022-01-01'),
          endDate: new Date('2022-03-01'),
        },
      },
      {
        id: '3',
        date: {
          startDate: new Date('2022-02-01'),
          endDate: new Date('2022-04-01'),
        },
      },
      {
        id: '4',
        date: {
          startDate: new Date('2022-03-01'),
          endDate: new Date('2022-05-01'),
        },
      },
      {id: '5', date: {startDate: new Date('2022-04-01'), endDate: null}},
    ]);
  });
});
