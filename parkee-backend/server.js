const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// API Routes (Page 1)
app.use('/api/v1/auth', authRoutes);

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Parkee Backend Active',
    activePages: [
      'Page 1: Sign Up (POST /api/v1/auth/signup)',
      'View Users (GET /api/v1/auth/users)'
    ],
    timestamp: new Date().toISOString()
  });
});

// Root Route
app.get('/', (req, res) => {
  res.send('Parkee Backend API (Page 1 Active)');
});

// Start Server
app.listen(PORT, () => {
  console.log(`[Parkee Backend] Server running on http://localhost:${PORT}`);
  console.log(`[Parkee Backend] Page 1 Signup Endpoint: POST http://localhost:${PORT}/api/v1/auth/signup`);
  console.log(`[Parkee Backend] View All Saved Users: GET http://localhost:${PORT}/api/v1/auth/users`);
});
