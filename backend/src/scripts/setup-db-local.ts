import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

async function setupLocalDb() {
  console.log('Connecting to PostgreSQL server...');
  const postgresUrl = 'postgresql://postgres:Pughal@123@localhost:5432/postgres';
  const client = new Client({ connectionString: postgresUrl });
  
  try {
    await client.connect();
    console.log('Connected to default postgres database successfully!');
  } catch (err: any) {
    console.error('Failed to connect to PostgreSQL server:', err.message);
    process.exit(1);
  }

  // List existing databases
  const dbListResult = await client.query('SELECT datname FROM pg_database');
  const dbs = dbListResult.rows.map(r => r.datname);
  console.log('Existing databases:', dbs);

  const targetDbName = 'founderOS';
  const targetDbNameLower = 'founderos';

  if (!dbs.includes(targetDbName) && !dbs.includes(targetDbNameLower)) {
    console.log(`Database "${targetDbName}" does not exist. Creating...`);
    await client.query(`CREATE DATABASE "${targetDbName}"`);
    console.log(`Database "${targetDbName}" created successfully!`);
  } else {
    console.log(`Database "${targetDbName}" already exists.`);
  }

  await client.end();

  // Now connect to target DB
  const targetUrl = 'postgresql://postgres:Pughal@123@localhost:5432/founderOS';
  const dbClient = new Client({ connectionString: targetUrl });
  await dbClient.connect();
  console.log(`Connected to target database "${targetDbName}"!`);

  const schemaPath = path.join(__dirname, '../../database/schema.sql');
  if (fs.existsSync(schemaPath)) {
    console.log('Reading schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Executing schema.sql...');
    await dbClient.query(schemaSql);
    console.log('Schema executed successfully!');
  } else {
    console.log('schema.sql not found at:', schemaPath);
  }

  const seedPath = path.join(__dirname, '../../database/seed.sql');
  if (fs.existsSync(seedPath)) {
    console.log('Reading seed.sql...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    console.log('Executing seed.sql...');
    await dbClient.query(seedSql);
    console.log('Seed executed successfully!');
  } else {
    console.log('seed.sql not found at:', seedPath);
  }

  await dbClient.end();
  console.log('Local DB setup finished successfully!');
}

setupLocalDb().catch((err) => {
  console.error('Error during local DB setup:', err);
  process.exit(1);
});
