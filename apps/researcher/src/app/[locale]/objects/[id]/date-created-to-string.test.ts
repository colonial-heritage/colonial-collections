import dateCreatedToString from './date-created-to-string';
import {describe, expect, it} from '@jest/globals';

describe('dateCreatedToString', () => {
  it('returns undefined if both startDate and endDate are undefined', () => {
    const date = dateCreatedToString(
      {startDate: undefined, endDate: undefined, id: 'timeSpan'},
      'en'
    );

    expect(date).toBeUndefined();
  });

  it('returns only startDate if endDate is undefined', () => {
    const date = dateCreatedToString(
      {startDate: new Date('2021-01-01'), endDate: undefined, id: 'timeSpan'},
      'en'
    );

    expect(date).toBe('Jan 1, 2021');
  });

  it('returns only endDate if startDate is undefined', () => {
    const date = dateCreatedToString(
      {startDate: undefined, endDate: new Date('2021-01-02'), id: 'timeSpan'},
      'en'
    );

    expect(date).toBe('Jan 2, 2021');
  });

  it('returns both startDate and endDate if both contain a date', () => {
    const date = dateCreatedToString(
      {
        startDate: new Date('2021-01-01'),
        endDate: new Date('2021-01-02'),
        id: 'timeSpan',
      },
      'en'
    );

    expect(date).toBe('Jan 1 – 2, 2021');
  });

  it('returns one date if startDate and endDate are the same', () => {
    const date = dateCreatedToString(
      {
        startDate: new Date('2021-01-01'),
        endDate: new Date('2021-01-01'),
        id: 'timeSpan',
      },
      'en'
    );

    expect(date).toBe('Jan 1, 2021');
  });

  it('returns only dates and not times', () => {
    const date = dateCreatedToString(
      {
        startDate: new Date('2021-01-01T12:00:00'),
        endDate: new Date('2021-01-02T13:00:00'),
        id: 'timeSpan',
      },
      'en'
    );

    expect(date).toBe('Jan 1 – 2, 2021');
  });
});
