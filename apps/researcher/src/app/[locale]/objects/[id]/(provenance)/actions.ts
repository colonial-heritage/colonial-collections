'use server';

import {revalidatePath} from 'next/cache';
import {creator} from '@/lib/enricher-instances';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import {enrichmentLicence} from '@/lib/enrichment-licence';
import {ProvenanceEventType} from '@colonial-collections/api';

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
  additionalType: {
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
  additionalType,
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
    type: type.id as ProvenanceEventType,
    additionalType: additionalType.id ? additionalType : undefined,
    date,
    transferredFrom: transferredFrom.id ? transferredFrom : undefined,
    transferredTo: transferredTo.id ? transferredTo : undefined,
    location: location.id ? location : undefined,
  });

  revalidatePath(`/[locale]/objects/${encodeRouteSegment(objectId)}`, 'page');

  return enrichment;
}
