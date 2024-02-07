'use client';

import {useFormatter, useTranslations} from 'next-intl';
import {createFormatter} from './create-formatter';
import {useMemo} from 'react';

export function useDateFormatter(): ReturnType<typeof createFormatter> {
  const t = useTranslations('FormatDate');
  const formatter = useFormatter();

  return useMemo(
    () => createFormatter({t, formatDateTime: formatter.dateTime}),
    [formatter.dateTime, t]
  );
}
