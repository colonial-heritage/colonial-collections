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
export async function addList(
  listItem: ListItem
): Promise<{statusCode: number}> {
  try {
    const community = await getCommunityById(listItem.communityId);
    await objectList.createListForCommunity(listItem);
    revalidatePath(`/[locale]/communities/${community.slug}`);

    return {statusCode: 200};
  } catch (err) {
    return {statusCode: 500};
  }
}
