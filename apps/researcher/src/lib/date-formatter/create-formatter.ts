import {DateTimeFormatOptions, TranslationValues} from 'next-intl';

interface FormatterProps {
  t: (key: string, options?: TranslationValues) => string;
  formatDateTime: (date: Date, options: DateTimeFormatOptions) => string;
}

interface FormatDateRangeProps {
  startDate?: Date;
  endDate?: Date;
}

export const dateFormatSettings: DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export function formatDate({
  date,
  t,
  formatDateTime,
}: FormatterProps & {
  date?: Date;
}) {
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

  const formattedDate = formatDateTime(date, dateFormatSettings);

  return formattedDate;
}

interface FormatDateRangeProps {
  startDate?: Date;
  endDate?: Date;
}

export function formatDateRange({
  startDate,
  endDate,
  t,
  formatDateTime,
}: FormatDateRangeProps & FormatterProps) {
  if (!startDate && !endDate) {
    return t('noDateRange');
  }

  const startDateFormatted = startDate
    ? formatDate({date: startDate, t, formatDateTime})
    : t('noStartDate');
  const endDateFormatted = endDate
    ? formatDate({date: endDate, t, formatDateTime})
    : t('noEndDate');

  if (startDateFormatted === endDateFormatted) {
    return startDateFormatted as string;
  }

  return `${startDateFormatted} – ${endDateFormatted}`;
}

export function createFormatter({t, formatDateTime}: FormatterProps) {
  return {
    formatDate: (date: Date) => formatDate({date, t, formatDateTime}),
    formatDateRange: ({startDate, endDate}: FormatDateRangeProps) =>
      formatDateRange({startDate, endDate, t, formatDateTime}),
  };
}
