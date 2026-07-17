/**
 * MissingSkills.jsx  (v4 — Final Polish)
 * ----------------------------------------
 * Skill Gap Analysis with:
 *  🔥 Critical Skills (core_skills) vs ⚪ Other Skills
 *  ⚡ Impact Insight: "Learning X → match 33% → 65%"
 *  📚 One-click "Learn [Skill]" buttons opening course URLs
 *  📊 Progress bar with "X% complete · Y% remaining"
 *  ⏱  Time estimate per role
 *  👥 Candidate comparison
 */

import React, { useState } from 'react';

/* ── helper: look up course URL from recommended_courses list ── */
function getCourseUrl(skill, courses = []) {
  const match = courses.find(c => c.skill?.toLowerCase() === skill.toLowerCase());
  return match?.url || null;
}

/* ── color helpers ── */
function pctColor(pct) {
  if (pct >= 65) return '#10b981';
  if (pct >= 40) return '#f59e0b';
  return '#ef4444';
}

function readinessLabel(pct) {
  if (pct >= 75) return { text: '🚀 Excellent Match', color: '#10b981' };
  if (pct >= 55) return { text: '⭐ Good Progress',   color: '#06b6d4' };
  if (pct >= 35) return { text: '📈 Building Up',     color: '#f59e0b' };
  return              { text: '⚠️ Needs Improvement', color: '#ef4444' };
}

/* ── single "Learn Skill" button ── */
function LearnButton({ skill, url }) {
  if (!url) return null;
  return (
    <a
      href={url} target="_blank" rel="noreferrer"
      onClick={e => e.stopPropagation()}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
        padding: '0.18rem 0.6rem', borderRadius: '100px',
        fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer',
        background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
        color: '#818cf8', textDecoration: 'none',
        transition: 'background 0.15s ease, transform 0.15s ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.22)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.transform = 'scale(1)'; }}
    >
      📚 Learn
    </a>
  );
}

/* ── skill chip: critical or secondary ── */
function SkillChip({ skill, isCritical, courseUrl }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      padding: isCritical ? '0.32rem 0.7rem' : '0.25rem 0.6rem',
      borderRadius: '100px',
      background: isCritical ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.05)',
      border: isCritical ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--glass-border)',
      fontSize: isCritical ? '0.8rem' : '0.75rem',
      fontWeight: isCritical ? 600 : 400,
      color: isCritical ? '#f87171' : 'var(--text-sub)',
    }}>
      {isCritical ? '🔥' : '⚪'} {skill}
      <LearnButton skill={skill} url={courseUrl} />
    </div>
  );
}

export default function MissingSkills({ jobMatches = [] }) {
  const [selectedJob, setSelectedJob] = useState(jobMatches[0]?.id || '');
  const job = jobMatches.find(j => j.id === selectedJob);

  const color     = job ? pctColor(job.match_percentage) : '#f59e0b';
  const readiness = job ? readinessLabel(job.match_percentage) : null;
  const remaining = job ? (100 - job.match_percentage).toFixed(1) : 0;

  return (
    <div className="glass-card animate-slide-up delay-200" style={{ padding: '1.75rem' }}>
      {/* ── Header ── */}
      <div className="section-header">
        <div className="section-icon section-icon-pink">🎯</div>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 0 }}>
            Skill Gap Analysis
          </h3>
          <p style={{ fontSize: '0.82rem', marginBottom: 0 }}>
            Critical vs secondary skills · one-click courses
          </p>
        </div>
      </div>

      {/* ── Job selector tabs ── */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {jobMatches.map(j => (
          <button
            key={j.id}
            onClick={() => setSelectedJob(j.id)}
            style={{
              padding: '0.4rem 0.9rem', borderRadius: '100px',
              fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
              border: selectedJob === j.id ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
              background: selectedJob === j.id ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.03)',
              color: selectedJob === j.id ? 'var(--primary-light)' : 'var(--text-sub)',
              transition: 'all 0.2s ease',
            }}
          >
            {j.icon} {j.title}
            <span style={{
              marginLeft: '0.4rem', fontSize: '0.72rem', fontWeight: 700,
              color: pctColor(j.match_percentage),
            }}>
              {j.match_percentage}%
            </span>
          </button>
        ))}
      </div>

      {job && (
        <div>
          {/* ── Summary row ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '0.9rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem',
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
            flexWrap: 'wrap',
          }}>
            <div style={{ fontSize: '1.8rem' }}>{job.icon}</div>
            <div style={{ flex: 1, minWidth: '140px' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                {job.title}
              </div>
              {job.company_name && (
                <div style={{ fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: 600 }}>
                  🏢 {job.company_name}
                </div>
              )}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)', marginTop: '0.15rem' }}>
                {job.matched_skills.length} matched · {job.missing_skills.length} missing
              </div>
            </div>

            {/* Readiness label + % */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1 }}>
                {job.match_percentage}%
              </div>
              <div style={{
                display: 'inline-block', marginTop: '0.25rem',
                fontSize: '0.68rem', fontWeight: 600, padding: '0.12rem 0.5rem', borderRadius: '100px',
                background: `${readiness.color}18`, border: `1px solid ${readiness.color}40`, color: readiness.color,
              }}>
                {readiness.text} ({job.match_percentage}% Ready)
              </div>
            </div>
          </div>

          {/* ── Progress insight ── */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                Progress: <strong style={{ color }}>{job.match_percentage}% complete</strong>
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                {remaining}% remaining
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${job.match_percentage}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}bb)`,
                  transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
                  boxShadow: `0 0 8px ${color}60`,
                }}
              />
            </div>
          </div>

          {/* ── Impact insight banner ── */}
          {job.impact_insight && (
            <div style={{
              padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem',
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
              display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '1px' }}>⚡</span>
              <span style={{ fontSize: '0.83rem', color: 'var(--text-main)', lineHeight: 1.5, fontWeight: 500 }}>
                {job.impact_insight}
              </span>
            </div>
          )}

          {/* ── Time estimate + Candidate comparison row ── */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem',
            marginBottom: '1.25rem',
          }}>
            <div style={{
              padding: '0.7rem 0.85rem', borderRadius: 'var(--radius-sm)',
              background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)',
            }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginBottom: '0.2rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ⏱ Time Estimate
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>
                {job.time_estimate}
              </div>
            </div>
            <div style={{
              padding: '0.7rem 0.85rem', borderRadius: 'var(--radius-sm)',
              background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.2)',
            }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginBottom: '0.2rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                👥 Candidate Bar
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                {job.candidate_comparison}
              </div>
            </div>
          </div>

          {job.missing_skills.length === 0 ? (
            /* ── Perfect match state ── */
            <div style={{
              textAlign: 'center', padding: '2rem',
              background: 'rgba(16,185,129,0.07)', borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(16,185,129,0.2)',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
              <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '0.25rem' }}>Perfect Match!</div>
              <p style={{ fontSize: '0.85rem', marginBottom: 0 }}>
                You have all the required skills for this role. Apply now!
              </p>
            </div>
          ) : (
            <>
              {/* ── 🔥 Critical Skills ── */}
              {job.missing_critical?.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    marginBottom: '0.65rem',
                  }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f87171' }}>
                      🔥 Critical Skills — Learn These First
                    </span>
                    <span style={{
                      fontSize: '0.65rem', padding: '0.1rem 0.45rem', borderRadius: '100px',
                      background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                      color: '#f87171', fontWeight: 600,
                    }}>
                      {job.missing_critical.length} must-have
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {job.missing_critical.map(skill => (
                      <SkillChip
                        key={skill} skill={skill} isCritical
                        courseUrl={getCourseUrl(skill, job.recommended_courses)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── ⚪ Secondary Skills ── */}
              {job.missing_secondary?.length > 0 && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{
                    fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-sub)',
                    marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}>
                    ⚪ Other Skills to Develop
                    <span style={{
                      fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '100px',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)',
                      color: 'var(--text-dim)', fontWeight: 600,
                    }}>
                      {job.missing_secondary.length} secondary
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {job.missing_secondary.map(skill => (
                      <SkillChip
                        key={skill} skill={skill} isCritical={false}
                        courseUrl={getCourseUrl(skill, job.recommended_courses)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Fallback: if no core_skills split available */}
              {!job.missing_critical && job.missing_skills.map(skill => (
                <SkillChip
                  key={skill} skill={skill} isCritical={false}
                  courseUrl={getCourseUrl(skill, job.recommended_courses)}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
