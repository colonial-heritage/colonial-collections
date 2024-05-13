import {objectList} from '@colonial-collections/database';
import heritageObjects from '@/lib/heritage-objects-instance';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';

export async function getObjects(numberOfObject: number) {
  const response = await heritageObjects.search({
    locale: 'en',
    limit: numberOfObject,
  });

  return response.heritageObjects;
}

export async function resetDb(communityId: string) {
  const lists = await objectList.getByCommunityId(communityId);

  return Promise.all(lists.map(list => objectList.deleteList(list.id)));
}

export async function createEmptyList(communityId: string, userId: string) {
  // Create one test list
  const objectListInsert = await objectList.create({
    communityId: communityId,
    name: 'Test List 1',
    createdBy: userId,
    description:
      'This list is used for end-to-end testing; please do not remove or use this list',
  });

  return objectListInsert[0].insertId;
}

interface AddObjectsToListProps {
  numberOfObject: number;
  listId: number;
  userId: string;
}

export async function addObjectsToList({
  numberOfObject,
  listId,
  userId,
}: AddObjectsToListProps) {
  const objects = await getObjects(numberOfObject);

  await Promise.all(
    objects.map(async object =>
      objectList.addObject({
        objectListId: listId,
        objectIri: object.id,
        createdBy: userId,
      })
    )
  );

  return null;
}

export async function getObjectUrl() {
  const objects = await getObjects(1);

  return `/en/objects/${encodeRouteSegment(objects[0].id)}`;
}
