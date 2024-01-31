'use server';

import {getLocale, getTranslations} from 'next-intl/server';

export async function getDateFormatter() {
  const t = await getTranslations('FormatDate');
  const locale = await getLocale();
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formatDate = (date?: Date) => {
    if (!date) {
      return undefined;
    }

    const isBCE = date.getFullYear() < 0;

    if (isBCE) {
      // For dates before 0, we don't want to show the default 'BC' era label.
      // Instead, we want to show the date with the 'BCE' label.
      return t('beforeCommonEraFormat', {date});
    }

    return formatter.format(date);
  };

  return formatDate;
}
