import {
  formatDate,
  formatDateRange,
  dateFormatSettings,
} from './create-formatter';
import {describe, expect, it} from '@jest/globals';

const formatter = new Intl.DateTimeFormat('en', dateFormatSettings);

const t = jest.fn(key => key);
const formatDateTime = jest.fn(date => formatter.format(date));

describe('formatDate', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns undefined if date is not provided', () => {
    const result = formatDate({date: undefined, t, formatDateTime});
    expect(result).toBeUndefined();
    expect(t).not.toHaveBeenCalled();
    expect(formatDateTime).not.toHaveBeenCalled();
  });

  it('formats the date with the date formatter for dates after 0', () => {
    const date = new Date('2022-01-01');
    formatDate({date, t, formatDateTime});
    expect(formatDateTime).toHaveBeenCalledWith(date, dateFormatSettings);
  });

  it('formats the date using translations for dates before 0', () => {
    const date = new Date('-001000-01-01');
    formatDate({date, t, formatDateTime});
    expect(t).toHaveBeenCalledWith('beforeCommonEraFormat', {date});
  });
});

describe('formatDateRange', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns translation `noDateRange` if no dates are provided', () => {
    const result = formatDateRange({
      startDate: undefined,
      endDate: undefined,
      t,
      formatDateTime,
    });
    expect(t).toHaveBeenCalledWith('noDateRange');
    expect(result).toBe('noDateRange');
    expect(formatDateTime).not.toHaveBeenCalled();
  });

  it('returns the start date if both dates are the same', () => {
    const startDate = new Date('2022-01-01');
    const endDate = new Date('2022-01-01');
    const result = formatDateRange({startDate, endDate, t, formatDateTime});
    expect(result).toBe('Jan 1, 2022');
  });

  it('returns a range of dates if the start and end date are different', () => {
    const startDate = new Date('2022-01-01');
    const endDate = new Date('2022-01-02');
    const result = formatDateRange({startDate, endDate, t, formatDateTime});
    expect(result).toBe('Jan 1, 2022 – Jan 2, 2022');
  });

  it('returns the translation `noEndDate` if the end date is not provided', () => {
    const startDate = new Date('2022-01-01');
    const result = formatDateRange({
      startDate,
      endDate: undefined,
      t,
      formatDateTime,
    });
    expect(result).toBe('Jan 1, 2022 – noEndDate');
  });

  it('returns the translation `noStartDate` if the start date is not provided', () => {
    const endDate = new Date('2022-01-01');
    const result = formatDateRange({
      startDate: undefined,
      endDate,
      t,
      formatDateTime,
    });
    expect(result).toBe('noStartDate – Jan 1, 2022');
  });
});
