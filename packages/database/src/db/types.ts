import {InferSelectModel, InferInsertModel} from 'drizzle-orm';
import {objectLists, objectItems} from './schema';

export interface ObjectList extends InferSelectModel<typeof objectLists> {
  objects?: InferSelectModel<typeof objectItems>[];
}
export type ObjectListsBeingCreated = InferInsertModel<typeof objectLists>;

export type ObjectItem = InferSelectModel<typeof objectItems>;
export type ObjectItemBeingCreated = Omit<
  InferInsertModel<typeof objectItems>,
  'objectId'
>;
