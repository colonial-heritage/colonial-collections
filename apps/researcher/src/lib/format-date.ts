interface Props {
  date?: Date;
  locale: string;
}

export function formatDate({date, locale}: Props) {
  if (!date) {
    return undefined;
  }

  const isBC = date.getFullYear() < 0;

  const dateTimeFormat = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: isBC ? undefined : 'long',
    day: isBC ? undefined : 'numeric',
    era: isBC ? 'short' : undefined,
  });

  return dateTimeFormat.format(date);
}
