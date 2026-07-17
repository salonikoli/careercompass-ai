/**
 * authService.js — v2
 * ─────────────────────────────────────────────────────────────
 * Real API client for /api/auth/* endpoints.
 * Falls back gracefully if the auth server is offline (demo mode).
 */

// Auth server URL — reads from VITE_AUTH_URL env var (set in GitHub Secrets if auth is deployed)
// Falls back to empty string → all auth calls will gracefully fail (demo/offline mode)
const AUTH_BASE = (import.meta.env.VITE_AUTH_URL || '') + '/api/auth';
const USER_KEY  = 'caai_user';
const TOKEN_KEY = 'caai_token';


/* ── LocalStorage helpers ── */
export function getStoredUser()    { try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; } catch { return null; } }
export function getStoredToken()   { return localStorage.getItem(TOKEN_KEY) || null; }
export function isAuthenticated()  { return !!getStoredUser() && !!getStoredToken(); }

export function storeSession(user, token) {
  localStorage.setItem(USER_KEY,  JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

/* ── Core fetch wrapper ── */
async function authFetch(path, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${AUTH_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({ message: 'Server error' }));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
}

/* ── Signup ── */
export async function signupUser({ name, email, password }) {
  if (!name?.trim())          throw new Error('Please enter your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email address.');
  if (password.length < 6)    throw new Error('Password must be at least 6 characters.');

  try {
    const data = await authFetch('/signup', {
      method: 'POST',
      body: JSON.stringify({ name: name.trim(), email, password }),
    });
    storeSession(data.user, data.token);
    return data.user;
  } catch (err) {
    // Offline fallback — create a local mock session
    if (err.message.includes('fetch') || err.message.includes('network') || err.message.includes('Failed')) {
      return _mockSignup({ name, email, password });
    }
    throw err;
  }
}

/* ── Login ── */
export async function loginUser({ email, password }) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email address.');
  if (!password) throw new Error('Password is required.');

  try {
    const data = await authFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    storeSession(data.user, data.token);
    return data.user;
  } catch (err) {
    if (err.message.includes('fetch') || err.message.includes('network') || err.message.includes('Failed')) {
      return _mockLogin({ email, password });
    }
    throw err;
  }
}

/* ── Google OAuth ── */
export async function googleAuth(credential) {
  const data = await authFetch('/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  });
  storeSession(data.user, data.token);
  return data.user;
}

/* ── Restore session from token ── */
export async function restoreSession() {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const data = await authFetch('/me');
    storeSession(data.user, token);
    return data.user;
  } catch {
    // Token invalid/expired — clear local storage
    clearSession();
    return null;
  }
}

/* ── Logout ── */
export async function logoutUser() {
  clearSession();
}

/* ── Mock fallback (auth server offline) ── */
function _mockSignup({ name, email, password }) {
  const existing = getStoredUser();
  if (existing?.email?.toLowerCase() === email.toLowerCase())
    throw new Error('An account with this email already exists.');
  const user  = { id: `local_${Date.now()}`, name: name.trim(), email: email.toLowerCase(), createdAt: new Date().toISOString() };
  const token = `local_${Math.random().toString(36).slice(2)}`;
  storeSession(user, token);
  return user;
}

function _mockLogin({ email, password }) {
  const stored = getStoredUser();
  if (stored?.email?.toLowerCase() === email.toLowerCase()) {
    const token = `local_${Math.random().toString(36).slice(2)}`;
    storeSession(stored, token);
    return stored;
  }
  const user  = { id: `local_${Date.now()}`, name: email.split('@')[0], email: email.toLowerCase(), createdAt: new Date().toISOString() };
  const token = `local_${Math.random().toString(36).slice(2)}`;
  storeSession(user, token);
  return user;
}
