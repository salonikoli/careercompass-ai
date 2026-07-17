/**
 * LinkedInOptimizer.jsx — v7
 * AI-powered profile analyzer: dynamic scoring, smart checklist,
 * suggestion engine, Next Steps panel, and Groq AI deep analysis.
 */

import React, { useState, useMemo } from 'react';
import { computeProfileScore } from '../utils/profileAnalyzer';
import { optimizeLinkedIn } from '../utils/api';

// ── Impact badge styles ────────────────────────────────────────────────────
const IMPACT = {
  High:   { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',   color: '#f87171',  icon: '🔴' },
  Medium: { bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.25)', color: '#fbbf24',  icon: '🟡' },
  Low:    { bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)', color: '#94a3b8',  icon: '⚪' },
};

// ── Status styles for dynamic checklist ───────────────────────────────────
const STATUS = {
  done:    { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.25)',  color: '#4ade80',  icon: '✔', label: 'Done'  },
  warn:    { bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.22)', color: '#fbbf24',  icon: '⚠', label: 'Improve' },
  missing: { bg: 'rgba(239,68,68,0.07)',  border: 'rgba(239,68,68,0.2)',   color: '#f87171',  icon: '✗', label: 'Missing' },
};

// ── Subcomponents ─────────────────────────────────────────────────────────

function ScoreRing({ score }) {
  const color = score >= 75 ? 'var(--green)' : score >= 50 ? 'var(--primary)' : 'var(--yellow)';
  const r = 38; const circ = 2 * Math.PI * r; const dash = (score / 100) * circ;
  return (
    <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
      <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.16,1,0.3,1)', filter: `drop-shadow(0 0 8px ${color}55)` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color, fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: '0.62rem', color: 'var(--text-4)', marginTop: 2 }}>/100</span>
      </div>
    </div>
  );
}

function BreakdownBar({ label, score, max, note }) {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 75 ? 'var(--green)' : pct >= 45 ? 'var(--primary)' : 'var(--yellow)';
  return (
    <div style={{ marginBottom: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-2)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: '0.72rem', color, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>{score}/{max}</span>
      </div>
      <div style={{ height: 5, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 100, transition: 'width 1.2s ease' }} />
      </div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-4)', marginTop: '0.25rem', lineHeight: 1.35 }}>{note}</div>
    </div>
  );
}

function ChecklistItem({ item }) {
  const s = STATUS[item.status];
  const imp = IMPACT[item.impact];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.65rem',
      padding: '0.6rem 0.85rem',
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 8, transition: 'all 0.2s ease',
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: '0.75rem', fontWeight: 700,
        background: `${s.color}25`, color: s.color, border: `1px solid ${s.color}50`,
      }}>{s.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-1)' }}>{item.label}</div>
        <div style={{ fontSize: '0.66rem', color: 'var(--text-4)', lineHeight: 1.35, marginTop: '0.1rem' }}>{item.tips}</div>
      </div>
      <span style={{
        fontSize: '0.6rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: 100, flexShrink: 0,
        background: imp.bg, border: `1px solid ${imp.border}`, color: imp.color,
      }}>{imp.icon} {item.impact}</span>
    </div>
  );
}

function SuggestionCard({ suggestion, index }) {
  const imp = IMPACT[suggestion.impact];
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
      padding: '0.85rem 1rem', borderRadius: 8, marginBottom: '0.55rem',
      background: 'rgba(255,255,255,0.025)', border: `1px solid ${imp.border}`,
      animation: `slideUp 0.3s ease ${index * 60}ms both`,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem',
        background: imp.bg, border: `1px solid ${imp.border}`, color: imp.color, fontWeight: 700,
      }}>{index + 1}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-1)', fontWeight: 500, lineHeight: 1.4, marginBottom: '0.25rem' }}>
          {suggestion.text}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: 100, fontWeight: 700, background: imp.bg, border: `1px solid ${imp.border}`, color: imp.color }}>
            {imp.icon} {suggestion.impact}
          </span>
          <span style={{ fontSize: '0.67rem', color: 'var(--green)', fontWeight: 600 }}>+{suggestion.boost}% boost</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function LinkedInOptimizer({ data }) {
  const {
    extracted_skills   = [],
    best_fit_job       = '',
    best_fit_job_score = 0,
    top_3_matches      = [],
    career_readiness_score = 0,
  } = data;

  const [url,       setUrl]       = useState('');
  const [loading,   setLoading]   = useState(false);
  const [aiResult,  setAiResult]  = useState(null);
  const [error,     setError]     = useState('');
  const [showAll,   setShowAll]   = useState(false);

  const topJob = top_3_matches[0] || null;
  const role   = best_fit_job || 'Software Engineer';

  // ── Compute profile score (reactive to URL) ──────────────────────────────
  const analysis = useMemo(
    () => computeProfileScore(data, url),
    [data, url]
  );
  const { score, breakdown, checklist, suggestions, nextSteps, estimatedReadiness } = analysis;
  const scoreColor = score >= 75 ? 'var(--green)' : score >= 50 ? 'var(--primary)' : 'var(--yellow)';

  const doneCount    = checklist.filter(c => c.status === 'done').length;
  const missingCount = checklist.filter(c => c.status === 'missing').length;
  const warnCount    = checklist.filter(c => c.status === 'warn').length;

  // ── Groq AI analysis ─────────────────────────────────────────────────────
  const handleOptimize = async (useUrl) => {
    setLoading(true); setError('');
    try {
      const d = await optimizeLinkedIn(
        useUrl ? url : '',
        extracted_skills,
        role
      );
      if (d.error) setError(d.analysis || 'An error occurred.');
      else setAiResult(d);
    } catch (err) {
      setError(err.message || 'Failed to connect to the LinkedIn Optimizer. Make sure the backend is running.');
    }
    finally { setLoading(false); }
  };

  // ── Derived content ───────────────────────────────────────────────────────
  const headlineOptions = [
    `${role} | ${extracted_skills[0] || 'Python'} | ${extracted_skills[1] || 'Machine Learning'} | Open to Opportunities`,
    `Aspiring ${role} | ${extracted_skills.slice(0, 3).join(' · ') || 'Tech Enthusiast'} | Building Tomorrow`,
    `${role} | ${extracted_skills[0] || 'Python'} | ${extracted_skills[2] || 'SQL'} | ${topJob?.company_name ? `Targeting ${topJob.company_name}` : 'Top Tech Roles'}`,
  ];

  const aboutTemplate = `I'm a passionate ${role} with expertise in ${extracted_skills.slice(0, 4).join(', ')}.\n\nCurrently building [YOUR PROJECT/ROLE] where I apply [KEY SKILLS] to solve real-world problems.${topJob ? `\n\nMy goal is to land a role as a ${topJob.title} at companies like ${topJob.company_name}.` : ''}\n\nWhat I bring:\n• ${extracted_skills[0] || 'Skill 1'} — [describe experience]\n• ${extracted_skills[1] || 'Skill 2'} — [describe experience]\n• ${extracted_skills[2] || 'Skill 3'} — [describe experience]\n\nOpen to opportunities. Feel free to connect! 🚀`;

  const missingCritical = topJob?.missing_critical || [];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h2 className="page-title">LinkedIn Optimizer</h2>
        <p className="page-subtitle">AI-powered profile analysis — scored dynamically from your resume</p>
      </div>

      {/* ── SECTION 1: AI Profile Score ── */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Score Ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <ScoreRing score={score} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: scoreColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Profile Score</span>
          </div>

          {/* Summary */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.4rem' }}>
              {score >= 75 ? 'Your profile is in great shape!'
               : score >= 55 ? 'You\'re close — a few improvements away from greatness.'
               : score >= 35 ? 'Your profile needs key additions to attract recruiters.'
               : 'Your profile needs significant work to compete.'}
            </div>

            {/* Status badges */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.65rem', borderRadius: 100, fontWeight: 600, background: 'var(--green-subtle)', border: '1px solid var(--green-border)', color: 'var(--green)' }}>
                ✔ {doneCount} Done
              </span>
              <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.65rem', borderRadius: 100, fontWeight: 600, background: 'var(--yellow-subtle)', border: '1px solid var(--yellow-border)', color: 'var(--yellow)' }}>
                ⚠ {warnCount} Improve
              </span>
              <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.65rem', borderRadius: 100, fontWeight: 600, background: 'var(--red-subtle)', border: '1px solid var(--red-border)', color: 'var(--red)' }}>
                ✗ {missingCount} Missing
              </span>
            </div>

            {/* Score breakdown bars */}
            <div>
              {Object.values(breakdown).map(b => (
                <BreakdownBar key={b.label} label={b.label} score={b.score} max={b.max} note={b.note} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: AI Groq Analyzer ── */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem', background: 'linear-gradient(135deg,rgba(249,115,22,0.05),rgba(0,0,0,0))', border: '1px solid rgba(249,115,22,0.15)' }}>
        <h3 style={{ fontSize: '0.95rem', color: 'var(--text-1)', marginBottom: '0.5rem' }}>✨ Groq AI Deep Analysis</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginBottom: '1rem' }}>
          Optionally paste your LinkedIn URL for a personalized AI teardown — or run directly with resume data.
          {url && <span style={{ color: 'var(--green)', marginLeft: '0.5rem' }}>✓ URL detected — score recalculated.</span>}
        </p>
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <input
            type="text" placeholder="https://linkedin.com/in/yourname (Optional)"
            value={url} onChange={e => setUrl(e.target.value)}
            disabled={loading}
            style={{ flex: 1, minWidth: 240, padding: '0.55rem 0.85rem', background: 'var(--bg-input)', border: '1px solid var(--border-md)', borderRadius: 8, color: 'var(--text-1)', fontSize: '0.85rem', outline: 'none' }}
          />
          <button className="btn btn-primary btn-sm" onClick={() => handleOptimize(true)} disabled={loading || !url.trim()}>
            {loading ? 'Analyzing…' : 'Analyze LinkedIn URL'}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleOptimize(false)} disabled={loading}>
            Optimize with Resume
          </button>
        </div>
        {error && <div style={{ marginTop: '0.65rem', color: 'var(--red)', fontSize: '0.78rem' }}>⚠ {error}</div>}
      </div>

      {/* AI Result */}
      {aiResult && (
        <div className="glass-card animate-slide-up" style={{ padding: '1.5rem', marginBottom: '1.25rem', border: '1px solid var(--green-border)', background: 'rgba(34,197,94,0.04)' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--green)', marginBottom: '1rem' }}>
            {url ? '🔗 LinkedIn Profile Analysis Complete' : '📄 Resume-Based Optimization Complete'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.55, marginBottom: '1.25rem', padding: '0.85rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
            {aiResult.analysis}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }} className="li-grid">
            <div>
              <h4 style={{ fontSize: '0.82rem', color: 'var(--text-1)', marginBottom: '0.65rem' }}>AI Headline Suggestions</h4>
              {aiResult.headline_suggestions?.map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 7, marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-1)', lineHeight: 1.4, flex: 1 }}>"{h}"</span>
                  <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.62rem', padding: '0.18rem 0.45rem', flexShrink: 0 }} onClick={() => navigator.clipboard?.writeText(h)}>Copy</button>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '0.82rem', color: 'var(--text-1)', marginBottom: '0.65rem' }}>Action Plan</h4>
              <ul style={{ paddingLeft: '1.1rem', margin: 0 }}>
                {aiResult.action_plan?.map((step, i) => (
                  <li key={i} style={{ fontSize: '0.78rem', color: 'var(--text-2)', marginBottom: '0.45rem', lineHeight: 1.45 }}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.82rem', color: 'var(--text-1)', marginBottom: '0.65rem' }}>AI About Section</h4>
            <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-input)', border: '1px solid var(--border-md)', borderRadius: 8, fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {aiResult.about_summary}
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 3: Dynamic Checklist ── */}
      <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-1)', marginBottom: 0 }}>Profile Completeness</h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-4)', marginTop: '0.1rem' }}>Auto-detected from your resume — not manual checkboxes</p>
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: scoreColor }}>
            {doneCount}/{checklist.length} complete
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.4rem' }}>
          {checklist.map(item => <ChecklistItem key={item.id} item={item} />)}
        </div>
      </div>

      {/* ── SECTION 4: Smart Suggestion Engine ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.1rem', marginBottom: '1.25rem' }} className="li-grid">

        {/* Suggestions */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-1)', marginBottom: '0.35rem' }}>🧠 Smart Suggestions</h3>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-4)', marginBottom: '1rem' }}>Ranked by profile impact</p>
          {(showAll ? suggestions : suggestions.slice(0, 4)).map((s, i) => (
            <SuggestionCard key={i} suggestion={s} index={i} />
          ))}
          {suggestions.length > 4 && (
            <button className="btn btn-secondary btn-sm" onClick={() => setShowAll(v => !v)} style={{ marginTop: '0.25rem', width: '100%' }}>
              {showAll ? '▲ Show Less' : `▼ Show ${suggestions.length - 4} More`}
            </button>
          )}
        </div>

        {/* Headlines + Skills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '1.1rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-1)', marginBottom: '0.75rem' }}>📝 Headline Generator</h3>
            <div style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.6rem', padding: '0.3rem 0.6rem', background: 'var(--primary-subtle)', borderRadius: 6 }}>
              Formula: [Role] | [Skill 1] | [Skill 2] | [CTA]
            </div>
            {headlineOptions.map((h, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', padding: '0.55rem 0.7rem', background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)', borderRadius: 7, marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-1)', lineHeight: 1.4, flex: 1 }}>"{h}"</span>
                <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.6rem', padding: '0.15rem 0.4rem', flexShrink: 0 }} onClick={() => navigator.clipboard?.writeText(h)}>Copy</button>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ padding: '1.1rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-1)', marginBottom: '0.65rem' }}>📌 Skills to Pin</h3>
            <div style={{ fontSize: '0.65rem', color: 'var(--green)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>✓ You Have</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.75rem' }}>
              {extracted_skills.slice(0, 7).map(s => <span key={s} className="skill-chip skill-chip-success" style={{ fontSize: '0.68rem' }}>{s}</span>)}
            </div>
            {missingCritical.length > 0 && <>
              <div style={{ fontSize: '0.65rem', color: 'var(--red)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>✗ Critical Gaps</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {missingCritical.slice(0, 5).map(s => <span key={s} className="skill-chip skill-chip-danger" style={{ fontSize: '0.68rem' }}>{s}</span>)}
              </div>
            </>}
          </div>
        </div>
      </div>

      {/* ── SECTION 5: About Template ── */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-1)' }}>About Section Template</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard?.writeText(aboutTemplate)}>Copy</button>
        </div>
        <div style={{ padding: '1rem', background: 'var(--bg-input)', border: '1px solid var(--border-md)', borderRadius: 8, fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.65, whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif' }}>
          {aboutTemplate}
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-4)', marginTop: '0.5rem' }}>
          ✏️ Replace the [bracketed parts] with your actual experience. Aim for 250–300 words.
        </div>
      </div>

      {/* ── SECTION 6: NEXT STEPS PANEL (Critical) ── */}
      <div style={{
        padding: '1.5rem 1.75rem', marginBottom: '1.25rem', borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
        border: '1px solid rgba(99,102,241,0.35)',
        boxShadow: '0 4px 24px rgba(99,102,241,0.1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-1)', marginBottom: '0.2rem', fontFamily: 'Space Grotesk, sans-serif' }}>
              🚀 Your Next Steps
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
              The highest-impact actions to supercharge your career profile right now
            </p>
          </div>
          <div style={{
            padding: '0.45rem 1rem', borderRadius: 100, flexShrink: 0,
            background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
            fontSize: '0.82rem', fontWeight: 700, color: '#c4b5fd',
            fontFamily: 'Space Grotesk, sans-serif',
          }}>
            👉 Estimated readiness: <span style={{ color: 'var(--green)' }}>{estimatedReadiness}%</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {nextSteps.map((step, i) => {
            const imp = IMPACT[step.impact];
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                padding: '0.85rem 1.1rem', borderRadius: 10,
                background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(99,102,241,0.2)',
                animation: `slideUp 0.35s ease ${i * 80}ms both`,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.4)',
                  fontSize: '0.82rem', fontWeight: 800, color: '#a5b4fc', fontFamily: 'Space Grotesk, sans-serif',
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-1)' }}>{step.label}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: 100, fontWeight: 700, background: imp.bg, border: `1px solid ${imp.border}`, color: imp.color }}>
                    {imp.icon} {step.impact}
                  </span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--green)' }}>+{step.boost}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {nextSteps.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--green)', fontSize: '0.9rem', padding: '1rem' }}>
            🎉 Your profile is complete! Keep it updated as you grow.
          </div>
        )}
      </div>

      {/* ── SECTION 7: Connection Strategy ── */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', color: 'var(--text-1)', marginBottom: '0.85rem' }}>Connection Strategy</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.65rem' }}>
          {[
            { icon: '👥', label: 'Join Tech Communities', desc: `Search "${role}" on LinkedIn Groups. Join top-3 groups in your field.` },
            { icon: '✉️', label: 'Personalized Notes',   desc: 'When connecting, send a 50-word personalized note — not the default.' },
            { icon: '📝', label: 'Post Weekly',          desc: 'Share project updates, learnings, or quick tips. Algorithms favor consistency.' },
            { icon: '💬', label: 'Comment Quality',      desc: 'Comment meaningfully on posts by people you want in your network.' },
          ].map(tip => (
            <div key={tip.label} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>{tip.icon}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-1)', marginBottom: '0.2rem' }}>{tip.label}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-4)', lineHeight: 1.45 }}>{tip.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) { .li-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
