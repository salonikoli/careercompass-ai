/**
 * JobMatchCard.jsx — v7
 * Human-language fit labels, potential boost badge, View Roadmap CTA.
 * Impact Insight Engine per card.
 */

import React, { useState } from 'react';

const LEVEL_COLORS = {
  Beginner:     { bg: 'var(--green-subtle)',  border: 'var(--green-border)',  text: 'var(--green)' },
  Intermediate: { bg: 'var(--blue-subtle)',   border: 'rgba(59,130,246,0.3)', text: 'var(--blue)' },
  Advanced:     { bg: 'var(--purple-subtle)', border: 'var(--purple-border)', text: 'var(--purple)' },
};

function MatchRing({ pct }) {
  const color = pct >= 65 ? 'var(--green)' : pct >= 40 ? 'var(--primary)' : 'var(--yellow)';
  const r = 22; const circ = 2 * Math.PI * r; const dash = (pct / 100) * circ;
  return (
    <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
      <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 4px ${color}66)` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color, lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }}>{pct}%</span>
      </div>
    </div>
  );
}

function getFitLabel(pct) {
  if (pct >= 75) return { label: 'Strong Fit', color: 'var(--green)',   bg: 'var(--green-subtle)',  border: 'var(--green-border)'  };
  if (pct >= 50) return { label: 'Good Match', color: 'var(--primary)', bg: 'var(--primary-subtle)', border: 'rgba(249,115,22,0.3)'};
  if (pct >= 35) return { label: 'Moderate Fit',  color: 'var(--yellow)', bg: 'var(--yellow-subtle)', border: 'var(--yellow-border)'};
  return            { label: 'Stretch Role',  color: '#94a3b8',          bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)'};
}

function getHumanLabel(pct) {
  if (pct >= 75) return 'You are a strong candidate for this role';
  if (pct >= 55) return 'You are a good fit — close to qualifying';
  if (pct >= 40) return 'You are on the right path for this role';
  return 'With focused learning, you can reach this role';
}

function getPotentialBoost(missingCount) {
  return Math.min(missingCount * 5, 28);
}

export default function JobMatchCard({ job, rank, onViewRoadmap }) {
  const [expanded, setExpanded] = useState(false);
  const {
    title, icon, company_name, experience_level,
    match_percentage, matched_skills = [],
    missing_skills = [], missing_critical = [],
    description = '',
  } = job;

  const lvl = LEVEL_COLORS[experience_level] || LEVEL_COLORS.Intermediate;
  const fit = getFitLabel(match_percentage);
  const accentColor = match_percentage >= 65 ? 'var(--green)' : match_percentage >= 40 ? 'var(--primary)' : 'var(--yellow)';
  const potentialBoost = getPotentialBoost(missing_critical.length || missing_skills.length);
  const potentialPct = Math.min(match_percentage + potentialBoost, 98);
  const topMissing = (missing_critical.length > 0 ? missing_critical : missing_skills).slice(0, 2);

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderLeft: `3px solid ${accentColor}`,
      borderRadius: 12, overflow: 'hidden',
      transition: 'var(--transition)',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ padding: '1rem 1.1rem' }}>
        {/* Header row */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Icon + rank */}
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.15rem', position: 'relative',
          }}>
            {icon}
            {rank <= 3 && (
              <div style={{
                position: 'absolute', top: -6, right: -6,
                width: 16, height: 16, borderRadius: '50%',
                background: rank === 1 ? '#eab308' : rank === 2 ? '#94a3b8' : '#b45309',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.55rem', fontWeight: 800, color: 'white',
              }}>#{rank}</div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-4)' }}>{company_name}</span>
              <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'var(--text-4)', display: 'inline-block' }} />
              <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: 100, ...lvl }}>{experience_level}</span>
            </div>
          </div>

          <MatchRing pct={match_percentage} />
        </div>

        {/* Fit label */}
        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            padding: '0.2rem 0.65rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700,
            background: fit.bg, border: `1px solid ${fit.border}`, color: fit.color,
          }}>
            {match_percentage >= 65 ? '✦' : match_percentage >= 45 ? '◆' : '◇'} {fit.label}
          </span>
          {/* Potential boost */}
          {potentialBoost > 0 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
              padding: '0.2rem 0.6rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600,
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8',
            }}>
              +{potentialBoost}% potential
            </span>
          )}
        </div>

        {/* Human language message */}
        <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-3)', lineHeight: 1.4 }}>
          {getHumanLabel(match_percentage)}
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '0.65rem' }}>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${match_percentage}%`, background: accentColor }} />
          </div>
        </div>

        {/* Matched / Missing counts */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
          <div className="badge badge-success">{matched_skills.length} matched</div>
          <div className="badge badge-danger">{missing_skills.length} missing</div>
        </div>

        {/* Impact Insight Engine */}
        {topMissing.length > 0 && (
          <div style={{
            marginTop: '0.75rem', padding: '0.6rem 0.85rem',
            background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 8, fontSize: '0.75rem', color: '#a5b4fc', lineHeight: 1.45,
          }}>
            💡 If you learn <strong style={{ color: '#c4b5fd' }}>{topMissing.join(', ')}</strong>, your match increases from{' '}
            <strong style={{ color: 'var(--yellow)' }}>{match_percentage}%</strong> →{' '}
            <strong style={{ color: 'var(--green)' }}>{potentialPct}%</strong>
          </div>
        )}

        {/* Matched skills preview */}
        {matched_skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.6rem' }}>
            {matched_skills.slice(0, 4).map(s => (
              <span key={s} className="skill-chip skill-chip-success" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>{s}</span>
            ))}
            {matched_skills.length > 4 && (
              <span style={{ fontSize: '0.68rem', color: 'var(--text-4)', padding: '0.15rem 0.3rem' }}>+{matched_skills.length - 4}</span>
            )}
          </div>
        )}

        {/* Action row */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
          {onViewRoadmap && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onViewRoadmap(job)}
              style={{ flex: 1, fontSize: '0.75rem' }}
            >
              🗺 View Roadmap
            </button>
          )}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setExpanded(e => !e)}
            style={{ fontSize: '0.72rem', color: 'var(--text-4)', padding: '0.25rem 0.6rem' }}
          >
            {expanded ? '▲ Less' : '▼ Gap Analysis'}
          </button>
        </div>
      </div>

      {/* Expanded: critical gap */}
      {expanded && (
        <div style={{
          padding: '0.85rem 1.1rem',
          background: 'rgba(0,0,0,0.2)',
          borderTop: '1px solid var(--border)',
          animation: 'slideUp 0.25s ease forwards',
        }}>
          {description && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', lineHeight: 1.55, marginBottom: '0.85rem' }}>
              {description}
            </p>
          )}
          {missing_critical?.length > 0 && (
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                Critical skills to learn first
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.65rem' }}>
                {missing_critical.slice(0, 6).map(s => (
                  <span key={s} className="skill-chip skill-chip-danger" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>{s}</span>
                ))}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.4 }}>
                Learning <strong style={{ color: 'var(--primary-light)' }}>{missing_critical.slice(0, 2).join(' and ')}</strong> will significantly boost your profile for this role.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
