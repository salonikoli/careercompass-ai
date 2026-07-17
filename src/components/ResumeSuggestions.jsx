/**
 * ResumeSuggestions.jsx
 * ----------------------
 * Displays actionable, skill-specific resume improvement tips
 * plus structural best-practice advice.
 */

import React, { useState } from 'react';

const PRIORITY_CONFIG = {
  high:   { label: 'High Priority', color: '#f87171', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  medium: { label: 'Medium',        color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
};

function SkillTipCard({ item, index }) {
  const priority = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.medium;
  return (
    <div
      style={{
        padding: '1rem 1.1rem', borderRadius: 'var(--radius-sm)',
        background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-border)',
        marginBottom: '0.6rem',
        animation: `slideUp 0.4s ease ${index * 60}ms both`,
        transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = priority.color + '60'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.45rem' }}>
        {/* Priority tag */}
        <span style={{
          fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '100px',
          background: priority.bg, border: `1px solid ${priority.border}`,
          color: priority.color, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          {priority.label}
        </span>
        {/* Skill name */}
        <span style={{
          fontSize: '0.82rem', fontWeight: 600,
          background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: '6px', padding: '0.1rem 0.45rem', color: 'var(--primary-light)',
        }}>
          {item.skill.charAt(0).toUpperCase() + item.skill.slice(1)}
        </span>
      </div>
      <p style={{ fontSize: '0.83rem', margin: 0, lineHeight: 1.55, color: 'var(--text-sub)' }}>
        {item.tip}
      </p>
    </div>
  );
}

export default function ResumeSuggestions({ suggestions = {} }) {
  const [showAll, setShowAll] = useState(false);
  const { skill_specific_tips = [], structure_tips = [] } = suggestions;

  if (!skill_specific_tips.length && !structure_tips.length) return null;

  const displayTips = showAll ? skill_specific_tips : skill_specific_tips.slice(0, 3);

  return (
    <div className="glass-card animate-slide-up delay-300" style={{ padding: '1.75rem' }}>
      {/* Header */}
      <div className="section-header">
        <div className="section-icon" style={{
          background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.3)',
        }}>📝</div>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 0 }}>
            Resume Improvement Tips
          </h3>
          <p style={{ fontSize: '0.82rem', marginBottom: 0 }}>
            Targeted suggestions to strengthen your resume
          </p>
        </div>
        {skill_specific_tips.length > 0 && (
          <div style={{ marginLeft: 'auto' }}>
            <span className="badge badge-warning">{skill_specific_tips.length} tips</span>
          </div>
        )}
      </div>

      {/* Skill-specific tips */}
      {skill_specific_tips.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-sub)', marginBottom: '0.75rem' }}>
            🎯 Skill-Specific Suggestions
          </div>
          {displayTips.map((item, i) => (
            <SkillTipCard key={item.skill} item={item} index={i} />
          ))}
          {skill_specific_tips.length > 3 && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowAll(s => !s)}
              style={{ marginTop: '0.25rem' }}
            >
              {showAll ? '▲ Show Less' : `▼ Show ${skill_specific_tips.length - 3} More`}
            </button>
          )}
        </div>
      )}

      {/* General structure tips */}
      {structure_tips.length > 0 && (
        <div>
          <div style={{
            fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-sub)',
            marginBottom: '0.75rem', paddingTop: skill_specific_tips.length > 0 ? '0.75rem' : 0,
            borderTop: skill_specific_tips.length > 0 ? '1px solid var(--glass-border)' : 'none',
          }}>
            📐 General Best Practices
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.55rem',
          }}>
            {structure_tips.map((tip, i) => (
              <div
                key={i}
                style={{
                  padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-border)',
                  fontSize: '0.8rem', color: 'var(--text-sub)', lineHeight: 1.5,
                  animation: `fadeIn 0.4s ease ${i * 60}ms both`,
                }}
              >
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
