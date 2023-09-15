import type {Config} from 'drizzle-kit';
import {env} from 'node:process';

export default {
  schema: './src/db/schema.ts',
  out: './migrations',
  driver: 'mysql2',
  dbCredentials: {
    connectionString: env['DATABASE_URL'] || '',
  },
} satisfies Config;
