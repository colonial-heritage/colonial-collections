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
    name: varchar('name', {length: 256}),
    description: text('description'),
    communityId: varchar('community_id', {length: 256}),
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
  objects: many(objectListItems),
}));

export const objectListItems = mysqlTable(
  'object_list_item',
  {
    id: serial('id').primaryKey(),
    objectId: varchar('object_id', {length: 256}).notNull(),
    listId: int('list_id'),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    createdBy: varchar('created_by', {length: 256}).notNull(),
  },
  item => ({
    objectId: index('object_id').on(item.objectId),
    listId: index('list_id').on(item.listId),
    unique: unique().on(item.objectId, item.listId),
  })
);

export const objectListItemsRelations = relations(objectListItems, ({one}) => ({
  list: one(objectLists, {
    fields: [objectListItems.listId],
    references: [objectLists.id],
  }),
}));
