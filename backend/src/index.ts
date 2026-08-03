import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'FounderOS Backend API', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 FounderOS Backend Server running on http://localhost:${PORT}`);
});
