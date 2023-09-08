'use server';

import {objectLists, objectListItems} from './db/schema';
import db from './db/connection';

export async function getAllCommunityLists(communityId: string) {
  return db.query.objectLists.findMany({
    where: (objectLists, {eq}) => eq(objectLists.communityId, communityId),
  });
}

export async function getAllCommunityListsWithObjects(communityId: string) {
  return db.query.objectLists.findMany({
    where: (objectLists, {eq}) => eq(objectLists.communityId, communityId),
    with: {
      objects: true,
    },
  });
}

interface createListForCommunityProps {
  communityId: string;
  userId: string;
  name: string;
  description: string;
}

export async function createListForCommunity({
  communityId,
  name,
  description,
  userId,
}: createListForCommunityProps) {
  return db.insert(objectLists).values({
    communityId,
    name,
    description,
    createdBy: userId,
  });
}

export interface AddObjectToListProps {
  listId: number;
  objectId: string;
  userId: string;
}

export async function addObjectToList({
  listId,
  objectId,
  userId,
}: AddObjectToListProps) {
  return db.insert(objectListItems).values({
    listId,
    objectId,
    createdBy: userId,
  });
}
