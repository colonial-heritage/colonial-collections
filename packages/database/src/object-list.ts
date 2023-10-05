import {objectLists, objectItems, insertObjectItemSchema} from './db/schema';
import {InferSelectModel, sql} from 'drizzle-orm';
import {db} from './db/connection';
import {iriToHash} from './iri-to-hash';
import {DBQueryConfig, eq} from 'drizzle-orm';

interface Option {
  withObjects?: boolean;
  limitObjects?: number;
}

interface ObjectList extends InferSelectModel<typeof objectLists> {
  objects?: InferSelectModel<typeof objectItems>[];
}

export async function getByCommunityId(
  communityId: string,
  {withObjects, limitObjects}: Option = {withObjects: false}
): Promise<ObjectList[]> {
  const options: DBQueryConfig = {};

  if (withObjects) {
    options.with = {
      objects: limitObjects ? {limit: limitObjects} : true,
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
  return db.insert(objectLists).values({
    communityId,
    name,
    description,
    createdBy,
  });
}

interface AddObjectProps {
  listId: number;
  objectIri: string;
  userId: string;
}

export async function addObject({listId, objectIri, userId}: AddObjectProps) {
  const objectItem = insertObjectItemSchema.parse({
    listId,
    objectIri,
    createdBy: userId,
    objectId: iriToHash(objectIri),
  });

  return db.insert(objectItems).values(objectItem);
}
