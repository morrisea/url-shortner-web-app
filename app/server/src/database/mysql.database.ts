import { dbConfig } from '../config/db.conf.js';
import { drizzle } from 'drizzle-orm/mysql2';

export const db = drizzle(dbConfig.url!);
