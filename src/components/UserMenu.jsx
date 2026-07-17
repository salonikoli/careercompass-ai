/**
 * UserMenu.jsx
 * ─────────────────────────────────────────────────────────────
 * Top-right avatar dropdown for authenticated users.
 * Shows initials avatar, dropdown with Profile + Logout.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

function getInitials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?';
}

function getAvatarColor(name = '') {
  const palette = ['#6366f1', '#8b5cf6', '#ec4899', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % palette.length;
  return palette[hash];
}

export default function UserMenu({ onLogout }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  const initials   = getInitials(user.name);
  const avatarColor = getAvatarColor(user.name);

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      {/* Avatar trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        title={user.name}
        style={{
          width: 34, height: 34,
          borderRadius: '50%',
          background: avatarColor,
          border: `2px solid ${open ? 'var(--primary)' : 'transparent'}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 700, color: '#fff',
          transition: 'all 0.18s ease',
          fontFamily: 'Space Grotesk, sans-serif',
          flexShrink: 0,
          boxShadow: open ? '0 0 0 3px var(--primary-glow)' : 'none',
        }}
      >
        {initials}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          minWidth: '200px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-md)',
          borderRadius: '12px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
          zIndex: 999,
          overflow: 'hidden',
          animation: 'scaleIn 0.18s cubic-bezier(0.16,1,0.3,1)',
        }}>
          {/* User info header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: avatarColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 700, color: '#fff',
                flexShrink: 0, fontFamily: 'Space Grotesk, sans-serif',
              }}>{initials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div style={{ padding: '6px' }}>
            {[
              { icon: '👤', label: 'Profile',       action: () => { setOpen(false); } },
              { icon: '⚙️', label: 'Settings',      action: () => { setOpen(false); } },
              { icon: '📊', label: 'My Analyses',   action: () => { setOpen(false); } },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.action}
                style={{
                  width: '100%', padding: '9px 12px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                  color: 'var(--text-2)', fontFamily: 'Inter, sans-serif',
                  textAlign: 'left', transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <span style={{ fontSize: '14px' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}

            <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />

            {/* Logout */}
            <button
              onClick={() => { setOpen(false); onLogout?.(); }}
              style={{
                width: '100%', padding: '9px 12px',
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'none', border: 'none', cursor: 'pointer',
                borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                color: 'var(--danger)', fontFamily: 'Inter, sans-serif',
                textAlign: 'left', transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-subtle)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <span style={{ fontSize: '14px' }}>🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes scaleIn { from { opacity:0; transform:scale(0.94) translateY(-4px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </div>
  );
}
