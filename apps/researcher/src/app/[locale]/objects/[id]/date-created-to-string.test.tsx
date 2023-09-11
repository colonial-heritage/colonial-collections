import dateCreatedToString from './date-created-to-string';
import {describe, expect, it} from '@jest/globals';

describe('dateCreatedToString', () => {
  it('returns undefined if both startDate and endDate are undefined', async () => {
    const date = await dateCreatedToString(
      {startDate: undefined, endDate: undefined, id: 'timeSpan'},
      'en'
    );

    expect(date).toBeUndefined();
  });

  it('returns only startDate if endDate is undefined', () => {
    expect(
      dateCreatedToString(
        {startDate: new Date('2021-01-01'), endDate: undefined, id: 'timeSpan'},
        'en'
      )
    ).toBe('Jan 1, 2021');
  });

  it('returns only endDate if startDate is undefined', () => {
    expect(
      dateCreatedToString(
        {startDate: undefined, endDate: new Date('2021-01-02'), id: 'timeSpan'},
        'en'
      )
    ).toBe('Jan 2, 2021');
  });

  it('returns both startDate and endDate if both contain a date', () => {
    expect(
      dateCreatedToString(
        {
          startDate: new Date('2021-01-01'),
          endDate: new Date('2021-01-02'),
          id: 'timeSpan',
        },
        'en'
      )
    ).toBe('Jan 1 – 2, 2021');
  });

  it('returns one date if startDate and endDate are the same', () => {
    expect(
      dateCreatedToString(
        {
          startDate: new Date('2021-01-01'),
          endDate: new Date('2021-01-01'),
          id: 'timeSpan',
        },
        'en'
      )
    ).toBe('Jan 1, 2021');
  });
});
