import { streamOpenAIResponse, isOpenAIConfigured } from '../services/openaiService';
import { checkPostgresConnection, pgPool } from '../config/db';

async function testStreamingAndPersistence() {
  console.log('--------------------------------------------------');
  console.log('⚡ FounderOS OpenAI & SSE Streaming Diagnostic');
  console.log('--------------------------------------------------');

  const status = await checkPostgresConnection();
  if (!status.connected) {
    console.error('❌ Database not connected:', status.details);
    process.exit(1);
  }
  console.log('✅ Connected to Supabase PostgreSQL database.');
  console.log(`📌 OpenAI API Configured: ${isOpenAIConfigured()}`);
  console.log('--------------------------------------------------');

  const prompt = 'Give me a brief summary of our top priority tasks for today.';

  console.log(`\n💬 Sending Prompt: "${prompt}"`);
  console.log('📡 Live AI Response Stream:');
  console.log('---');

  let streamedOutput = '';
  let chunkCount = 0;

  const result = await streamOpenAIResponse(
    prompt,
    [],
    (deltaText: string) => {
      chunkCount++;
      streamedOutput += deltaText;
      process.stdout.write(deltaText);
    }
  );

  console.log('\n---');
  console.log(`\n✅ Stream Finished - Received ${chunkCount} chunks (${result.fullText.length} characters).`);

  // Persist User & AI turns directly into Supabase chat_history table to test DB persistence
  const orgRes = await pgPool.query('SELECT id FROM organizations LIMIT 1;');
  const orgId = orgRes.rows[0]?.id;

  const userTurn = await pgPool.query(
    `INSERT INTO chat_history (organization_id, sender, text)
     VALUES ($1, 'user', $2)
     RETURNING id, created_at;`,
    [orgId, prompt]
  );

  const aiTurn = await pgPool.query(
    `INSERT INTO chat_history (organization_id, sender, text, suggested_action)
     VALUES ($1, 'ai', $2, $3)
     RETURNING id, created_at;`,
    [orgId, result.fullText, result.suggestedAction ? JSON.stringify(result.suggestedAction) : null]
  );

  console.log(`✅ Saved User Turn to Supabase chat_history (ID: ${userTurn.rows[0].id})`);
  console.log(`✅ Saved AI Turn to Supabase chat_history (ID: ${aiTurn.rows[0].id})`);

  // Verify chat_history count in database
  const countRes = await pgPool.query('SELECT COUNT(*) as total FROM chat_history;');
  console.log(`📊 Total Records in Supabase chat_history table: ${countRes.rows[0].total}`);

  console.log('--------------------------------------------------');
  console.log('🎉 OPENAI STREAMING & SUPABASE PERSISTENCE TEST PASSED 100%!');
  console.log('--------------------------------------------------');
  process.exit(0);
}

testStreamingAndPersistence().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
