/**
 * CoursesPanel.jsx — v7
 * Smart Course Recommendation Engine UI.
 * Impact-based tiers, Start Learning CTA, skill filter, platform badges.
 */

import React, { useState, useMemo } from 'react';
import { getCoursesForSkills } from '../utils/courseEngine';
import { PLATFORM_COLORS, LEVEL_COLORS, IMPACT_STYLES } from '../utils/courseData';

// ── Course Card Component ───────────────────────────────────────────────────
function CourseCard({ course, currentMatch = 65, skillRank = 0, index = 0 }) {
  const [clicked, setClicked] = useState(false);
  const plt = PLATFORM_COLORS[course.platform] || PLATFORM_COLORS['Coursera'];
  const imp = IMPACT_STYLES[course.impact] || IMPACT_STYLES.Medium;

  const boost   = course.impactBoost;
  const newMatch = Math.min((currentMatch || 65) + boost, 98);
  const isHigh   = course.impact === 'High';

  const handleStart = () => {
    setClicked(true);
    window.open(course.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{
      background: isHigh ? 'linear-gradient(135deg, rgba(239,68,68,0.05), var(--bg-card))' : 'var(--bg-card)',
      border: `1px solid ${isHigh ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
      borderLeft: `3px solid ${imp.color}`,
      borderRadius: 12, overflow: 'hidden',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      animation: `slideUp 0.35s ease ${index * 60}ms both`,
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ padding: '1rem 1.1rem' }}>
        {/* Top row: icon + title + impact badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.7rem' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
          }}>
            {course.platformIcon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.87rem', fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.3, marginBottom: '0.15rem' }}>
              {course.title}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-4)' }}>
              Covers: <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{course.matchedSkill || course.skill}</span>
            </div>
          </div>
          {/* Impact badge */}
          <span style={{
            flexShrink: 0, fontSize: '0.62rem', fontWeight: 700, padding: '0.15rem 0.5rem',
            borderRadius: 100, background: imp.bg, border: `1px solid ${imp.border}`, color: imp.color,
          }}>
            {imp.icon} {course.impact}
          </span>
        </div>

        {/* Badges row */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ padding: '0.18rem 0.55rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: plt.bg, border: `1px solid ${plt.border}`, color: plt.color }}>
            {course.platform}
          </span>
          <span style={{ padding: '0.18rem 0.55rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 500, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: LEVEL_COLORS[course.level] || 'var(--text-4)' }}>
            {course.level}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-4)' }}>⏱ {course.duration}</span>
          {course.free && (
            <span style={{ padding: '0.15rem 0.45rem', borderRadius: 100, fontSize: '0.65rem', fontWeight: 700, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#4ade80' }}>FREE</span>
          )}
        </div>

        {/* Description */}
        <div style={{ fontSize: '0.77rem', color: 'var(--text-3)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
          {course.description}
        </div>

        {/* Impact insight + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            fontSize: '0.75rem', color: '#a5b4fc', lineHeight: 1.4,
            padding: '0.35rem 0.7rem', background: 'rgba(99,102,241,0.1)', borderRadius: 7, border: '1px solid rgba(99,102,241,0.2)',
          }}>
            🎯 <strong style={{ color: 'var(--green)' }}>+{boost}%</strong> match improvement
          </div>
          <button
            onClick={handleStart}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 1rem', borderRadius: 8, cursor: 'pointer',
              background: clicked ? 'rgba(16,185,129,0.2)' : isHigh ? 'var(--primary)' : 'rgba(99,102,241,0.2)',
              color: clicked ? 'var(--green)' : isHigh ? 'white' : '#c4b5fd',
              fontSize: '0.78rem', fontWeight: 700, transition: 'all 0.2s ease',
              border: clicked ? '1px solid var(--green-border)' : isHigh ? 'none' : '1px solid rgba(99,102,241,0.3)',
            }}
          >
            {clicked ? '✓ Opened' : '🔗 Start Learning'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tier Section Header ─────────────────────────────────────────────────────
function TierHeader({ tier, count }) {
  const styles = {
    High:   { color: '#f87171', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)',   icon: '🔴', label: 'High Impact — Learn These First' },
    Medium: { color: '#fbbf24', bg: 'rgba(245,158,11,0.07)',  border: 'rgba(245,158,11,0.18)', icon: '🟡', label: 'Medium Impact — Supporting Skills' },
    Low:    { color: '#94a3b8', bg: 'rgba(148,163,184,0.05)', border: 'rgba(148,163,184,0.15)',icon: '⚪', label: 'Optional — Nice to Have' },
  };
  const s = styles[tier] || styles.Medium;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.85rem', borderRadius: 8, background: s.bg, border: `1px solid ${s.border}`, marginBottom: '0.75rem', marginTop: '0.5rem' }}>
      <span>{s.icon}</span>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
      <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: s.color, fontWeight: 600 }}>{count} course{count !== 1 ? 's' : ''}</span>
    </div>
  );
}

// ── Main CoursesPanel ───────────────────────────────────────────────────────
export default function CoursesPanel({
  courses     = [],       // Legacy backend courses (from resume analysis)
  missingSkills = [],     // Skills to find courses for via engine
  presentSkills = [],     // Skills already known
  currentMatch = 65,      // For impact calculation
  title = 'Recommended Courses',
  subtitle = 'Curated learning paths to bridge your skill gaps',
  compact = false,        // Compact mode for JDMatcher inline use
}) {
  const [filter, setFilter]   = useState('All');
  const [platform, setPlatform] = useState('All');

  // Generate engine-matched courses from missing skills
  const engineCourses = useMemo(() => {
    if (!missingSkills.length) return [];
    return getCoursesForSkills(missingSkills, presentSkills, { maxTotal: 14, maxPerSkill: 2 });
  }, [missingSkills, presentSkills]);

  // Merge: engine courses take priority, then legacy backend courses (deduped)
  const allCourses = useMemo(() => {
    const engineLinks = new Set(engineCourses.map(c => c.link));
    const legacyMapped = courses
      .filter(c => !engineLinks.has(c.url))
      .map(c => ({
        skill: c.skill || 'General', matchedSkill: c.skill,
        title: c.title, platform: c.platform, platformIcon: c.icon || '📖',
        duration: c.duration, level: c.difficulty, free: c.free,
        link: c.url, impact: 'Medium', impactBoost: 6,
        description: `Closes gap in ${c.skill}.`,
      }));
    return [...engineCourses, ...legacyMapped];
  }, [engineCourses, courses]);

  // Filter + platform options
  const impactFilters = ['All', 'High', 'Medium', 'Low'];
  const platforms     = ['All', ...new Set(allCourses.map(c => c.platform))];

  const filtered = allCourses.filter(c => {
    const impOk  = filter === 'All'   || c.impact === filter;
    const pltOk  = platform === 'All' || c.platform === platform;
    return impOk && pltOk;
  });

  // Group by tier
  const high   = filtered.filter(c => c.impact === 'High');
  const medium = filtered.filter(c => c.impact === 'Medium');
  const low    = filtered.filter(c => c.impact === 'Low');

  const totalBoost = allCourses
    .filter(c => c.impact === 'High')
    .slice(0, 3)
    .reduce((a, c) => a + (c.impactBoost || 0), 0);

  if (compact) {
    // Compact mode: just show top 4 cards in a grid
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '0.75rem' }}>
        {allCourses.slice(0, 6).map((course, i) => (
          <CourseCard key={course.link + i} course={course} currentMatch={currentMatch} index={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-1)', marginBottom: '0.3rem', fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-3)' }}>{subtitle}</p>
      </div>

      {/* Summary bar */}
      {allCourses.length > 0 && (
        <div style={{
          display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center',
          padding: '0.85rem 1.1rem', borderRadius: 10, marginBottom: '1.25rem',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))',
          border: '1px solid rgba(99,102,241,0.25)',
        }}>
          <span style={{ fontSize: '1rem' }}>💡</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-2)', flex: 1 }}>
            <strong style={{ color: '#c4b5fd' }}>{allCourses.length} courses</strong> found across {[...new Set(allCourses.map(c => c.platform))].length} platforms.
            {totalBoost > 0 && <> Complete the top 3 High Impact courses to potentially increase your match by <strong style={{ color: 'var(--green)' }}>+{totalBoost}%</strong>.</>}
          </span>
          <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
            <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', borderRadius: 100, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontWeight: 600 }}>🔴 {high.length} High</span>
            <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', borderRadius: 100, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24', fontWeight: 600 }}>🟡 {medium.length} Mid</span>
          </div>
        </div>
      )}

      {/* Filters */}
      {allCourses.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-4)' }}>Impact:</span>
          {impactFilters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.72rem' }}>{f}</button>
          ))}
          {platforms.length > 2 && <>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-4)', marginLeft: '0.5rem' }}>Platform:</span>
            <select value={platform} onChange={e => setPlatform(e.target.value)}
              style={{ padding: '0.25rem 0.6rem', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-2)', fontSize: '0.75rem', cursor: 'pointer' }}>
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </>}
        </div>
      )}

      {/* Grouped content */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-4)', fontSize: '0.9rem' }}>
          {allCourses.length === 0
            ? '🎉 No skill gaps detected! Your profile matches your target roles perfectly.'
            : 'No courses match this filter. Try "All".'}
        </div>
      ) : (
        <div>
          {high.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <TierHeader tier="High" count={high.length} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.75rem' }}>
                {high.map((c, i) => <CourseCard key={c.link + i} course={c} currentMatch={currentMatch} index={i} />)}
              </div>
            </div>
          )}
          {medium.length > 0 && filter === 'All' && (
            <div style={{ marginBottom: '1rem' }}>
              <TierHeader tier="Medium" count={medium.length} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.75rem' }}>
                {medium.map((c, i) => <CourseCard key={c.link + i} course={c} currentMatch={currentMatch} index={i} />)}
              </div>
            </div>
          )}
          {low.length > 0 && filter === 'All' && (
            <div>
              <TierHeader tier="Low" count={low.length} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.75rem' }}>
                {low.map((c, i) => <CourseCard key={c.link + i} course={c} currentMatch={currentMatch} index={i} />)}
              </div>
            </div>
          )}
          {filter !== 'All' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.75rem' }}>
              {filtered.map((c, i) => <CourseCard key={c.link + i} course={c} currentMatch={currentMatch} index={i} />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.72rem', color: 'var(--text-4)' }}>
            🔗 Click "Start Learning" on any card to open the course directly in a new tab.
          </div>
        </div>
      )}
    </div>
  );
}
