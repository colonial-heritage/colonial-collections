'use server';

import {getCommunityBySlug} from '@/lib/community';
import {objectList} from '@colonial-collections/database';
import {InsertObjectItem} from '@colonial-collections/database';
import {revalidatePath} from 'next/cache';

export async function getCommunityLists(communityId: string, objectId: string) {
  return objectList.getByCommunityId(communityId, {includeObjectIri: objectId});
}

interface AddObjectToListProps {
  listItem: InsertObjectItem;
  communityId: string;
}

export async function addObjectToList({
  listItem,
  communityId,
}: AddObjectToListProps) {
  await objectList.addObject(listItem);
  const community = await getCommunityBySlug(communityId);
  revalidatePath(`/[locale]/communities/${community.slug}`, 'page');
}

export async function removeObjectFromList(id: number, communityId: string) {
  await objectList.removeObject(id);
  const community = await getCommunityBySlug(communityId);
  revalidatePath(`/[locale]/communities/${community.slug}`, 'page');
}
