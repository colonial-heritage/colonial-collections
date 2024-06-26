import {describe, expect} from '@jest/globals';
import {groupByDateRange} from './group-events';
import {UserProvenanceEvent} from './definitions';

// A simple `formatDateRange` mock that returns a string representation of a date range.
function formatDateRange({
  startDate,
  endDate,
}: {
  startDate?: Date;
  endDate?: Date;
}) {
  if (!startDate || !endDate) {
    return '';
  }

  return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
}

describe('groupByDateRange', () => {
  it('groups events by date range', () => {
    const events = [
      {
        date: {
          startDate: new Date('2022-01-01'),
          endDate: new Date('2022-01-05'),
        },
      },
      {
        date: {
          startDate: new Date('2022-01-03'),
          endDate: new Date('2022-01-07'),
        },
      },
      {
        date: {
          startDate: new Date('2022-01-03'),
          endDate: new Date('2022-01-07'),
        },
      },
      {
        date: {
          startDate: new Date('2022-01-06'),
          endDate: new Date('2022-01-10'),
        },
      },
    ];

    // @ts-expect-error:TS2322
    const result = groupByDateRange({events, formatDateRange});

    expect(result['1/1/2022 - 1/5/2022']).toHaveLength(1);
    expect(result['1/3/2022 - 1/7/2022']).toHaveLength(2);
    expect(result['1/6/2022 - 1/10/2022']).toHaveLength(1);
  });

  it('handles empty events array', () => {
    const events: UserProvenanceEvent[] = [];

    const result = groupByDateRange({events, formatDateRange});

    expect(Object.keys(result)).toHaveLength(0);
  });
});
