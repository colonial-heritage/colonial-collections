'use server';

import {getCommunityBySlug} from '@/lib/community/actions';
import {objectList} from '@colonial-collections/database';
import {ObjectItemBeingCreated} from '@colonial-collections/database';
import {revalidatePath} from 'next/cache';

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
