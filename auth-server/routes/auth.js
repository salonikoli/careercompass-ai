/**
 * auth.js — Express Router for /api/auth
 */
const express  = require('express');
const rateLimit = require('express-rate-limit');
const router   = express.Router();
const { signup, login, googleAuth, getMe } = require('../controllers/authController');
const protect  = require('../middleware/authMiddleware');

/* ── Rate limiting: max 10 auth requests per 15 min per IP ── */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many requests. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', authLimiter, signup);
router.post('/login',  authLimiter, login);
router.post('/google', authLimiter, googleAuth);
router.get('/me',      protect, getMe);

module.exports = router;
