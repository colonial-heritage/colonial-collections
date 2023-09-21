'use server';

import {objectLists, insertObjectItemSchema, objectItems} from './db/schema';
import {db} from './db/connection';
import {iriToHash} from './iri-to-hash';

async function getListsByCommunityId(communityId: string) {
  return db.query.objectLists.findMany({
    where: (objectLists, {eq}) => eq(objectLists.communityId, communityId),
  });
}

async function getCommunityListsWithObjects(communityId: string) {
  return db.query.objectLists.findMany({
    where: (objectLists, {eq}) => eq(objectLists.communityId, communityId),
    with: {
      objects: true,
    },
  });
}

interface CreateListForCommunityProps {
  communityId: string;
  userId: string;
  name: string;
  description: string;
}

async function createListForCommunity({
  communityId,
  name,
  description,
  userId,
}: CreateListForCommunityProps) {
  return db.insert(objectLists).values({
    communityId,
    name,
    description,
    createdBy: userId,
  });
}

interface AddObjectToListProps {
  listId: number;
  objectIri: string;
  userId: string;
}

async function addObjectToList({
  listId,
  objectIri,
  userId,
}: AddObjectToListProps) {
  const objectItem = insertObjectItemSchema.parse({
    listId,
    objectIri,
    createdBy: userId,
    objectId: iriToHash(objectIri),
  });

  return db.insert(objectItems).values(objectItem);
}

export const objectList = {
  getListsByCommunityId,
  getCommunityListsWithObjects,
  createListForCommunity,
  addObjectToList,
};
