import express from 'express';
import { apiRouter } from './routes.ts';

export const app = express();

// Parse json body
app.use(express.json());

// Mount API routes
app.use('/api', apiRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'BloodConnect API', timestamp: new Date().toISOString() });
});
