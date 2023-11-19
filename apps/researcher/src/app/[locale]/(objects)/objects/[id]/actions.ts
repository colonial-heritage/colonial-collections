'use server';

import {getCommunityBySlug} from '@/lib/community/actions';
import {objectList} from '@colonial-collections/database';
import {ObjectItemBeingCreated} from '@colonial-collections/database';
import {revalidatePath} from 'next/cache';
import {storer} from '@/lib/enricher-instances';
import {env} from 'node:process';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';

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
  about: string;
  attributionId: string;
  objectId: string;
}

export async function addUserEnrichment({
  description,
  citation,
  about,
  attributionId,
  objectId,
}: AddUserEnrichmentProps) {
  const licence = env['NEXT_PUBLIC_COMMUNITY_ENRICHMENT_LICENSE'];

  if (!licence) {
    throw new Error('No community licence set in environment');
  }

  const enrichment = await storer.addText({
    description,
    citation,
    about,
    creator: attributionId,
    license: licence,
  });

  revalidatePath(`/[locale]objects/${encodeRouteSegment(objectId)}`, 'page');

  return enrichment;
}
