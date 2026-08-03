import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Pughal@123@localhost:5432/founderOS';

const isRemoteOrSupabase = 
  connectionString.includes('supabase.co') || 
  connectionString.includes('supabase.com') || 
  connectionString.includes('pooler.supabase.com') || 
  process.env.NODE_ENV === 'production';

export const pgPool = new Pool({
  connectionString,
  ssl: isRemoteOrSupabase ? { rejectUnauthorized: false } : false,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
});

export async function checkPostgresConnection(): Promise<{ connected: boolean; mode: string; details?: string; host?: string }> {
  const isSupabase = connectionString.includes('supabase');
  const targetMode = isSupabase ? 'Supabase PostgreSQL' : 'PostgreSQL Database';
  
  try {
    const client = await pgPool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    return {
      connected: true,
      mode: `Live ${targetMode} (founderOS)`,
      details: `Connected successfully at ${result.rows[0].now}`
    };
  } catch (err: any) {
    return {
      connected: false,
      mode: 'Mock Data Engine (Fallback)',
      details: err.message || 'PostgreSQL database not responding'
    };
  }
}

export function getDatabaseStatus() {
  const isSupabase = connectionString.includes('supabase');
  const sanitizedUrl = connectionString.replace(/:[^:@]+@/, ':****@');
  
  return {
    configured: Boolean(process.env.DATABASE_URL),
    provider: isSupabase ? 'Supabase PostgreSQL' : 'Local PostgreSQL',
    url: sanitizedUrl
  };
}
