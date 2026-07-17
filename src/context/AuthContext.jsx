/**
 * AuthContext.jsx — v2
 * ─────────────────────────────────────────────────────────────
 * Global auth state. Restores session from token on app load.
 * Provides: user, login, signup, googleAuth, logout, isLoggedIn, loading
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  loginUser, signupUser, googleAuth as googleAuthService,
  logoutUser, restoreSession, getStoredUser,
} from '../utils/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);   // true until session check done

  /* ── Restore session on mount ── */
  useEffect(() => {
    restoreSession()
      .then(u => { if (u) setUser(u); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const u = await loginUser(credentials);
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(async (credentials) => {
    const u = await signupUser(credentials);
    setUser(u);
    return u;
  }, []);

  const googleAuth = useCallback(async (credential) => {
    const u = await googleAuthService(credential);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, googleAuth, logout, isLoggedIn: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
