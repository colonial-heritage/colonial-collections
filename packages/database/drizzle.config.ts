import type {Config} from 'drizzle-kit';
import {env} from 'node:process';

if (!env.DATABASE_URL) {
  throw new Error('`DATABASE_URL` environment variable is not set');
}

export default {
  schema: './src/db/schema.ts',
  out: './migrations',
  driver: 'mysql2',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
} satisfies Config;
