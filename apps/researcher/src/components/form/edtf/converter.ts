export function toDateString(yyyy = '', mm = '', dd = ''): string {
  if (yyyy === '' && mm === '' && dd === '') {
    return '';
  }

  const yyyyPadded =
    yyyy.charAt(0) === '-'
      ? `-${yyyy.substring(1).padStart(4, '0')}`
      : yyyy.padStart(4, '0');
  const mmPadded = mm.padStart(2, '0');
  const ddPadded = dd.padStart(2, '0');

  if (ddPadded === '00' && mmPadded === '00') return yyyyPadded;
  if (ddPadded === '00') return `${yyyyPadded}-${mmPadded}`;
  if (mmPadded === '00') return yyyyPadded;
  return `${yyyyPadded}-${mmPadded}-${ddPadded}`;
}

export function fromDateString(dateString: string): {
  yyyy: string;
  mm: string;
  dd: string;
} {
  const parts = dateString.split(/(?<=^-?\d{1,4}|\d{2})-/);
  let yyyy = parts[0] || '';
  if (yyyy.startsWith('-')) {
    yyyy = '-' + yyyy.slice(1).replace(/^0+/, '');
  } else {
    yyyy = yyyy.replace(/^0+/, '');
  }
  return {
    yyyy,
    mm: parts[1]?.replace(/^0+/, '') || '',
    dd: parts[2]?.replace(/^0+/, '') || '',
  };
}
