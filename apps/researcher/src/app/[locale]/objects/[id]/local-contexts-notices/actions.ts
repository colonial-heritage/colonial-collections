'use server';

import {enrichmentLicence} from '@/lib/enrichment-licence';
import {creator} from '@/lib/enricher-instances';
import {revalidatePath} from 'next/cache';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import {LocalContextsNoticeEnrichmentType} from './mapping';

interface AddUserNoticeProps {
  type: LocalContextsNoticeEnrichmentType;
  description: string;
  inLanguage?: string;
  objectId: string;
  user: {
    id: string;
    name: string;
  };
  community: {
    id: string;
    name: string;
  };
}

export async function addUserNotice({
  type,
  description,
  inLanguage,
  objectId,
  user,
  community,
}: AddUserNoticeProps) {
  const enrichment = await creator.addLocalContextsNotice({
    type,
    description,
    inLanguage,
    about: objectId,
    pubInfo: {
      creator: {
        id: user.id,
        name: user.name,
        isPartOf: community.id ? community : undefined,
      },
      license: enrichmentLicence,
    },
  });

  revalidatePath(`/[locale]/objects/${encodeRouteSegment(objectId)}`, 'page');

  return enrichment;
}
