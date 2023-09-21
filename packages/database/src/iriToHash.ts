import crypto from 'crypto';

export function iriToHash(iri: string) {
  const hash = crypto.createHash('md5');
  hash.update(iri);
  return hash.digest('hex');
}
