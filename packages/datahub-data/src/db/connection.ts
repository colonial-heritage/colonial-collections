import {Mode} from 'drizzle-orm/mysql-core';
import * as schema from './schema';
import {drizzle} from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import {env} from 'node:process';

const poolConnection = mysql.createPool({
  uri: env['DATABASE_URL'],
});

export default drizzle(poolConnection, {
  schema,
  mode: (env['DATABASE_MODE'] || 'default') as Mode,
});
