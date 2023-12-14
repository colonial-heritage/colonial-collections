import {describe, expect} from '@jest/globals';
import {groupByDateRange} from './group-events';
import {LabeledProvenanceEvent} from './definitions';

describe('groupByDateRange', () => {
  it('should group events by date range', () => {
    const events = [
      {
        startDate: new Date('2022-01-01'),
        endDate: new Date('2022-01-05'),
      },
      {
        startDate: new Date('2022-01-03'),
        endDate: new Date('2022-01-07'),
      },
      {
        startDate: new Date('2022-01-03'),
        endDate: new Date('2022-01-07'),
      },
      {
        startDate: new Date('2022-01-06'),
        endDate: new Date('2022-01-10'),
      },
    ];

    const locale = 'en';

    // @ts-expect-error:TS2322
    const result = groupByDateRange({events, locale});

    expect(result['Jan 1 – 5, 2022']).toHaveLength(1);
    expect(result['Jan 3 – 7, 2022']).toHaveLength(2);
    expect(result['Jan 6 – 10, 2022']).toHaveLength(1);
  });

  it('should handle empty events array', () => {
    const events: LabeledProvenanceEvent[] = [];
    const locale = 'en';

    const result = groupByDateRange({events, locale});

    expect(Object.keys(result)).toHaveLength(0);
  });
});
