/**
 * ReadinessScore.jsx  (v2)
 * ------------------
 * Displays the career readiness score (0-100) as an animated circular gauge.
 * NEW: Shows "You are X% ready for [Best-Fit Role]" headline.
 */

import React, { useEffect, useState } from 'react';

function getScoreConfig(score) {
  if (score >= 75) return { label: '🚀 Excellent — Top Candidate',    color: '#10b981', glow: 'rgba(16,185,129,0.4)', emoji: '🚀' };
  if (score >= 55) return { label: '⭐ Good — Keep Building',          color: '#06b6d4', glow: 'rgba(6,182,212,0.4)',  emoji: '⭐' };
  if (score >= 35) return { label: '📈 Growing — On the Right Track',  color: '#f59e0b', glow: 'rgba(245,158,11,0.4)', emoji: '📈' };
  return             { label: '⚠️ Needs Work — Focus on Fundamentals', color: '#ef4444', glow: 'rgba(239,68,68,0.4)',  emoji: '💪' };
}

/* SVG circular progress gauge */
function CircularGauge({ score, color, glow }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (animatedScore / 100) * circumference;

  useEffect(() => {
    let start = 0;
    const step = score / 60;
    const interval = setInterval(() => {
      start += step;
      if (start >= score) { setAnimatedScore(score); clearInterval(interval); }
      else setAnimatedScore(Math.round(start));
    }, 16);
    return () => clearInterval(interval);
  }, [score]);

  return (
    <div style={{ position: 'relative', width: '140px', height: '140px' }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
          style={{ filter: `drop-shadow(0 0 8px ${glow})`, transition: 'stroke-dasharray 0.05s linear' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1 }}>{animatedScore}</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-sub)', marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}

export default function ReadinessScore({ score = 0, bestFitJob = '', bestFitScore = 0 }) {
  const { label, color, glow, emoji } = getScoreConfig(score);

  const criteria = [
    { label: 'Skill Breadth', score: Math.min(Math.round(score * 0.4), 40), max: 40 },
    { label: 'Job Match Avg', score: Math.min(Math.round(score * 0.4), 40), max: 40 },
    { label: 'Skill Diversity', score: Math.min(Math.round(score * 0.2), 20), max: 20 },
  ];

  return (
    <div className="glass-card animate-slide-up delay-200" style={{ padding: '1.75rem' }}>
      {/* Header */}
      <div className="section-header">
        <div className="section-icon section-icon-orange">🎯</div>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 0 }}>
            Career Readiness Score
          </h3>
          <p style={{ fontSize: '0.82rem', marginBottom: 0 }}>
            Composite score across skills, matches &amp; diversity
          </p>
        </div>
      </div>

      {/* ── NEW: "You are X% ready for Role" headline ── */}
      {bestFitJob && (
        <div style={{
          marginBottom: '1.25rem', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)',
          background: `${color}10`, border: `1px solid ${color}35`,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.25rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Best Employment Match
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.35 }}>
            You are{' '}
            <span style={{ color, fontSize: '1.25rem', fontWeight: 900 }}>{bestFitScore}%</span>
            {' '}ready for{' '}
            <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{bestFitJob}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '0.35rem' }}>
            {bestFitScore >= 70
              ? '🎉 You are a competitive applicant for this role!'
              : bestFitScore >= 45
              ? '📚 A few more skills will make you a strong candidate.'
              : '💡 Start with the critical skills in the gap analysis below.'}
          </div>
        </div>
      )}

      {/* Score content */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Circular gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <CircularGauge score={score} color={color} glow={glow} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.35rem 1rem', borderRadius: '100px',
            background: `${color}18`, border: `1px solid ${color}40`,
            fontSize: '0.85rem', fontWeight: 600, color,
          }}>
            {emoji} {label}
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-sub)', fontWeight: 500 }}>
            Score Breakdown
          </div>
          {criteria.map((c, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>{c.label}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color }}>{c.score}/{c.max}</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill progress-blue"
                  style={{ width: `${(c.score / c.max) * 100}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }}
                />
              </div>
            </div>
          ))}

          <div style={{
            marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
            fontSize: '0.8rem', color: 'var(--text-sub)',
          }}>
            💡 {score >= 75
              ? "Outstanding! You're competitive for senior roles. Apply confidently."
              : score >= 55
              ? 'Solid foundation. Complete 1–2 missing skills to become a top candidate.'
              : score >= 35
              ? 'Growing profile. Focus on critical skills (🔥) in the gap analysis first.'
              : 'Start with Python or SQL — master 1 core skill at a time for steady progress.'}
          </div>
        </div>
      </div>
    </div>
  );
}
