import { pgPool, checkPostgresConnection } from '../config/db';

async function checkTables() {
  console.log('--------------------------------------------------');
  console.log('🔍 FounderOS PostgreSQL Table Inspector');
  console.log('--------------------------------------------------');

  const status = await checkPostgresConnection();
  if (!status.connected) {
    console.log(`⚠️ Database not connected (${status.details}).`);
    console.log('👉 Make sure your DATABASE_URL in backend/.env is updated with your Supabase credentials.');
    process.exit(0);
  }

  try {
    const result = await pgPool.query(`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    const expectedTables = [
      'organizations', 'users', 'customers', 'meetings', 
      'emails', 'slack_messages', 'tasks', 'invoices', 
      'chat_history', 'integrations'
    ];

    const foundTables = result.rows.map(r => r.table_name);

    console.log('\n📊 Existing Tables in Public Schema:');
    if (result.rows.length === 0) {
      console.log('   (No tables found in public schema)');
    } else {
      result.rows.forEach((row, idx) => {
        console.log(`   ${idx + 1}. 🟢 ${row.table_name} (${row.column_count} columns)`);
      });
    }

    console.log('\n🎯 Checking Expected FounderOS Tables:');
    expectedTables.forEach(table => {
      const exists = foundTables.includes(table);
      console.log(`   ${exists ? '✅ CREATED' : '❌ MISSING'}: ${table}`);
    });

    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Error checking tables:', err.message || err);
    process.exit(1);
  }
}

checkTables();
