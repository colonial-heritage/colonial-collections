import {InferSelectModel, InferInsertModel} from 'drizzle-orm';
import {objectLists, objectItems} from './schema';

export type SelectObjectList = InferSelectModel<typeof objectLists>;
export type InsertObjectList = InferInsertModel<typeof objectLists>;

export type SelectObjectItem = InferSelectModel<typeof objectItems>;
export type InsertObjectItem = Omit<
  InferInsertModel<typeof objectItems>,
  'objectId'
>;
