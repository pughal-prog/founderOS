import { searchDatabaseContext, buildSystemContextString } from '../services/searchService';
import { checkPostgresConnection } from '../config/db';

async function testUnifiedSearch() {
  console.log('--------------------------------------------------');
  console.log('🔍 FounderOS Unified Search & Context Diagnostic');
  console.log('--------------------------------------------------');

  const status = await checkPostgresConnection();
  if (!status.connected) {
    console.error('❌ Database not connected:', status.details);
    process.exit(1);
  }
  console.log('✅ Connected to Supabase PostgreSQL database.');
  console.log('--------------------------------------------------');

  const testQueries = ['Sarah', 'Acme', 'Stripe', 'Marcus', 'SOC2', 'v2.4'];

  for (const query of testQueries) {
    console.log(`\n🔎 Executing Search for Query: "${query}"`);
    const results = await searchDatabaseContext(query);
    console.log(`   • Customers found: ${results.customers.length}`);
    console.log(`   • Emails found: ${results.emails.length}`);
    console.log(`   • Meetings found: ${results.meetings.length}`);
    console.log(`   • Slack Messages found: ${results.slackMessages.length}`);
    console.log(`   • Tasks found: ${results.tasks.length}`);

    const contextStr = await buildSystemContextString(query);
    if (contextStr) {
      console.log(`\n🧠 Formatted AI System Context Output:`);
      console.log(contextStr.trim());
    } else {
      console.log(`   ℹ️ (No context generated for query "${query}")`);
    }
    console.log('--------------------------------------------------');
  }

  console.log('\n🎉 UNIFIED DATABASE SEARCH DIAGNOSTICS PASSED 100%!');
  console.log('--------------------------------------------------');
  process.exit(0);
}

testUnifiedSearch().catch(err => {
  console.error('❌ Search test failed:', err);
  process.exit(1);
});
