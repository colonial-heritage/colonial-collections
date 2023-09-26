import {objectLists, objectItems, insertObjectItemSchema} from './db/schema';
import {InferSelectModel} from 'drizzle-orm';
import {db} from './db/connection';
import {iriToHash} from './iri-to-hash';
import {DBQueryConfig} from 'drizzle-orm';

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
