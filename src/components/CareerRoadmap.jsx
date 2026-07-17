/**
 * CareerRoadmap.jsx — v7
 * Priority tier system: 🔴 High Impact · 🟡 Medium · ⚪ Optional
 * High Impact items sorted first, glowing highlight.
 */

import React, { useState } from 'react';
import { getCoursesForSkillName } from '../utils/courseEngine';

const TIER = {
  high:   { label: 'High Impact',  icon: '🔴', color: '#f87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   glow: 'rgba(239,68,68,0.15)' },
  medium: { label: 'Medium Impact',icon: '🟡', color: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', glow: 'none' },
  opt:    { label: 'Optional',     icon: '⚪', color: '#475569', bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.06)', glow: 'none' },
};

const DONE = { color: '#34d399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', glow: 'none' };
const NEXT = { color: '#818cf8', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', glow: 'rgba(99,102,241,0.1)' };

function getTier(step, index, firstIncomplete) {
  if (step.completed) return 'done';
  if (index === firstIncomplete) return 'next';
  if (step.is_core) return 'high';
  if (index <= firstIncomplete + 3) return 'medium';
  return 'opt';
}

function getStyle(tier) {
  if (tier === 'done') return DONE;
  if (tier === 'next') return NEXT;
  return TIER[tier] || TIER.opt;
}

export default function CareerRoadmap({ roadmap = [], roadmapJob = '' }) {
  const [expanded, setExpanded] = useState(false);
  if (!roadmap.length) return null;

  const firstIncomplete = roadmap.findIndex(s => !s.completed);
  const completedCount  = roadmap.filter(s => s.completed).length;
  const progress        = Math.round((completedCount / roadmap.length) * 100);

  // Sort: done → next → high → medium → optional
  const tierOrder = { done: 0, next: 1, high: 2, medium: 3, opt: 4 };
  const tagged = roadmap.map((step, i) => ({
    ...step,
    _tier: getTier(step, i, firstIncomplete),
    _origIdx: i,
  }));
  const sorted = [...tagged].sort((a, b) => tierOrder[a._tier] - tierOrder[b._tier]);
  const displaySteps = expanded ? sorted : sorted.slice(0, 8);

  const highCount   = tagged.filter(s => s._tier === 'high').length;
  const medCount    = tagged.filter(s => s._tier === 'medium').length;

  return (
    <div className="glass-card animate-slide-up delay-100" style={{ padding: '1.75rem' }}>
      {/* Header */}
      <div className="section-header">
        <div className="section-icon section-icon-cyan">🗺️</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 0 }}>
            Career Roadmap
          </h3>
          <p style={{ fontSize: '0.82rem', marginBottom: 0 }}>
            Your path to <strong style={{ color: 'var(--primary-light)' }}>{roadmapJob}</strong>
          </p>
        </div>
        <div style={{
          padding: '0.3rem 0.8rem', borderRadius: '100px', flexShrink: 0,
          background: progress >= 60 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.12)',
          border: `1px solid ${progress >= 60 ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
          fontSize: '0.78rem', fontWeight: 700,
          color: progress >= 60 ? '#34d399' : '#fbbf24',
        }}>
          {completedCount}/{roadmap.length} done
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>Overall completion</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-light)' }}>{progress}%</span>
        </div>
        <div className="progress-track">
          <div className={`progress-fill ${progress >= 60 ? 'progress-high' : progress >= 30 ? 'progress-mid' : 'progress-low'}`}
            style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Priority legend + counts */}
      {(highCount > 0 || medCount > 0) && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {highCount > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 100, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontWeight: 600 }}>
              🔴 {highCount} High Impact — learn first
            </span>
          )}
          {medCount > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 100, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24', fontWeight: 600 }}>
              🟡 {medCount} Medium Impact
            </span>
          )}
        </div>
      )}

      {/* Steps */}
      <div style={{ position: 'relative' }}>
      {displaySteps.map((step, i) => {
          const tier = step._tier;
          const s = getStyle(tier);
          const isHigh = tier === 'high';
          const isNext = tier === 'next';
          // Look up course for this skill (only for incomplete steps)
          const course = !step.completed ? getCoursesForSkillName(step.skill, 1)[0] : null;
          return (
            <div key={step.step} style={{
              marginBottom: '0.55rem', position: 'relative', zIndex: 1,
              animation: `slideUp 0.35s ease ${i * 40}ms both`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                {/* Circle */}
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step.completed ? 'rgba(16,185,129,0.2)' : isHigh ? 'rgba(239,68,68,0.15)' : isNext ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `2px solid ${s.border}`,
                  fontSize: step.completed ? '1rem' : '0.75rem',
                  fontWeight: 700, color: s.color,
                  boxShadow: (isHigh || isNext) ? `0 0 12px ${s.border}` : 'none',
                }}>
                  {step.completed ? '✓' : step._origIdx + 1}
                </div>

                {/* Content */}
                <div style={{
                  flex: 1, padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)',
                  background: isHigh ? `linear-gradient(90deg, ${TIER.high.bg}, transparent)` : s.bg,
                  border: `1px solid ${s.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  opacity: tier === 'opt' ? 0.6 : 1,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: tier === 'opt' ? 400 : 600, color: s.color }}>
                      {step.skill.charAt(0).toUpperCase() + step.skill.slice(1)}
                    </span>
                    {!step.completed && tier !== 'opt' && (
                      <span style={{ fontSize: '0.62rem', padding: '0.12rem 0.4rem', borderRadius: 100, fontWeight: 700, background: s.bg, border: `1px solid ${s.border}`, color: s.color, textTransform: 'uppercase' }}>
                        {tier === 'high' ? '🔴 High' : tier === 'next' ? '⚡ Next' : '🟡 Mid'}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    {/* Inline course link */}
                    {course && !step.completed && (
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                          padding: '0.18rem 0.55rem', borderRadius: 100, textDecoration: 'none',
                          fontSize: '0.65rem', fontWeight: 700,
                          background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#c4b5fd',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; }}
                      >
                        📖 Learn
                      </a>
                    )}
                    <span style={{ fontSize: '1rem' }}>
                      {step.completed ? '✅' : isHigh ? '🔥' : isNext ? '⚡' : '⬜'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more/less */}
      {roadmap.length > 8 && (
        <button className="btn btn-secondary btn-sm" onClick={() => setExpanded(e => !e)}
          style={{ marginTop: '0.75rem', width: '100%' }}>
          {expanded ? '▲ Show Less' : `▼ Show All ${roadmap.length} Steps`}
        </button>
      )}
    </div>
  );
}
