'use server';

import {revalidatePath} from 'next/cache';
import {creator} from '@/lib/enricher-instances';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import {enrichmentLicence} from '@/lib/enrichment-licence';
import {UserTypeOption, typeMapping} from './type-mapping';

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
    name: string;
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
}: AddProvenanceEnrichmentProps) {
  const enrichment = await creator.addProvenanceEvent({
    citation,
    inLanguage,
    about: objectId,
    pubInfo: {
      creator: user,
      license: enrichmentLicence,
    },
    type: typeMapping[type.id as UserTypeOption].type,
    additionalType: {
      id: typeMapping[type.id as UserTypeOption].additionalType,
      name: type.name,
    },
    date,
    transferredFrom: transferredFrom.id ? transferredFrom : undefined,
    transferredTo: transferredTo.id ? transferredTo : undefined,
    location: location.id ? location : undefined,
  });

  revalidatePath(`/[locale]/objects/${encodeRouteSegment(objectId)}`, 'page');

  return enrichment;
}
