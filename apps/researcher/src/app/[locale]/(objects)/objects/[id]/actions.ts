'use server';

import {getCommunityBySlug} from '@/lib/community/actions';
import {objectList} from '@colonial-collections/database';
import {ObjectItemBeingCreated} from '@colonial-collections/database';
import {revalidatePath} from 'next/cache';
import {creator} from '@/lib/enricher-instances';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import {enrichmentLicence} from '@/lib/enrichment-licence';
import {AdditionalType} from '@colonial-collections/enricher/src/definitions';

export async function getCommunityLists(communityId: string, objectId: string) {
  return objectList.getByCommunityId(communityId, {objectIri: objectId});
}

interface AddObjectToListProps {
  objectItem: ObjectItemBeingCreated;
  communityId: string;
}

export async function addObjectToList({
  objectItem,
  communityId,
}: AddObjectToListProps) {
  const addObjectPromise = objectList.addObject(objectItem);
  const getCommunityPromise = getCommunityBySlug(communityId);
  const [community] = await Promise.all([
    getCommunityPromise,
    addObjectPromise,
  ]);

  revalidatePath(`/[locale]/communities/${community.slug}`, 'page');
}

export async function removeObjectFromList(id: number, communityId: string) {
  await objectList.removeObject(id);
  const community = await getCommunityBySlug(communityId);
  revalidatePath(`/[locale]/communities/${community.slug}`, 'page');
}

interface AddUserEnrichmentProps {
  description: string;
  citation: string;
  inLanguage: string;
  community: {name: string; id: string};
  objectId: string;
  additionalType: AdditionalType;
}

export async function addUserEnrichment({
  additionalType,
  description,
  citation,
  inLanguage,
  community,
  objectId,
}: AddUserEnrichmentProps) {
  const enrichment = await creator.addText({
    additionalType,
    description,
    citation,
    inLanguage,
    about: objectId,
    creator: community,
    license: enrichmentLicence,
  });

  revalidatePath(`/[locale]objects/${encodeRouteSegment(objectId)}`, 'page');

  return enrichment;
}
