import {
  mysqlTable,
  int,
  varchar,
  boolean,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  isEmailVerified: boolean('is_email_verified').default(false).notNull(),
  creationDate: timestamp('creation_date').notNull().defaultNow(),
});

export const multiFactor = mysqlTable('multi_factor', {
  id: int('id').primaryKey().autoincrement(),
  code: varchar('code', { length: 8 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
});

export const urls = mysqlTable('urls', {
  id: int('id').primaryKey().autoincrement(),
  address: varchar('address', { length: 2048 }).notNull(),
  addressHash: varchar('address_hash', { length: 64 }).notNull().unique(),
  redirect: varchar('redirect', { length: 16 }).notNull().unique(),
  creationDate: timestamp('creation_date').notNull().defaultNow(),
});

export const savedURLs = mysqlTable(
  'saved_urls',
  {
    userId: int('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    urlId: int('url_id')
      .notNull()
      .references(() => urls.id, { onDelete: 'cascade' }),
    creationDate: timestamp('creation_date').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('saved_urls_user_url_idx').on(table.userId, table.urlId),
  ],
);
