import {getFormatter, getTranslations} from 'next-intl/server';
import {createFormatter} from './create-formatter';

export async function getFormatDate(): Promise<
  ReturnType<typeof createFormatter>
> {
  const t = await getTranslations('FormatDate');
  const format = await getFormatter();

  return createFormatter({t, formatDateTime: format.dateTime});
}
