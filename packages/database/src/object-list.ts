import {objectLists, objectItems} from './db/schema';
import {insertObjectItemSchema, insertObjectListSchema} from './db/validation';
import {sql} from 'drizzle-orm';
import {db} from './db/connection';
import {iriToHash} from './iri-to-hash';
import {DBQueryConfig, eq} from 'drizzle-orm';
import {ObjectList} from './db/types';

interface Option {
  withObjects?: boolean;
  limitObjects?: number;
  objectIri?: string;
}

export async function getByCommunityId(
  communityId: string,
  {withObjects, limitObjects, objectIri}: Option = {withObjects: false}
  // Explicitly set the return type, or else `objects` will not be included.
): Promise<ObjectList[]> {
  const options: DBQueryConfig = {};

  if (withObjects) {
    options.with = {
      objects: limitObjects ? {limit: limitObjects} : true,
    };
  }

  if (objectIri) {
    const objectId = iriToHash(objectIri);
    options.with = {
      objects: {
        where: (objectItems, {eq}) => eq(objectItems.objectId, objectId),
      },
    };
  }

  return db.query.objectLists.findMany({
    ...options,
    where: (objectLists, {eq}) => eq(objectLists.communityId, communityId),
  });
}

export async function countByCommunityId(communityId: string) {
  const result = await db
    .select({count: sql<number>`count(*)`})
    .from(objectLists)
    .where(eq(objectLists.communityId, communityId));

  // We assume that the aggregations with `count` always returns an array with one value that is an object with the count prop
  return result[0].count;
}

interface CreateProps {
  communityId: string;
  name: string;
  createdBy: string;
  description?: string;
}

export async function create({
  communityId,
  name,
  createdBy,
  description,
}: CreateProps) {
  const objectList = insertObjectListSchema.parse({
    communityId,
    name,
    description,
    createdBy,
  });

  return db.insert(objectLists).values(objectList);
}

interface AddObjectProps {
  objectListId: number;
  objectIri: string;
  createdBy: string;
}

export async function addObject({
  objectListId,
  objectIri,
  createdBy,
}: AddObjectProps) {
  const objectItem = insertObjectItemSchema.parse({
    objectListId,
    objectIri,
    createdBy,
    objectId: iriToHash(objectIri),
  });

  return db.insert(objectItems).values(objectItem);
}

export async function removeObject(id: number) {
  return db.delete(objectItems).where(eq(objectItems.id, id));
}
