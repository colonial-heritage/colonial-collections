import {migrate} from 'drizzle-orm/mysql2/migrator';
import {db} from '../src/db/connection';
import {exit} from 'node:process';

async function runMigrations() {
  try {
    await migrate(db, {
      migrationsFolder: './../database/migrations',
    });
    exit();
  } catch (err) {
    console.error(err);
    exit(1);
  }
}

runMigrations();
