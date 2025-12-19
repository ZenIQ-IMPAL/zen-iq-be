import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../database/schema';
import { env } from './env';

const sql = neon(env.DATABASE_URL);
sql`SET timezone = 'Asia/Jakarta'`;
export const db = drizzle(sql, { schema });
