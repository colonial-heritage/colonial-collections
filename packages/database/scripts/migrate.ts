import {migrate} from 'drizzle-orm/mysql2/migrator';
import {db} from '../src/db/connection';
import {exit} from 'node:process';

async function runMigrations() {
  try {
    await migrate(db, {
      migrationsFolder: './../database/migrations',
    });
    // [BUG]: `await migrate(..)` will keep process open.
    // Temporary fix: exit process manually.
    // https://github.com/drizzle-team/drizzle-orm/issues/1222
    exit(0);
  } catch (err) {
    console.error(err);
    exit(1);
  }
}

runMigrations();
