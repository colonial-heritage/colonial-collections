import {createInsertSchema} from 'drizzle-zod';
import {objectItems, objectLists} from './schema';

export const insertObjectListSchema = createInsertSchema(objectLists, {
  name: schema => schema.name.trim().min(1),
});

export const insertObjectItemSchema = createInsertSchema(objectItems);
