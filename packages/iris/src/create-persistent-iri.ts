import crypto from 'node:crypto';

// ARK with the NAAN identifier of the Colonial Collections Consortium
const IRI_PREFIX = 'https://n2t.net/ark:/27023/';

export function createPersistentIri() {
  const uuid = crypto.randomUUID();
  const md5 = crypto.createHash('md5').update(uuid).digest('hex');

  return `${IRI_PREFIX}${md5}`;
}
