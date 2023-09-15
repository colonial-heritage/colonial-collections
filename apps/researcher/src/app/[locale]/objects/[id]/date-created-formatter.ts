import {TimeSpan} from '@/lib/api/definitions';

export function dateCreatedFormatter(dateCreated: TimeSpan, locale: string) {
  if (!dateCreated.startDate && !dateCreated.endDate) {
    return undefined;
  }

  const dateTimeFormat = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  });

  if (!dateCreated.startDate) {
    return dateTimeFormat.format(dateCreated.endDate);
  }

  if (!dateCreated.endDate) {
    return dateTimeFormat.format(dateCreated.startDate);
  }

  return dateTimeFormat.formatRange(dateCreated.startDate, dateCreated.endDate);
}
