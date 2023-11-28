if (!process.env['NEXT_PUBLIC_COMMUNITY_ENRICHMENT_LICENSE']) {
  throw new Error(
    'NEXT_PUBLIC_COMMUNITY_ENRICHMENT_LICENSE is not defined or invalid in the environment'
  );
}

export const enrichmentLicence =
  process.env['NEXT_PUBLIC_COMMUNITY_ENRICHMENT_LICENSE'];
