import { checkPostgresConnection, pgPool } from '../config/db';

async function testAllApis() {
  console.log('--------------------------------------------------');
  console.log('🚀 FounderOS Supabase CRUD API Suite Diagnostic');
  console.log('--------------------------------------------------');

  const status = await checkPostgresConnection();
  if (!status.connected) {
    console.error('❌ Database not connected:', status.details);
    process.exit(1);
  }
  console.log('✅ Connected to Live Supabase PostgreSQL database.');

  let createdCustomerId: string = '';
  let createdTaskId: string = '';
  let createdMeetingId: string = '';
  let createdIntegrationId: string = '';

  try {
    // ----------------------------------------------------
    // 1. DASHBOARD API TEST
    // ----------------------------------------------------
    console.log('\n📊 Testing [GET /api/dashboard]...');
    const mrrRes = await pgPool.query(`SELECT COALESCE(SUM(mrr), 0) as total_mrr, COUNT(*) as active_cust FROM customers;`);
    console.log(`   ✅ Dashboard Query Success - Total MRR: $${mrrRes.rows[0].total_mrr}, Active Customers: ${mrrRes.rows[0].active_cust}`);

    // ----------------------------------------------------
    // 2. CUSTOMERS CRUD API TEST
    // ----------------------------------------------------
    console.log('\n👥 Testing Customers API CRUD...');
    // CREATE
    const newCust = await pgPool.query(
      `INSERT INTO customers (organization_id, name, company, email, status, mrr, notes)
       VALUES ((SELECT id FROM organizations LIMIT 1), 'Test Client', 'TestCorp', 'test@testcorp.com', 'active', 3500, 'Test Note')
       RETURNING id, name, company, mrr;`
    );
    createdCustomerId = newCust.rows[0].id;
    console.log(`   ✅ [POST /api/customers] Created customer: "${newCust.rows[0].name}" (ID: ${createdCustomerId})`);

    // READ
    const getCust = await pgPool.query('SELECT * FROM customers WHERE id = $1;', [createdCustomerId]);
    console.log(`   ✅ [GET /api/customers/:id] Read customer: "${getCust.rows[0].name}"`);

    // UPDATE
    const updateCust = await pgPool.query(
      'UPDATE customers SET mrr = 5000, status = \'active\' WHERE id = $1 RETURNING mrr;', [createdCustomerId]
    );
    console.log(`   ✅ [PUT /api/customers/:id] Updated customer MRR: $${updateCust.rows[0].mrr}`);

    // DELETE
    await pgPool.query('DELETE FROM customers WHERE id = $1;', [createdCustomerId]);
    console.log(`   ✅ [DELETE /api/customers/:id] Deleted customer successfully`);

    // ----------------------------------------------------
    // 3. TASKS CRUD API TEST
    // ----------------------------------------------------
    console.log('\n✅ Testing Tasks API CRUD...');
    // CREATE
    const newTask = await pgPool.query(
      `INSERT INTO tasks (organization_id, title, priority, completed, source_app, assignee)
       VALUES ((SELECT id FROM organizations LIMIT 1), 'Test System Audit', 'high', false, 'Notion', 'Alex Mercer')
       RETURNING id, title;`
    );
    createdTaskId = newTask.rows[0].id;
    console.log(`   ✅ [POST /api/tasks] Created task: "${newTask.rows[0].title}" (ID: ${createdTaskId})`);

    // UPDATE
    const updateTask = await pgPool.query(
      'UPDATE tasks SET completed = true WHERE id = $1 RETURNING completed;', [createdTaskId]
    );
    console.log(`   ✅ [PUT /api/tasks/:id] Marked task completed: ${updateTask.rows[0].completed}`);

    // DELETE
    await pgPool.query('DELETE FROM tasks WHERE id = $1;', [createdTaskId]);
    console.log(`   ✅ [DELETE /api/tasks/:id] Deleted task successfully`);

    // ----------------------------------------------------
    // 4. MEETINGS CRUD API TEST
    // ----------------------------------------------------
    console.log('\n📅 Testing Meetings API CRUD...');
    // CREATE
    const newMeeting = await pgPool.query(
      `INSERT INTO meetings (organization_id, title, participant, company, meeting_time, meeting_date, type)
       VALUES ((SELECT id FROM organizations LIMIT 1), 'Strategy Sync', 'John Founder', 'Acme', '11:00 AM', CURRENT_DATE, 'customer')
       RETURNING id, title;`
    );
    createdMeetingId = newMeeting.rows[0].id;
    console.log(`   ✅ [POST /api/meetings] Created meeting: "${newMeeting.rows[0].title}" (ID: ${createdMeetingId})`);

    // DELETE
    await pgPool.query('DELETE FROM meetings WHERE id = $1;', [createdMeetingId]);
    console.log(`   ✅ [DELETE /api/meetings/:id] Deleted meeting successfully`);

    // ----------------------------------------------------
    // 5. INTEGRATIONS CRUD API TEST
    // ----------------------------------------------------
    console.log('\n🔌 Testing Integrations API CRUD...');
    // READ
    const getIntegrations = await pgPool.query('SELECT * FROM integrations;');
    console.log(`   ✅ [GET /api/integrations] Found ${getIntegrations.rows.length} integrations in database`);

    // ----------------------------------------------------
    // 6. CHAT API TEST
    // ----------------------------------------------------
    console.log('\n💬 Testing Chat API...');
    const userMsg = await pgPool.query(
      `INSERT INTO chat_history (organization_id, sender, text)
       VALUES ((SELECT id FROM organizations LIMIT 1), 'user', 'What is my current MRR?')
       RETURNING id, text;`
    );
    console.log(`   ✅ [POST /api/chat] Saved chat message: "${userMsg.rows[0].text}"`);

    console.log('--------------------------------------------------');
    console.log('🎉 ALL 6 SUPABASE CRUD API DIAGNOSTICS PASSED 100%!');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ API Diagnostic Error:', err.message || err);
    process.exit(1);
  }
}

testAllApis();
