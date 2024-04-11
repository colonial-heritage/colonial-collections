import {DateType, getDateAsXsd} from './helpers';
import {describe, expect, it} from '@jest/globals';

describe('getDateAsXsd', () => {
  it.each([
    ['1801', '1801-01-01'],
    ['1801-01', '1801-01-01'],
    ['1801-01-01', '1801-01-01'],
    ['1801-01-01T23:59:59', '1801-01-01'],
  ])('returns a start date', (dateIn, dateExpected) => {
    const date = getDateAsXsd(dateIn, DateType.StartDate);

    expect(date).toBe(dateExpected);
  });

  it.each([
    ['1801', '1801-12-31'],
    ['1801-01', '1801-01-31'],
    ['1801-01-01', '1801-01-01'],
    ['1801-01-01T23:59:59', '1801-01-01'],
  ])('returns an end date', (dateIn, dateExpected) => {
    const date = getDateAsXsd(dateIn, DateType.EndDate);

    expect(date).toBe(dateExpected);
  });
});
