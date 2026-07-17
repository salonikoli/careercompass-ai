/**
 * CopilotTrigger.jsx
 * ------------------
 * Inline "Ask Copilot" button used across Dashboard, JDMatcher,
 * SkillBenchmark, etc.
 *
 * Props:
 *   message {string}  — Preset question to inject into copilot
 *   label   {string}  — Button label (default "Ask Copilot")
 *   variant {string}  — "ghost" | "primary" | "banner"
 *   icon    {string}  — Emoji prefix
 */

import React from 'react';
import { useCopilot } from '../context/CopilotContext';

export default function CopilotTrigger({
  message = 'How can I improve my career profile?',
  label   = 'Ask Copilot',
  variant = 'ghost',
  icon    = '🤖',
  style   = {},
}) {
  const { openCopilot } = useCopilot();

  const BASE = {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    borderRadius: 100, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    fontWeight: 600, transition: 'all 0.18s ease', border: 'none',
    ...style,
  };

  const VARIANTS = {
    ghost: {
      padding: '0.28rem 0.75rem',
      fontSize: '0.74rem',
      background: 'rgba(249,115,22,0.07)',
      border: '1px solid rgba(249,115,22,0.25)',
      color: 'var(--primary)',
    },
    primary: {
      padding: '0.4rem 1rem',
      fontSize: '0.8rem',
      background: 'var(--primary)',
      color: 'white',
      boxShadow: '0 2px 12px rgba(249,115,22,0.3)',
    },
    banner: {
      padding: '0.55rem 1.25rem',
      fontSize: '0.85rem',
      background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(124,58,237,0.1))',
      border: '1px solid rgba(249,115,22,0.3)',
      color: 'var(--primary)',
      borderRadius: 10,
    },
  };

  return (
    <button
      onClick={() => openCopilot(message)}
      style={{ ...BASE, ...VARIANTS[variant] }}
      onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {icon} {label}
    </button>
  );
}
