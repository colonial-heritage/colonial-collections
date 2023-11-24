'use server';

import {env} from 'node:process';

if (!env['COMMUNITY_ENRICHMENT_LICENSE']) {
  throw new Error(
    'COMMUNITY_ENRICHMENT_LICENSE is not defined or invalid in the environment'
  );
}

export const enrichmentLicence = env['COMMUNITY_ENRICHMENT_LICENSE'];
