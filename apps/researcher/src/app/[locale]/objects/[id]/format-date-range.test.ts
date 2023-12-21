import {formatDateRange} from './format-date-range';
import {describe, expect, it} from '@jest/globals';

describe('formatDateRange', () => {
  it('returns undefined if both startDate and endDate are undefined', () => {
    const formattedDate = formatDateRange({
      startDate: undefined,
      endDate: undefined,
      locale: 'en',
    });

    expect(formattedDate).toBeUndefined();
  });

  it('returns only startDate if endDate is undefined', () => {
    const formattedDate = formatDateRange({
      startDate: new Date('2021-01-01'),
      endDate: undefined,
      locale: 'en',
    });

    expect(formattedDate).toBe('Jan 1, 2021');
  });

  it('returns only endDate if startDate is undefined', () => {
    const formattedDate = formatDateRange({
      startDate: undefined,
      endDate: new Date('2021-01-02'),
      locale: 'en',
    });

    expect(formattedDate).toBe('Jan 2, 2021');
  });

  it('returns both startDate and endDate if both contain a date', () => {
    const formattedDate = formatDateRange({
      startDate: new Date('2021-01-01'),
      endDate: new Date('2021-01-02'),
      locale: 'en',
    });

    expect(formattedDate).toBe('Jan 1 – 2, 2021');
  });

  it('returns one date if startDate and endDate are the same', () => {
    const formattedDate = formatDateRange({
      startDate: new Date('2021-01-01'),
      endDate: new Date('2021-01-01'),
      locale: 'en',
    });

    expect(formattedDate).toBe('Jan 1, 2021');
  });

  it('returns only dates and not times', () => {
    const formattedDate = formatDateRange({
      startDate: new Date('2021-01-01T12:00:00'),
      endDate: new Date('2021-01-02T13:00:00'),
      locale: 'en',
    });

    expect(formattedDate).toBe('Jan 1 – 2, 2021');
  });

  it('returns dates in the correct locale', () => {
    const formattedDate = formatDateRange({
      startDate: new Date('2021-05-01'),
      endDate: new Date('2021-10-02'),
      locale: 'nl',
    });

    expect(formattedDate).toBe('1 mei – 2 okt 2021');
  });
});
