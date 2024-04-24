'use server';

import {revalidatePath} from 'next/cache';
import {creator} from '@/lib/enricher-instances';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import {enrichmentLicence} from '@/lib/enrichment-licence';
import {UserTypeOption, typeMapping} from '@/lib/provenance-options';
import {getTranslations} from 'next-intl/server';

interface AddProvenanceEnrichmentProps {
  citation: string;
  inLanguage?: string;
  objectId: string;
  user: {
    id: string;
    name: string;
  };
  type: {
    id: string;
    translationKey: string;
  };
  date: {
    startDate: string;
    endDate: string;
  };
  transferredFrom: {
    id: string;
    name: string;
  };
  transferredTo: {
    id: string;
    name: string;
  };
  location: {
    id: string;
    name: string;
  };
  community: {
    id: string;
    name: string;
  };
  qualifier: {
    id: string;
    translationKey: string;
  };
}

export async function addProvenanceEnrichment({
  citation,
  inLanguage,
  objectId,
  user,
  type,
  date,
  transferredFrom,
  transferredTo,
  location,
  community,
  qualifier,
}: AddProvenanceEnrichmentProps) {
  const tEnQualifier = await getTranslations({
    locale: 'en',
    namespace: 'QualifierSelector',
  });

  const tEnType = await getTranslations({
    locale: 'en',
    namespace: 'ProvenanceEventType',
  });

  const enrichment = await creator.addProvenanceEvent({
    citation,
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
    type: typeMapping[type.id as UserTypeOption].type,
    additionalType: {
      id: typeMapping[type.id as UserTypeOption].additionalType,
      name: tEnType(type.translationKey),
    },
    date,
    transferredFrom: transferredFrom.id ? transferredFrom : undefined,
    transferredTo: transferredTo.id ? transferredTo : undefined,
    location: location.id ? location : undefined,
    qualifier: qualifier.id
      ? {
          id: qualifier.id,
          name: tEnQualifier(qualifier.translationKey),
        }
      : undefined,
  });

  revalidatePath(`/[locale]/objects/${encodeRouteSegment(objectId)}`, 'page');

  return enrichment;
}
