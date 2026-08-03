import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://xyz-your-supabase-app.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-key';

export const supabaseClient = createClient(supabaseUrl, supabaseKey);

export function getDatabaseStatus() {
  return {
    connected: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    mode: process.env.SUPABASE_URL ? 'Live Supabase DB' : 'Mock Engine Mode'
  };
}
