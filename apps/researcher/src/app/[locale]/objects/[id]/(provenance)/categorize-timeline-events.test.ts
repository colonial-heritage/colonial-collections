import {describe, expect} from '@jest/globals';
import {getEarliestDate, categorizeEvents} from './categorize-timeline-events';
import {LabeledProvenanceEvent} from './definitions';

describe('categorizeEvents', () => {
  it('categorizes events without dates correctly', () => {
    const eventGroups = {
      group1: [
        {id: 'event1', startDate: undefined, endDate: undefined},
        {id: 'event2', startDate: undefined, endDate: undefined},
      ],
    };

    // @ts-expect-error:TS2345
    const result = categorizeEvents(eventGroups);

    expect(result.eventsWithoutDates).toEqual([
      {id: 'event1', startDate: undefined, endDate: undefined},
      {id: 'event2', startDate: undefined, endDate: undefined},
    ]);
    expect(result.rangeEvents).toEqual([]);
    expect(result.singleEvents).toEqual([]);
  });

  it('categorizes range events correctly', () => {
    const eventGroups = {
      group1: [
        {
          id: 'event1',
          label: 'P1',
          startDate: new Date('2022-01-01'),
          endDate: new Date('2022-01-03'),
        },
        {
          id: 'event2',
          label: 'P2',
          startDate: new Date('2022-01-01'),
          endDate: new Date('2022-01-03'),
        },
      ],
    };

    const result = categorizeEvents(eventGroups);

    expect(result.eventsWithoutDates).toEqual([]);
    expect(result.rangeEvents).toEqual([
      {
        id: 'group1',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2022-01-03'),
        selectIds: ['event1', 'event2'],
        labels: ['P1', 'P2'],
      },
    ]);
    expect(result.singleEvents).toEqual([]);
  });

  it('categorizes single events correctly', () => {
    const eventGroups = {
      group1: [
        {
          id: 'event1',
          label: 'P1',
          startDate: new Date('2022-01-01'),
          endDate: new Date('2022-01-01'),
        },
      ],
      group2: [
        {
          id: 'event2',
          label: 'P2',
          startDate: undefined,
          endDate: new Date('2022-02-01'),
        },
      ],
    };

    const result = categorizeEvents(eventGroups);

    expect(result.eventsWithoutDates).toEqual([]);
    expect(result.rangeEvents).toEqual([]);
    expect(result.singleEvents).toEqual([
      {
        id: 'group1',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2022-01-01'),
        selectIds: ['event1'],
        labels: ['P1'],
      },
      {
        id: 'group2',
        startDate: new Date('2022-02-01'),
        endDate: new Date('2022-02-01'),
        selectIds: ['event2'],
        labels: ['P2'],
      },
    ]);
  });

  it('categorizes mixed events correctly', () => {
    const eventGroups = {
      group1: [
        {id: 'event1', label: 'P1', startDate: undefined, endDate: undefined},
      ],
      group2: [
        {
          id: 'event2',
          label: 'P2',
          startDate: new Date('2022-01-01'),
          endDate: new Date('2022-01-02'),
        },
      ],
      group3: [
        {
          id: 'event3',
          label: 'P3',
          startDate: new Date('2022-03-01'),
          endDate: undefined,
        },
        {
          id: 'event4',
          label: 'P4',
          startDate: new Date('2022-03-01'),
          endDate: undefined,
        },
      ],
    };

    const result = categorizeEvents(eventGroups);

    expect(result.eventsWithoutDates).toEqual([
      {id: 'event1', label: 'P1', startDate: undefined, endDate: undefined},
    ]);
    expect(result.rangeEvents).toEqual([
      {
        id: 'group2',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2022-01-02'),
        selectIds: ['event2'],
        labels: ['P2'],
      },
    ]);
    expect(result.singleEvents).toEqual([
      {
        id: 'group3',
        startDate: new Date('2022-03-01'),
        endDate: new Date('2022-03-01'),
        selectIds: ['event3', 'event4'],
        labels: ['P3', 'P4'],
      },
    ]);
  });
});

describe('getEarliestDate', () => {
  it('returns the earliest date from the events', () => {
    const events = [
      {startDate: new Date('2022-01-01')},
      {startDate: new Date('2022-02-01')},
      {startDate: new Date('2022-03-01')},
    ];

    // @ts-expect-error:TS2345
    const result = getEarliestDate(events);

    expect(result).toEqual(new Date('2022-01-01'));
  });

  it('returns the earliest date when there are duplicate dates', () => {
    const events = [
      {startDate: new Date('2022-01-01')},
      {startDate: new Date('2022-01-01')},
      {startDate: new Date('2022-02-01')},
    ];

    // @ts-expect-error:TS2345
    const result = getEarliestDate(events);

    expect(result).toEqual(new Date('2022-01-01'));
  });

  it('returns the earliest date when there are no events', () => {
    const events: LabeledProvenanceEvent[] = [];

    const result = getEarliestDate(events);

    expect(result).toEqual(new Date());
  });
});
