import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Pughal@123@localhost:5432/founderOS';

export const pgPool = new Pool({
  connectionString,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function checkPostgresConnection(): Promise<{ connected: boolean; mode: string; details?: string }> {
  try {
    const client = await pgPool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    return {
      connected: true,
      mode: 'Live PostgreSQL (founderOS)',
      details: `Connected at ${result.rows[0].now}`
    };
  } catch (err: any) {
    return {
      connected: false,
      mode: 'Mock Data Engine (Fallback)',
      details: err.message || 'PostgreSQL not responding on localhost:5432'
    };
  }
}

export function getDatabaseStatus() {
  return {
    connected: true,
    mode: 'PostgreSQL Database Configured (founderOS)',
    url: 'postgresql://postgres:****@localhost:5432/founderOS'
  };
}
