import edtf from 'edtf';

export function isEdtf(date: string) {
  try {
    edtf(date);
    return true;
  } catch (err) {
    return false;
  }
}
