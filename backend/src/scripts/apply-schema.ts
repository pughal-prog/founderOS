import fs from 'fs';
import path from 'path';
import { pgPool, checkPostgresConnection } from '../config/db';

async function applyDatabaseSchema() {
  console.log('--------------------------------------------------');
  console.log('⚙️ FounderOS Schema & Seed Migration Script');
  console.log('--------------------------------------------------');

  const status = await checkPostgresConnection();
  if (!status.connected) {
    console.log(`⚠️ PostgreSQL connection check failed (${status.details}).`);
    console.log('ℹ️ Schema files have been generated at backend/database/schema.sql & backend/database/seed.sql');
    console.log('👉 You can copy and paste the contents into your Supabase Dashboard SQL Editor!');
    process.exit(0);
  }

  try {
    console.log('📜 Reading backend/database/schema.sql...');
    const schemaSqlPath = path.join(__dirname, '../../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');

    console.log('🚀 Applying Database Schema to PostgreSQL / Supabase...');
    await pgPool.query(schemaSql);
    console.log('✅ Schema applied successfully!');

    console.log('🌱 Reading backend/database/seed.sql...');
    const seedSqlPath = path.join(__dirname, '../../database/seed.sql');
    const seedSql = fs.readFileSync(seedSqlPath, 'utf8');

    console.log('🚀 Seeding Initial Data into Database...');
    await pgPool.query(seedSql);
    console.log('✅ Seed data inserted successfully!');

    console.log('--------------------------------------------------');
    console.log('🎉 Database Schema & Seed setup is 100% complete!');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Error executing database migration:', err.message || err);
    process.exit(1);
  }
}

applyDatabaseSchema();
