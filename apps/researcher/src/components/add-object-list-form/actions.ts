'use server';

import {getCommunityById} from '@/lib/community/actions';
import {objectList} from '@colonial-collections/database';
import {revalidatePath} from 'next/cache';

interface List {
  communityId: string;
  createdBy: string;
  name: string;
  description?: string;
}

export async function addList(list: List) {
  await objectList.create(list);
  const community = await getCommunityById(list.communityId);
  revalidatePath(`/[locale]/communities/${community.slug}`, 'page');
}
