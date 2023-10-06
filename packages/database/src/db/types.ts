import {InferSelectModel, InferInsertModel} from 'drizzle-orm';
import {objectLists, objectItems} from './schema';

export interface SelectObjectList extends InferSelectModel<typeof objectLists> {
  objects?: InferSelectModel<typeof objectItems>[];
}
export type InsertObjectList = InferInsertModel<typeof objectLists>;

export type SelectObjectItem = InferSelectModel<typeof objectItems>;
export type InsertObjectItem = Omit<
  InferInsertModel<typeof objectItems>,
  'objectId'
>;
