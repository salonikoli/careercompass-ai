/**
 * InsightsPanel.jsx — v7
 * Impact Insight Engine: shows "If you learn X, match increases Y% → Z%"
 */

import React from 'react';

function getInsightStyle(text) {
  if (text.startsWith('🚀')) return { accent: '#10b981', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.2)' };
  if (text.startsWith('⭐')) return { accent: '#06b6d4', bg: 'rgba(6,182,212,0.07)', border: 'rgba(6,182,212,0.2)' };
  if (text.startsWith('📈')) return { accent: '#f59e0b', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.2)' };
  if (text.startsWith('💪')) return { accent: '#ef4444', bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.2)' };
  if (text.startsWith('🎯')) return { accent: '#8b5cf6', bg: 'rgba(139,92,246,0.07)', border: 'rgba(139,92,246,0.2)' };
  if (text.startsWith('📚')) return { accent: '#6366f1', bg: 'rgba(99,102,241,0.07)', border: 'rgba(99,102,241,0.2)' };
  if (text.startsWith('✅')) return { accent: '#10b981', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.2)' };
  if (text.startsWith('💡')) return { accent: '#f472b6', bg: 'rgba(244,114,182,0.07)', border: 'rgba(244,114,182,0.2)' };
  if (text.startsWith('🌟')) return { accent: '#fbbf24', bg: 'rgba(251,191,36,0.07)', border: 'rgba(251,191,36,0.2)' };
  if (text.startsWith('📊')) return { accent: '#06b6d4', bg: 'rgba(6,182,212,0.07)', border: 'rgba(6,182,212,0.2)' };
  return { accent: '#6366f1', bg: 'rgba(99,102,241,0.07)', border: 'rgba(99,102,241,0.2)' };
}

function InsightCard({ text, index }) {
  const style = getInsightStyle(text);
  const emoji = text.match(/^(\p{Emoji})/u)?.[1] || '💡';
  const message = text.replace(/^(\p{Emoji}\s*)/u, '').trim();
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '0.9rem',
      padding: '1rem 1.1rem', borderRadius: 'var(--radius-md)',
      background: style.bg, border: `1px solid ${style.border}`,
      marginBottom: '0.65rem',
      animation: `slideUp 0.45s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms both`,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = `0 4px 16px ${style.border}`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{
        width: '36px', height: '36px', flexShrink: 0, borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
        background: `${style.accent}22`, border: `1px solid ${style.accent}44`,
      }}>{emoji}</div>
      <div style={{ flex: 1, fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.55, paddingTop: '2px' }}>
        {message}
      </div>
    </div>
  );
}

export default function InsightsPanel({ insights = [], bestFitJob = '', bestFitScore = 0, topJob = null }) {
  if (!insights.length) return null;

  // Compute impact insight
  const missingCritical = topJob?.missing_critical || [];
  const topTwo          = missingCritical.slice(0, 2);
  const potentialBoost  = Math.min(missingCritical.length * 5, 25);
  const potentialScore  = Math.min(bestFitScore + potentialBoost, 98);
  const showImpact      = topTwo.length > 0 && potentialBoost > 0;

  return (
    <div className="glass-card animate-slide-up" style={{ padding: '1.75rem' }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <div className="section-icon section-icon-purple">🧠</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 0 }}>AI Career Insights</h3>
          <p style={{ fontSize: '0.82rem', marginBottom: 0 }}>Personalised analysis based on your resume</p>
        </div>
        {bestFitJob && (
          <div style={{
            padding: '0.35rem 0.85rem', borderRadius: '100px',
            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
            fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary-light)', whiteSpace: 'nowrap',
          }}>
            {bestFitScore}% → {bestFitJob}
          </div>
        )}
      </div>

      {/* Impact Insight Engine */}
      {showImpact && (
        <div style={{
          padding: '1rem 1.15rem', borderRadius: 10, marginBottom: '1.25rem',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.07))',
          border: '1px solid rgba(99,102,241,0.3)',
          animation: 'slideUp 0.4s ease both',
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
            ⚡ Impact Insight Engine
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-1)', lineHeight: 1.55 }}>
            If you learn{' '}
            <strong style={{ color: '#c4b5fd' }}>{topTwo.join(' and ')}</strong>, your match will increase from{' '}
            <strong style={{ color: 'var(--yellow)', fontFamily: 'Space Grotesk, sans-serif' }}>{bestFitScore}%</strong>
            {' '}→{' '}
            <strong style={{ color: 'var(--green)', fontFamily: 'Space Grotesk, sans-serif' }}>{potentialScore}%</strong>{' '}
            for <span style={{ color: 'var(--primary-light)' }}>{bestFitJob}</span>.
          </div>
          <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {topTwo.map(s => (
              <span key={s} style={{
                padding: '0.2rem 0.65rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600,
                background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)', color: '#c4b5fd',
              }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div>
        {insights.map((insight, i) => (
          <InsightCard key={i} text={insight} index={i} />
        ))}
      </div>
    </div>
  );
}
