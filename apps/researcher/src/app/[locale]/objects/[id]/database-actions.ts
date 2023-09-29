'use server';

import {getCommunityBySlug} from '@/lib/community';
import {objectList} from '@colonial-collections/database';
import {
  InsertObjectItem,
  SelectObjectList,
} from '@colonial-collections/database';
import {revalidatePath} from 'next/cache';

export async function getCommunityLists(
  communityId: string
): Promise<SelectObjectList[]> {
  return objectList.getByCommunityId(communityId);
}

interface AddObjectToListProps {
  listItem: InsertObjectItem;
  communityId: string;
}

export async function addObjectToList({
  listItem,
  communityId,
}: AddObjectToListProps) {
  const response = objectList.addObject(listItem);
  const community = await getCommunityBySlug(communityId);
  revalidatePath(`/[locale]/communities/${community.slug}`, 'page');

  return response;
}
