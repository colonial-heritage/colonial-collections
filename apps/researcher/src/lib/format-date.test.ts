import {formatDate} from './format-date';
import {describe, expect, it} from '@jest/globals';

describe('formatDate', () => {
  it('formats the date correctly', () => {
    const date = new Date('2022-01-01');
    const locale = 'en';

    const formattedDate = formatDate({date, locale});

    expect(formattedDate).toEqual('January 1, 2022');
  });

  it('returns undefined if date is not provided', () => {
    const formattedDate = formatDate({date: undefined, locale: 'en'});

    expect(formattedDate).toBeUndefined();
  });

  it('formats the date correctly for BC dates', () => {
    const date = new Date(-1000, 0, 1);

    const locale = 'en';

    const formattedDate = formatDate({date, locale});

    expect(formattedDate).toEqual('1000 BC');
  });
});
