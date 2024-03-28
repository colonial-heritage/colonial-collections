import edtf from 'edtf';

export enum DateType {
  StartDate,
  EndDate,
}

export function getDateAsXsd(dateValue: string, dateType: DateType) {
  const edtfDate = edtf(dateValue);
  const minOrMaxDate =
    dateType === DateType.StartDate ? edtfDate.min : edtfDate.max;
  const date = new Date(minOrMaxDate); // E.g. 1805 = 1805-01-01 (start date) or 1805-12-31 (end date)
  const xsdDate = date.toISOString().slice(0, 10); // From e.g. "1805-12-31T23:59:59.000Z" to "1805-12-31"

  return xsdDate;
}
