'use client';

import {useFormatter, useTranslations} from 'next-intl';
import {createFormatter} from './create-formatter';

export function useFormatDate(): ReturnType<typeof createFormatter> {
  const t = useTranslations('FormatDate');
  const format = useFormatter();

  return createFormatter({t, formatDateTime: format.dateTime});
}
