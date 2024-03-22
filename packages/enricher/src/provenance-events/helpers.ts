import edtf from 'edtf';

function fromStringToEdtf(dateValue: string | undefined) {
  if (dateValue !== undefined) {
    try {
      return edtf(dateValue);
    } catch (err) {
      // Ignore invalid dates
    }
  }

  return undefined;
}

export function getStartDateAsXsd(dateValue: string | undefined) {
  const edtfDate = fromStringToEdtf(dateValue);

  if (edtfDate !== undefined) {
    const date = new Date(edtfDate.min); // E.g. 1881 = 1881-01-01
    const xsdDate = date.toISOString().slice(0, 10); // From e.g. "1881-01-01T00:00:00.000Z" to "1881-01-01"

    return xsdDate;
  }

  return undefined;
}

export function getEndDateAsXsd(dateValue: string | undefined) {
  const edtfDate = fromStringToEdtf(dateValue);

  if (edtfDate !== undefined) {
    const date = new Date(edtfDate.max); // E.g. 1805 = 1805-12-31
    const xsdDate = date.toISOString().slice(0, 10); // From e.g. "1805-12-31T23:59:59.000Z" to "1805-12-31"

    return xsdDate;
  }

  return undefined;
}
