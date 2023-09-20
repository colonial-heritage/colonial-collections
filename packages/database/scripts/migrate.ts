import {migrate} from 'drizzle-orm/mysql2/migrator';
import db from '../src/db/connection';
import {exit} from 'node:process';

async function runMigrations() {
  try {
    await migrate(db, {
      migrationsFolder: './../database/migrations',
    });
    exit();
  } catch (e) {
    console.error(e);
    exit(1);
  }
}

runMigrations();
