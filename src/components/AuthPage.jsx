/**
 * AuthPage.jsx — v3
 * Compact mode when used as modal overlay.
 * Full-page mode when rendered standalone.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/* ── Field ─────────────────────────────────────────────────── */
function Field({ label, type = 'text', value, onChange, placeholder, error, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', letterSpacing: '-0.01em' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={isPassword && showPw ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            height: '44px', width: '100%',
            padding: isPassword ? '0 44px 0 14px' : '0 14px',
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${error ? '#ef4444' : focused ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '10px',
            color: '#f8fafc', fontSize: '14px',
            outline: 'none', transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
            boxShadow: focused && !error ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
            fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            tabIndex={-1}
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#64748b', padding: 0 }}
          >
            {showPw ? '🙈' : '👁'}
          </button>
        )}
      </div>
      {error && <span style={{ fontSize: '12px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>⚠ {error}</span>}
    </div>
  );
}

/* ── Google Button ─────────────────────────────────────────── */
function GoogleButton({ onClick, loading }) {
  return (
    <button
      type="button" onClick={onClick} disabled={loading}
      style={{
        width: '100%', height: '44px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '14px', fontWeight: 600, color: '#cbd5e1',
        transition: 'all 0.18s ease', fontFamily: 'Inter, sans-serif',
        opacity: loading ? 0.6 : 1,
      }}
      onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
    >
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.3z"/>
        <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.2-8 2.2-6.2 0-11.4-4.2-13.3-9.8H2.5v6.2C6.5 42.5 14.7 48 24 48z"/>
        <path fill="#FBBC05" d="M10.7 28.6c-.5-1.4-.7-2.9-.7-4.6s.3-3.2.7-4.6v-6.2H2.5C.9 16.6 0 20.2 0 24s.9 7.4 2.5 10.8l8.2-6.2z"/>
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.7 0 6.5 5.5 2.5 13.2l8.2 6.2C12.6 13.7 17.8 9.5 24 9.5z"/>
      </svg>
      Continue with Google
    </button>
  );
}

/* ── Main AuthPage ──────────────────────────────────────────── */
export default function AuthPage({ mode = 'login', onSwitch, onSkip }) {
  const { login, signup, googleAuth } = useAuth();
  const { theme, toggleTheme }        = useTheme();
  const isLogin = mode === 'login';

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [toast,    setToast]    = useState({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.head.appendChild(script);
    return () => { try { document.head.removeChild(script); } catch (e) {} };
  }, []);

  function showToast(message, type = 'success') {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500);
  }

  function validate() {
    const e = {};
    if (!isLogin && !name.trim()) e.name = 'Name is required';
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate() || loading) return;
    setLoading(true); setErrors({});
    try {
      if (isLogin) { await login({ email, password }); showToast('Welcome back! 👋', 'success'); }
      else { await signup({ name, email, password }); showToast("Account created! Let's build your career 🚀", 'success'); }
    } catch (err) {
      const msg = err.message;
      showToast(msg, 'error');
      if (/email/i.test(msg)) setErrors({ email: msg });
      else if (/password/i.test(msg)) setErrors({ password: msg });
      else if (/name/i.test(msg)) setErrors({ name: msg });
    } finally { setLoading(false); }
  }

  async function handleGoogleClick() {
    if (!GOOGLE_CLIENT_ID) { showToast('Google Sign-In not configured — use email/password.', 'error'); return; }
    setGLoading(true);
    try {
      await new Promise((resolve, reject) => {
        window.google?.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async ({ credential }) => {
            try { await googleAuth(credential); resolve(); }
            catch (err) { reject(err); }
          },
        });
        window.google?.accounts.id.prompt(n => {
          if (n.isNotDisplayed() || n.isSkippedMoment()) reject(new Error('Google Sign-In was dismissed.'));
        });
      });
      showToast('Signed in with Google! 🎉', 'success');
    } catch (err) {
      showToast(err.message || 'Google Sign-In failed.', 'error');
    } finally { setGLoading(false); }
  }

  return (
    <div style={{ background: '#0a0f1e', position: 'relative' }}>
      {/* Toast */}
      {toast.visible && (
        <div style={{
          position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 99, padding: '10px 18px',
          background: toast.type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: toast.type === 'success' ? '#86efac' : '#fca5a5',
          borderRadius: '10px', fontSize: '13px', fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          {toast.type === 'success' ? '✅' : '⚠️'} {toast.message}
        </div>
      )}

      {/* Card */}
      <div style={{ padding: '2.5rem 2rem 2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: 52, height: 52,
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', margin: '0 auto 14px',
          }}>
            {isLogin ? '🔐' : '🚀'}
          </div>
          <h2 style={{
            fontSize: '22px', fontWeight: 800, color: '#f8fafc',
            letterSpacing: '-0.03em', marginBottom: '5px',
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            {isLogin ? 'Sign in to your career dashboard' : 'Start your AI career journey — free forever'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {!isLogin && (
            <Field label="Full Name" value={name} onChange={setName} placeholder="Alex Johnson" error={errors.name} autoComplete="name" />
          )}
          <Field label="Email Address" type="email" value={email} onChange={setEmail} placeholder="alex@example.com" error={errors.email} autoComplete="email" />
          <Field label="Password" type="password" value={password} onChange={setPassword} placeholder={isLogin ? '••••••••' : 'Min 6 characters'} error={errors.password} autoComplete={isLogin ? 'current-password' : 'new-password'} />

          {isLogin && (
            <div style={{ textAlign: 'right', marginTop: '-6px' }}>
              <button type="button" style={{ background: 'none', border: 'none', fontSize: '12px', color: '#6366f1', cursor: 'pointer', padding: 0 }}>
                Forgot password?
              </button>
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{
              height: '44px', width: '100%', marginTop: '4px',
              background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '14px', fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s ease', fontFamily: 'Inter, sans-serif',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(99,102,241,0.35)',
            }}
          >
            {loading ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                {isLogin ? 'Signing in…' : 'Creating account…'}
              </>
            ) : (isLogin ? '🔓 Sign In' : '🚀 Create Account')}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <span style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>

        <GoogleButton onClick={handleGoogleClick} loading={gLoading} />

        {/* Skip to demo */}
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            style={{
              width: '100%', marginTop: '10px', padding: '10px',
              background: 'transparent',
              border: '1px dashed rgba(255,255,255,0.12)',
              borderRadius: '10px',
              color: '#475569', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.color = '#a5b4fc'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#475569'; }}
          >
            ⚡ Skip — Try Demo Instead
          </button>
        )}

        {/* Switch mode */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#475569' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" onClick={onSwitch}
            style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 700, cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif', padding: 0 }}>
            {isLogin ? 'Sign up free' : 'Sign in'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
