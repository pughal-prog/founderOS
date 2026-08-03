import { createClient } from '@supabase/supabase-js';

// Supabase Environment Credentials (reads from .env.local if provided)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyz-your-supabase-app.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-anon-key';

// Initialize Supabase Client Stub
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Connection Status Checker
export function isDatabaseConnected(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('xyz-your-supabase-app') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref')
  );
}

// Live Supabase Connection Checker
export async function checkSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  if (!isDatabaseConnected()) {
    return {
      connected: false,
      message: 'Supabase credentials not configured in frontend/.env.local'
    };
  }

  try {
    const { error } = await supabase.from('_prisma_migrations').select('count', { count: 'exact', head: true });
    if (error && (error.message?.includes('FetchError') || error.message?.includes('Failed to fetch'))) {
      return { connected: false, message: error.message };
    }
    return { connected: true, message: 'Connected to Supabase API' };
  } catch (err: any) {
    return { connected: false, message: err.message || 'Supabase connection error' };
  }
}
