import {getDateFormatter} from './get-format-date';
import {describe, expect, it} from '@jest/globals';
import {createTranslator} from 'next-intl';

const translate = createTranslator({
  locale: 'en',
  messages: {
    beforeCommonEraFormat: '{date, date, ::yyyy} BCE',
  },
});

jest.mock('next-intl/server', () => ({
  ...jest.requireActual('next-intl/server'),
  getTranslations: async () => new Promise(resolve => resolve(translate)),
  getLocale: async () => new Promise(resolve => resolve('en')),
}));

describe('getDateFormatter', () => {
  it('formats date correctly', async () => {
    const formatDate = await getDateFormatter();
    const date = new Date('2022-01-01');
    const formattedDate = formatDate(date);

    expect(formattedDate).toBe('Jan 1, 2022');
  });

  it('returns undefined for empty date', async () => {
    const formatDate = await getDateFormatter();
    const formattedDate = formatDate(undefined);

    expect(formattedDate).toBeUndefined();
  });

  it('formats BCE date correctly', async () => {
    const formatDate = await getDateFormatter();
    const date = new Date('-001000-01-01');
    const formattedDate = formatDate(date);

    expect(formattedDate).toBe('1001 BCE');
  });
});
