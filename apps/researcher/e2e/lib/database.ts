import {objectList} from '@colonial-collections/database';
import heritageObjects from '@/lib/heritage-objects-instance';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import {getTestCommunity, getTestUser} from './community';

export async function getObjects(numberOfObject: number) {
  const response = await heritageObjects.search({
    locale: 'en',
    limit: numberOfObject,
  });

  return response.heritageObjects;
}

export async function resetDb(communitySlug: string) {
  const community = await getTestCommunity(communitySlug);
  const lists = await objectList.getByCommunityId(community.id);

  return Promise.all(lists.map(list => objectList.deleteList(list.id)));
}

export async function createEmptyList(communitySlug: string) {
  const community = await getTestCommunity(communitySlug);
  const testUser = await getTestUser(community.id);

  // Create one test list
  const objectListInsert = await objectList.create({
    communityId: community.id,
    name: 'Test List 1',
    createdBy: testUser.id,
    description:
      'This list is used for end-to-end testing; please do not remove or use this list',
  });

  return objectListInsert[0].insertId;
}

interface AddObjectsToListProps {
  numberOfObject: number;
  listId: number;
  communitySlug: string;
}

export async function addObjectsToList({
  numberOfObject,
  listId,
  communitySlug,
}: AddObjectsToListProps) {
  const community = await getTestCommunity(communitySlug);
  const testUser = await getTestUser(community.id);
  const objects = await getObjects(numberOfObject);

  await Promise.all(
    objects.map(async object =>
      objectList.addObject({
        objectListId: listId,
        objectIri: object.id,
        createdBy: testUser.id,
      })
    )
  );

  return null;
}

export async function getObjectUrl() {
  const objects = await getObjects(1);

  return `/en/objects/${encodeRouteSegment(objects[0].id)}`;
}
