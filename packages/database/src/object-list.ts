import {objectLists, insertObjectItemSchema, objectItems} from './db/schema';
import {db} from './db/connection';
import {iriToHash} from './iri-to-hash';

async function getListsByCommunityId(communityId: string) {
  return db.query.objectLists.findMany({
    where: (objectLists, {eq}) => eq(objectLists.communityId, communityId),
  });
}

interface GetCommunityListsWithObjectsProps {
  communityId: string;
  limitObjects?: number;
}

async function getCommunityListsWithObjects({
  communityId,
  limitObjects,
}: GetCommunityListsWithObjectsProps) {
  const objectOptions = limitObjects ? {limit: limitObjects} : true;

  return db.query.objectLists.findMany({
    where: (objectLists, {eq}) => eq(objectLists.communityId, communityId),
    with: {
      objects: objectOptions,
    },
  });
}

interface CreateListForCommunityProps {
  communityId: string;
  createdBy: string;
  name: string;
  description?: string;
}

async function createListForCommunity({
  communityId,
  name,
  description,
  createdBy,
}: CreateListForCommunityProps) {
  return db.insert(objectLists).values({
    communityId,
    name,
    description,
    createdBy,
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
