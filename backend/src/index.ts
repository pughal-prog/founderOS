import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { checkPostgresConnection, getDatabaseStatus } from './config/db';
import { checkSupabaseApiConnection, isSupabaseConfigured } from './config/supabase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Health Check with DB and Supabase Status
app.get('/health', async (req, res) => {
  const dbStatus = await checkPostgresConnection();
  const supabaseStatus = await checkSupabaseApiConnection();
  
  res.json({
    status: 'ok',
    service: 'FounderOS Backend API',
    database: dbStatus,
    supabaseApi: supabaseStatus,
    config: getDatabaseStatus(),
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 FounderOS Backend Server running on http://localhost:${PORT}`);
  const dbStatus = await checkPostgresConnection();
  const supabaseStatus = await checkSupabaseApiConnection();
  
  if (dbStatus.connected) {
    console.log(`✅ Database Status: ${dbStatus.mode} (${dbStatus.details})`);
  } else {
    console.log(`⚠️ Database Status: ${dbStatus.mode} - ${dbStatus.details}`);
  }

  if (supabaseStatus.connected) {
    console.log(`✅ Supabase API Status: Connected (${supabaseStatus.details})`);
  } else {
    console.log(`ℹ️ Supabase API Status: ${supabaseStatus.details}`);
  }
});
