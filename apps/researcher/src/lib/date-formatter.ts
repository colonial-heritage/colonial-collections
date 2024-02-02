'use server';

import {getLocale, getTranslations} from 'next-intl/server';

export async function getFormatDate() {
  const t = await getTranslations('FormatDate');
  const locale = await getLocale();
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return function formatDate(date?: Date) {
    if (!date) {
      return undefined;
    }

    const isBCE = date.getFullYear() < 0;

    if (isBCE) {
      /*
      For dates before 0, the default era label in English is the Christian label 'BC'.
      If languages contain a more inclusive label, we want to use that instead.
      Define custom formats for BCE dates in the translation file.
      For English: Follow the BBC. The BBC uses 'BCE' (Before Common Era)
      and 'CE' (Common Era) instead.
      For Dutch: Follow the NOS. The NOS uses the labels 'v.Chr.' (voor Christus)
      and 'n.Chr.' (na Christus).
      */
      return t('beforeCommonEraFormat', {date});
    }

    return formatter.format(date);
  };
}
