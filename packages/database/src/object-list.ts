import {objectLists, insertObjectItemSchema, objectItems} from './db/schema';
import {db} from './db/connection';
import {iriToHash} from './iri-to-hash';

async function getCommunityLists(communityId: string) {
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

interface getObjectItemProps {
  objectListId: number;
  objectIri: string;
}

async function getObjectItem({objectListId, objectIri}: getObjectItemProps) {
  const objectId = iriToHash(objectIri);

  return db.query.objectItems.findFirst({
    where: (objectItems, {and, eq}) =>
      and(
        eq(objectItems.objectListId, objectListId),
        eq(objectItems.objectId, objectId)
      ),
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
  objectListId: number;
  objectIri: string;
  createdBy: string;
}

async function addObjectToList({
  objectListId,
  objectIri,
  createdBy,
}: AddObjectToListProps) {
  const objectItem = insertObjectItemSchema.parse({
    objectListId,
    objectIri,
    createdBy,
    objectId: iriToHash(objectIri),
  });

  return db.insert(objectItems).values(objectItem);
}

export const objectList = {
  getCommunityLists,
  getCommunityListsWithObjects,
  createListForCommunity,
  addObjectToList,
  getObjectItem,
};
