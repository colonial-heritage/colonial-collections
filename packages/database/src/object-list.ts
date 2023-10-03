import {objectLists, insertObjectItemSchema, objectItems} from './db/schema';
import {db} from './db/connection';
import {iriToHash} from './iri-to-hash';
import {DBQueryConfig} from 'drizzle-orm';

interface Option {
  withObjects?: boolean;
  limitObjects?: number;
}

export async function getByCommunityId(
  communityId: string,
  {withObjects, limitObjects}: Option = {withObjects: false}
) {
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
