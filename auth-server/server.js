/**
 * server.js — Auth Microservice Entry Point
 * Port: 3001 (Python AI API runs on 8000)
 */
require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const authRoutes = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 3001;

/* ── CORS ── */
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/* ── Body parsing ── */
app.use(express.json({ limit: '10kb' }));  // limit body size for security

/* ── Routes ── */
app.use('/api/auth', authRoutes);

/* ── Health check ── */
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', service: 'caai-auth', time: new Date().toISOString() })
);

/* ── 404 handler ── */
app.use((req, res) =>
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` })
);

/* ── Global error handler ── */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

/* ── Connect to MongoDB + Start server ── */
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log(`✅ MongoDB connected: ${process.env.MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`🚀 Auth server running on http://localhost:${PORT}`);
      console.log(`   POST  /api/auth/signup`);
      console.log(`   POST  /api/auth/login`);
      console.log(`   POST  /api/auth/google`);
      console.log(`   GET   /api/auth/me`);
      console.log(`   GET   /api/health`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('   → Make sure MongoDB is running: mongod --dbpath C:/data/db');
    process.exit(1);
  });
