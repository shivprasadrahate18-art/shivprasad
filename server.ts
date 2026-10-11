import path from 'path';
import express from 'express';
import dotenv from 'dotenv';

import { app } from './src/server/app.ts';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Serve frontend in production if dist exists
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BloodConnect server running on port ${PORT}`);
});
