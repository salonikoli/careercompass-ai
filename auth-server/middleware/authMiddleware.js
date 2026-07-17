/**
 * authMiddleware.js
 * Protects routes — extracts + verifies JWT from Authorization header.
 */
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function protect(req, res, next) {
  try {
    // Extract token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authenticated. Please log in.' });
    }

    const token = authHeader.split(' ')[1];

    // Verify
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const msg = err.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid token. Please log in again.';
      return res.status(401).json({ message: msg });
    }

    // Attach user to request
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ message: 'User no longer exists.' });

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ message: 'Authentication error.' });
  }
};
