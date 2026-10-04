import {
  mysqlTable,
  int,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  firstName: varchar('firstName', { length: 255 }).notNull(),
  lastName: varchar('lastName', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('passwordHash', { length: 255 }).notNull(),
  isEmailVerified: boolean('isEmailVerified').default(false).notNull(),
});

export const multiFactor = mysqlTable('multi_factor', {
  id: int('id').primaryKey().autoincrement(),
  code: varchar('code', { length: 8 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
});
