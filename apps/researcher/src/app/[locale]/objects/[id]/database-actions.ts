'use server';

import {objectList} from '@colonial-collections/database';
import {
  InsertObjectItem,
  SelectObjectList,
} from '@colonial-collections/database';

export async function getCommunityLists(
  communityId: string
): Promise<SelectObjectList[]> {
  return objectList.getByCommunityId(communityId);
}

export async function addObjectToList(listItem: InsertObjectItem) {
  return objectList.addObject(listItem);
}
