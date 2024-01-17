import {describe, expect} from '@jest/globals';
import {getEarliestDate, categorizeEvents} from './categorize-timeline-events';
import {LabeledProvenanceEvent} from './definitions';
describe('categorizeEvents', () => {
  it('categorizes events without dates correctly', () => {
    const events = [
      {startDate: undefined, endDate: undefined},
      {startDate: undefined, endDate: undefined},
    ];

    // @ts-expect-error:TS2345
    const result = categorizeEvents(events);

    expect(result.eventsWithoutDates).toEqual(events);
    expect(result.rangeEvents).toEqual([]);
    expect(result.singleEvents).toEqual([]);
  });

  it('categorizes range events correctly', () => {
    const events = [
      {startDate: new Date('2022-01-01'), endDate: new Date('2022-01-02')},
      {startDate: new Date('2022-02-01'), endDate: new Date('2022-02-03')},
    ];

    // @ts-expect-error:TS2345
    const result = categorizeEvents(events);

    expect(result.eventsWithoutDates).toEqual([]);
    expect(result.rangeEvents).toEqual(events);
    expect(result.singleEvents).toEqual([]);
  });

  it('categorizes single events correctly', () => {
    const events = [
      {startDate: new Date('2022-01-01'), endDate: undefined},
      {startDate: undefined, endDate: new Date('2022-02-01')},
      {startDate: new Date('2022-03-01'), endDate: new Date('2022-03-01')},
    ];

    // @ts-expect-error:TS2345
    const result = categorizeEvents(events);

    expect(result.eventsWithoutDates).toEqual([]);
    expect(result.rangeEvents).toEqual([]);
    expect(result.singleEvents).toEqual(events);
  });

  it('categorizes mixed events correctly', () => {
    const events = [
      {startDate: undefined, endDate: undefined},
      {startDate: new Date('2022-01-01'), endDate: new Date('2022-01-02')},
      {startDate: new Date('2022-02-01'), endDate: new Date('2022-02-03')},
      {startDate: new Date('2022-03-01'), endDate: undefined},
    ];

    // @ts-expect-error:TS2345
    const result = categorizeEvents(events);

    expect(result.eventsWithoutDates).toEqual([events[0]]);
    expect(result.rangeEvents).toEqual([events[1], events[2]]);
    expect(result.singleEvents).toEqual([events[3]]);
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
