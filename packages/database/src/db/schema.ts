import {
  index,
  timestamp,
  mysqlTable,
  serial,
  varchar,
  text,
  unique,
  int,
} from 'drizzle-orm/mysql-core';
import {sql, relations} from 'drizzle-orm';

export const objectLists = mysqlTable(
  'object_list',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', {length: 256}).notNull(),
    description: text('description'),
    communityId: varchar('community_id', {length: 50}),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    createdBy: varchar('created_by', {length: 256}).notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow()
      .notNull(),
  },
  list => ({
    communityId: index('community_id').on(list.communityId),
  })
);

export const objectListsRelations = relations(objectLists, ({many}) => ({
  objects: many(objectItems),
}));

export const objectItems = mysqlTable(
  'object_item',
  {
    objectId: varchar('object_id', {length: 32}).primaryKey(),
    objectIri: text('object_iri').notNull(),
    objectListId: int('object_list_id'),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    // James from Clerk about the length of the user ID: You should store it to 50, but currently,
    // they are 32 and shouldn’t need to grow in length as they are a UUID based,
    // but you should increase it slightly just to be cautious.
    createdBy: varchar('created_by', {length: 50}).notNull(),
  },
  item => ({
    id: index('id').on(item.objectId),
    objectListId: index('object_list_id').on(item.objectListId),
    unique: unique().on(item.objectId, item.objectListId),
  })
);

export const objectItemsRelations = relations(objectItems, ({one}) => ({
  list: one(objectLists, {
    fields: [objectItems.objectListId],
    references: [objectLists.id],
  }),
}));
