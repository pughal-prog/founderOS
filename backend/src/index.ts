import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { checkPostgresConnection } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Health Check with DB Status
app.get('/health', async (req, res) => {
  const dbStatus = await checkPostgresConnection();
  res.json({
    status: 'ok',
    service: 'FounderOS Backend API',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 FounderOS Backend Server running on http://localhost:${PORT}`);
  const dbStatus = await checkPostgresConnection();
  if (dbStatus.connected) {
    console.log(`✅ Database Status: ${dbStatus.mode} (${dbStatus.details})`);
  } else {
    console.log(`⚠️ Database Status: ${dbStatus.mode}`);
  }
});
