import { defineConfig } from 'drizzle-kit';
import { dbConfig } from './src/config/db.conf.js'

export default defineConfig({
  schema: './src/database/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: dbConfig.url,
  },
});