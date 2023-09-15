import {dateCreatedFormatter} from './date-created-formatter';
import {describe, expect, it} from '@jest/globals';

describe('dateCreatedFormatter', () => {
  it('returns undefined if both startDate and endDate are undefined', () => {
    const formattedDate = dateCreatedFormatter(
      {startDate: undefined, endDate: undefined, id: 'timeSpan'},
      'en'
    );

    expect(formattedDate).toBeUndefined();
  });

  it('returns only startDate if endDate is undefined', () => {
    const formattedDate = dateCreatedFormatter(
      {startDate: new Date('2021-01-01'), endDate: undefined, id: 'timeSpan'},
      'en'
    );

    expect(formattedDate).toBe('Jan 1, 2021');
  });

  it('returns only endDate if startDate is undefined', () => {
    const formattedDate = dateCreatedFormatter(
      {startDate: undefined, endDate: new Date('2021-01-02'), id: 'timeSpan'},
      'en'
    );

    expect(formattedDate).toBe('Jan 2, 2021');
  });

  it('returns both startDate and endDate if both contain a date', () => {
    const formattedDate = dateCreatedFormatter(
      {
        startDate: new Date('2021-01-01'),
        endDate: new Date('2021-01-02'),
        id: 'timeSpan',
      },
      'en'
    );

    expect(formattedDate).toBe('Jan 1 – 2, 2021');
  });

  it('returns one date if startDate and endDate are the same', () => {
    const formattedDate = dateCreatedFormatter(
      {
        startDate: new Date('2021-01-01'),
        endDate: new Date('2021-01-01'),
        id: 'timeSpan',
      },
      'en'
    );

    expect(formattedDate).toBe('Jan 1, 2021');
  });

  it('returns only dates and not times', () => {
    const formattedDate = dateCreatedFormatter(
      {
        startDate: new Date('2021-01-01T12:00:00'),
        endDate: new Date('2021-01-02T13:00:00'),
        id: 'timeSpan',
      },
      'en'
    );

    expect(formattedDate).toBe('Jan 1 – 2, 2021');
  });

  it('returns dates in the correct locale', () => {
    const formattedDate = dateCreatedFormatter(
      {
        startDate: new Date('2021-05-01'),
        endDate: new Date('2021-10-02'),
        id: 'timeSpan',
      },
      'nl'
    );

    expect(formattedDate).toBe('1 mei – 2 okt 2021');
  });
});
