/**
 * User.js — Mongoose Model
 * Supports email/password auth and Google OAuth
 */
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [80, 'Name too long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'],
  },
  password: {
    type: String,
    minlength: [6, 'Password must be ≥ 6 chars'],
    select: false,   // never returned by default
  },
  googleId: {
    type: String,
    sparse: true,   // allows null + unique index
    unique: true,
  },
  avatar: { type: String, default: null },
  role:   { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

/* ── Pre-save: hash password ── */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* ── Instance method: compare password ── */
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

/* ── Safe serialization (strips password) ── */
userSchema.methods.toSafeObject = function () {
  return {
    id:        this._id,
    name:      this.name,
    email:     this.email,
    avatar:    this.avatar,
    role:      this.role,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
