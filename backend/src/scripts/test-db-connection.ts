import { checkPostgresConnection, getDatabaseStatus } from '../config/db';
import { checkSupabaseApiConnection, isSupabaseConfigured } from '../config/supabase';

async function runConnectionTests() {
  console.log('--------------------------------------------------');
  console.log('🔍 FounderOS Supabase & PostgreSQL Diagnostics');
  console.log('--------------------------------------------------');

  const config = getDatabaseStatus();
  console.log(`📌 Configured Database URL: ${config.url}`);
  console.log(`📌 Database Provider: ${config.provider}`);
  console.log(`📌 Supabase Credentials Configured: ${isSupabaseConfigured()}`);
  console.log('--------------------------------------------------');

  console.log('\n📡 Testing PostgreSQL Direct/Pooled Connection...');
  const pgResult = await checkPostgresConnection();
  if (pgResult.connected) {
    console.log(`✅ [SUCCESS] ${pgResult.mode}`);
    console.log(`   Details: ${pgResult.details}`);
  } else {
    console.log(`❌ [FAILED] ${pgResult.mode}`);
    console.log(`   Reason: ${pgResult.details}`);
  }

  console.log('\n⚡ Testing Supabase JS Client API Connection...');
  const sbResult = await checkSupabaseApiConnection();
  if (sbResult.connected) {
    console.log(`✅ [SUCCESS] Supabase API Connected`);
    console.log(`   Details: ${sbResult.details}`);
  } else {
    console.log(`ℹ️ [STATUS] Supabase API: ${sbResult.details}`);
  }

  console.log('\n--------------------------------------------------');
  process.exit(0);
}

runConnectionTests().catch((err) => {
  console.error('Fatal error running connection tests:', err);
  process.exit(1);
});
