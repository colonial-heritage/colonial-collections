'use server';

import {objectList} from '@colonial-collections/database';
import {
  InsertObjectItem,
  SelectObjectList,
} from '@colonial-collections/database';

export async function getCommunityLists(
  communityId: string
): Promise<SelectObjectList[]> {
  return objectList.getCommunityLists(communityId);
}

export async function addObjectToList(listItem: InsertObjectItem) {
  const objectItem = await objectList.getObjectItem(listItem);

  if (objectItem) {
    return {
      statusCode: 422,
    };
  }

  try {
    objectList.addObjectToList(listItem);
    return {
      statusCode: 200,
    };
  } catch (err) {
    return {
      statusCode: 500,
    };
  }
}
