import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { env } from './env';
import * as schema from '../database/schema';

const sql = neon(env.DATABASE_URL);
sql`SET timezone = 'Asia/Jakarta'`;
export const db = drizzle(sql, { schema });