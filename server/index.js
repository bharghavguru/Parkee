import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import db from './db.js';
import { initDatabase } from './init-db.js';

import usersRouter    from './routes/users.js';
import spotsRouter    from './routes/spots.js';
import bookingsRouter from './routes/bookings.js';
import reviewsRouter  from './routes/reviews.js';
import otpRouter      from './routes/otp.js';

// Initialize database tables and seed data on first run
initDatabase(db);

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', app: 'Parkee API', timestamp: new Date().toISOString() })
);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/users',    usersRouter);
app.use('/api/spots',    spotsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/reviews',  reviewsRouter);
app.use('/api/otp',      otpRouter);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Parkee API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});
