'use client';

import {useFormatter, useTranslations} from 'next-intl';
import {createFormatter} from './create-formatter';

export function useFormatDate(): ReturnType<typeof createFormatter> {
  const t = useTranslations('FormatDate');
  const formatter = useFormatter();

  return createFormatter({t, formatDateTime: formatter.dateTime});
}
