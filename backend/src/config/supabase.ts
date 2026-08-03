import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseKey && 
    !supabaseUrl.includes('your-project-ref') &&
    !supabaseKey.includes('your-supabase')
  );
};

export const supabaseServer: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false
      }
    })
  : null;

export async function checkSupabaseApiConnection(): Promise<{ configured: boolean; connected: boolean; details: string }> {
  if (!isSupabaseConfigured() || !supabaseServer) {
    return {
      configured: false,
      connected: false,
      details: 'Supabase URL / Key environment variables not configured'
    };
  }

  try {
    // Attempt a lightweight ping query via Supabase client
    const { error } = await supabaseServer.from('_prisma_migrations').select('count', { count: 'exact', head: true });
    // Even if table doesn't exist, a 404 or table error from Supabase means API connection succeeded
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      // PGRST errors like table not found still mean REST API connection is active
      if (error.message.includes('FetchError') || error.message.includes('Failed to fetch')) {
        return { configured: true, connected: false, details: error.message };
      }
    }
    return {
      configured: true,
      connected: true,
      details: `Successfully connected to Supabase API at ${supabaseUrl}`
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      details: err.message || 'Failed to connect to Supabase API'
    };
  }
}
