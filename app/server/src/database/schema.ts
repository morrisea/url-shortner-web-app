import {
  mysqlTable,
  int,
  varchar,
  boolean,
  timestamp,
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
