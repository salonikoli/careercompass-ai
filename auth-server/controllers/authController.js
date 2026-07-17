/**
 * authController.js
 * Handles: signup, login, google oauth, /me
 */
const { OAuth2Client } = require('google-auth-library');
const User          = require('../models/User');
const generateToken = require('../utils/generateToken');
const validator     = require('validator');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ── Helper: send auth response ── */
function sendAuth(res, statusCode, user, token) {
  res.status(statusCode).json({
    success: true,
    token,
    user: user.toSafeObject(),
  });
}

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/signup
   Body: { name, email, password }
   ───────────────────────────────────────────────────────────── */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name?.trim())
      return res.status(400).json({ message: 'Name is required.' });
    if (!email || !validator.isEmail(email))
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    if (!password || password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    // Check for duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ message: 'An account with this email already exists.' });

    // Create user (password auto-hashed by pre-save hook)
    const user  = await User.create({ name: name.trim(), email, password });
    const token = generateToken(user._id);

    sendAuth(res, 201, user, token);
  } catch (err) {
    console.error('signup error:', err);
    if (err.code === 11000)
      return res.status(409).json({ message: 'Email already in use.' });
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/login
   Body: { email, password }
   ───────────────────────────────────────────────────────────── */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !validator.isEmail(email))
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    if (!password)
      return res.status(400).json({ message: 'Password is required.' });

    // Find user (re-select password for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password.' });

    // Check if user signed up with Google (no password set)
    if (!user.password)
      return res.status(400).json({ message: 'This account uses Google Sign-In. Please continue with Google.' });

    const match = await user.comparePassword(password);
    if (!match)
      return res.status(401).json({ message: 'Invalid email or password.' });

    const token = generateToken(user._id);
    sendAuth(res, 200, user, token);
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/google
   Body: { credential }  ← Google ID token from frontend
   ───────────────────────────────────────────────────────────── */
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential)
      return res.status(400).json({ message: 'Google credential is required.' });

    // Verify ID token with Google
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken:  credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (e) {
      return res.status(401).json({ message: 'Invalid Google token. Please try again.' });
    }

    const { sub: googleId, email, name, picture } = payload;

    // Find existing user by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Merge googleId if user registered with email before
      if (!user.googleId) {
        user.googleId = googleId;
        if (picture && !user.avatar) user.avatar = picture;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({ name, email, googleId, avatar: picture });
    }

    const token = generateToken(user._id);
    sendAuth(res, 200, user, token);
  } catch (err) {
    console.error('google auth error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

/* ─────────────────────────────────────────────────────────────
   GET /api/auth/me
   Header: Authorization: Bearer <token>
   ───────────────────────────────────────────────────────────── */
exports.getMe = async (req, res) => {
  // req.user is set by authMiddleware
  res.json({ success: true, user: req.user.toSafeObject() });
};
