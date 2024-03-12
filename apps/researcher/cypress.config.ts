import {defineConfig} from 'cypress';
import {objectList} from '@colonial-collections/database';
import heritageObjects from '@/lib/heritage-objects-instance';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import {env} from 'node:process';

async function getObjects(numberOfObject: number) {
  const response = await heritageObjects.search({
    locale: 'en',
    limit: numberOfObject,
  });

  return response.heritageObjects;
}

export default defineConfig({
  // Desktop
  viewportWidth: 1536,
  viewportHeight: 960,
  defaultCommandTimeout: 8000,
  e2e: {
    baseUrl: 'http://localhost:3001',
    setupNodeEvents(on) {
      on('task', {
        async resetDb() {
          const lists = await objectList.getByCommunityId(
            env.TEST_COMMUNITY_ID!
          );

          return Promise.all(lists.map(list => objectList.deleteList(list.id)));
        },
        async createEmptyList() {
          // Create one test list
          const objectListInsert = await objectList.create({
            communityId: env.TEST_COMMUNITY_ID!,
            name: 'Test List 1',
            createdBy: env.TEST_USER_ID!,
            description:
              'This list is used for end-to-end testing; please do not remove or use this list',
          });

          return objectListInsert[0].insertId;
        },
        async addObjectsToList({numberOfObject, listId}) {
          const objects = await getObjects(numberOfObject);

          await Promise.all(
            objects.map(async object =>
              objectList.addObject({
                objectListId: listId,
                objectIri: object.id,
                createdBy: env.TEST_USER_ID!,
              })
            )
          );

          return null;
        },
        async getObjectUrl() {
          const objects = await getObjects(1);

          return `/en/objects/${encodeRouteSegment(objects[0].id)}`;
        },
      });
    },
  },
  video: true,
});
