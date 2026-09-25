import { mysqlTable, int, varchar, boolean } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
    id: int('id').primaryKey().autoincrement(),
    firstName: varchar('firstName', { length: 255 }).notNull(),
    lastName: varchar('lastName', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password', { length: 255 }).notNull(),
    isEmailVerified: boolean('isEmailVerified').default(false).notNull(),
});