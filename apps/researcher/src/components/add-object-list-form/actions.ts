'use server';

import {getCommunityById} from '@/lib/community';
import {objectList} from '@colonial-collections/database';
import {revalidatePath} from 'next/cache';

interface ListItem {
  communityId: string;
  createdBy: string;
  name: string;
  description?: string;
}
export async function addList(listItem: ListItem) {
  await objectList.create(listItem);
  const community = await getCommunityById(listItem.communityId);
  revalidatePath(`/[locale]/communities/${community.slug}`, 'page');
}
