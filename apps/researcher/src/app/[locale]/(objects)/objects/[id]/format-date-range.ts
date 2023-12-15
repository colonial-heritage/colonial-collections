interface Props {
  startDate?: Date;
  endDate?: Date;
  locale: string;
}

export function formatDateRange({startDate, endDate, locale}: Props) {
  if (!startDate && !endDate) {
    return undefined;
  }

  const dateTimeFormat = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  });

  if (!startDate) {
    return dateTimeFormat.format(endDate);
  }

  if (!endDate) {
    return dateTimeFormat.format(startDate);
  }

  return dateTimeFormat.formatRange(startDate, endDate);
}
