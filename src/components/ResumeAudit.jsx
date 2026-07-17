/**
 * ResumeAudit.jsx
 * ---------------
 * Visual 5-dimension resume audit with:
 * - SVG spider/radar chart
 * - Per-dimension score cards with color coding
 * - ATS compatibility checklist
 * - Priority action items
 * - Overall grade display (A/B/C/D/F)
 */

import React, { useRef, useEffect, useState } from 'react';

const DIMENSIONS = [
  { key: 'skills_coverage',   label: 'Skills',         icon: '🔧', color: '#6366f1' },
  { key: 'ats_compatibility', label: 'ATS Score',       icon: '🤖', color: '#06b6d4' },
  { key: 'certifications',    label: 'Certifications',  icon: '🏆', color: '#f472b6' },
  { key: 'project_depth',     label: 'Projects',        icon: '💻', color: '#10b981' },
  { key: 'experience_level',  label: 'Experience',      icon: '📅', color: '#f59e0b' },
];

// ─── SVG Radar / Spider Chart ─────────────────────────────────────────────────
function RadarChart({ dimensions, scores }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setAnimated(true); observer.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const size   = 220;
  const cx     = size / 2;
  const cy     = size / 2;
  const radius = 85;
  const n      = dimensions.length;

  // Compute polygon point positions
  const angleFor = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const getPoint = (i, r) => {
    const a = angleFor(i);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Score polygon
  const scorePoints = dimensions.map((d, i) => {
    const pct = (animated ? (scores[d.key] || 0) : 0) / 100;
    return getPoint(i, radius * pct);
  });

  const polygonPath = scorePoints.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  ).join(' ') + ' Z';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
          </radialGradient>
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Grid rings */}
        {rings.map((ring, ri) => {
          const pts = Array.from({ length: n }, (_, i) => getPoint(i, radius * ring));
          const path = pts.map((p, i) =>
            `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
          ).join(' ') + ' Z';
          return (
            <path
              key={ri}
              d={path}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          );
        })}

        {/* Axis lines */}
        {dimensions.map((_, i) => {
          const end = getPoint(i, radius);
          return (
            <line key={i}
              x1={cx} y1={cy}
              x2={end.x.toFixed(1)} y2={end.y.toFixed(1)}
              stroke="rgba(255,255,255,0.07)" strokeWidth={1}
            />
          );
        })}

        {/* Score polygon */}
        <path
          d={polygonPath}
          fill="url(#radarFill)"
          stroke="url(#radarStroke)"
          strokeWidth={2}
          style={{ transition: 'all 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />

        {/* Score dots */}
        {scorePoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x} cy={p.y} r={4}
            fill={dimensions[i].color}
            stroke="rgba(0,0,0,0.5)" strokeWidth={1.5}
            style={{ transition: 'all 1.2s cubic-bezier(0.4,0,0.2,1)' }}
          />
        ))}

        {/* Labels */}
        {dimensions.map((d, i) => {
          const labelPoint = getPoint(i, radius + 22);
          return (
            <text
              key={i}
              x={labelPoint.x} y={labelPoint.y}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="10" fill="#94a3b8"
              fontFamily="Outfit, sans-serif"
            >
              {d.label}
            </text>
          );
        })}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={3} fill="rgba(99,102,241,0.5)" />
      </svg>
    </div>
  );
}

// ─── Grade Badge ──────────────────────────────────────────────────────────────
function GradeBadge({ grade, grade_label, overall_score }) {
  const colors = {
    A: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)', text: '#34d399' },
    B: { bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.35)',  text: '#22d3ee' },
    C: { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.35)', text: '#818cf8' },
    D: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', text: '#fbbf24' },
    F: { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.35)',  text: '#f87171' },
  };
  const c = colors[grade] || colors.C;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: c.bg, border: `3px solid ${c.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2.2rem', fontWeight: 800, color: c.text,
        boxShadow: `0 0 30px ${c.border}`,
        animation: 'scaleIn 0.5s ease forwards',
      }}>
        {grade}
      </div>
      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9' }}>{grade_label}</div>
      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Overall Score: {overall_score}/100</div>
    </div>
  );
}

// ─── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ score, color }) {
  const [w, setW] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setW(score); observer.disconnect(); }
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [score]);

  return (
    <div ref={ref} style={{
      height: 5, borderRadius: 100,
      background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
    }}>
      <div style={{
        height: '100%', width: `${w}%`,
        background: color, borderRadius: 100,
        transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: `0 0 8px ${color}66`,
      }} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ResumeAudit({ audit }) {
  if (!audit) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📄</div>
        <div style={{ color: '#64748b' }}>Resume audit data unavailable.</div>
        <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.5rem' }}>
          Re-upload your resume with the latest backend to see the full audit.
        </div>
      </div>
    );
  }

  // Normalize client-side format to backend format if detected
  let normalizedAudit = { ...audit };
  
  if (audit.ats_score !== undefined && !audit.overall_score) {
    const overall = audit.ats_score;
    const grade = overall >= 85 ? "A" : overall >= 70 ? "B" : overall >= 55 ? "C" : overall >= 40 ? "D" : "F";
    const grade_labels = { A: "Outstanding Resume", B: "Strong Resume", C: "Good Foundation", D: "Needs Improvement", F: "Significant Gaps" };
    
    normalizedAudit = {
      overall_score: overall,
      grade,
      grade_label: grade_labels[grade],
      dimensions: {
        skills_coverage:   { score: audit.keyword_score || 70, label: "Skills", feedback: "Ensure you list relevant keywords matching your target role." },
        ats_compatibility: { score: audit.structure_score || 75, label: "ATS Score", feedback: "Ensure standard headers and single-column formatting." },
        certifications:    { score: audit.impact_score || 65, label: "Certifications", feedback: "Include professional certifications and training programs." },
        project_depth:     { score: audit.readability || 80, label: "Projects", feedback: "Provide detailed descriptions of your personal and professional projects." },
        experience_level:  { score: audit.ats_score || 70, label: "Experience", feedback: "Add concrete achievements and metrics to your career history." },
      },
      ats_issues: audit.formatting_issues || [],
      certifications_found: [],
      priority_actions: [
        { dimension: "Skills", score: audit.keyword_score || 70, action: "Add relevant keywords from job description to your resume." },
        { dimension: "ATS Score", score: audit.structure_score || 75, action: "Fix formatting issues listed in the checklist." },
        { dimension: "Certifications", score: audit.impact_score || 65, action: "Highlight professional certifications and credentials." },
      ].sort((a, b) => a.score - b.score)
    };
  }

  const {
    overall_score = 0,
    grade = 'C',
    grade_label = 'Good Foundation',
    dimensions = {},
    ats_issues = [],
    certifications_found = [],
    priority_actions = []
  } = normalizedAudit || {};

  // Scores map for radar
  const scores = Object.fromEntries(
    Object.entries(dimensions || {}).map(([k, v]) => [k, v?.score || 0])
  );

  return (
    <div className="animate-fade-in">
      {/* ── Top: Grade + Radar ── */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div className="section-icon section-icon-purple">📊</div>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#f1f5f9', marginBottom: 0 }}>Resume Audit</h3>
            <p style={{ fontSize: '0.8rem', marginBottom: 0 }}>5-dimension visual analysis</p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '2rem',
          alignItems: 'center',
        }} className="audit-top-grid">
          {/* Radar chart */}
          <RadarChart dimensions={DIMENSIONS} scores={scores} />

          {/* Grade + overall */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <GradeBadge grade={grade} grade_label={grade_label} overall_score={overall_score} />

            {/* Overall progress bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Resume Strength</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#818cf8' }}>{overall_score}%</span>
              </div>
              <ScoreBar score={overall_score} color="linear-gradient(90deg,#6366f1,#06b6d4)" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Dimension Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '0.85rem', marginBottom: '1.25rem',
      }}>
        {DIMENSIONS.map(d => {
          const dim = dimensions?.[d.key];
          if (!dim) return null;
          return (
            <div
              key={d.key}
              className="glass-card"
              style={{ padding: '1.1rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: `${d.color}18`, border: `1px solid ${d.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem',
                }}>{d.icon}</div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>{d.label}</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{dim.label}</div>
                </div>
                <div style={{
                  marginLeft: 'auto', fontSize: '1rem', fontWeight: 800,
                  color: dim.score >= 75 ? '#34d399' : dim.score >= 50 ? '#fbbf24' : '#f87171',
                }}>{dim.score}</div>
              </div>
              <ScoreBar score={dim.score} color={d.color} />
              <p style={{
                fontSize: '0.72rem', color: '#64748b',
                marginTop: '0.6rem', lineHeight: 1.5,
              }}>
                {dim.feedback}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── ATS Issues + Priority Actions ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
      }} className="audit-bottom-grid">

        {/* ATS Issues */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div className="section-icon section-icon-cyan" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>🤖</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>ATS Compatibility</div>
          </div>
          {ats_issues && ats_issues.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {ats_issues.map((issue, i) => (
                <div key={i} style={{
                  padding: '0.5rem 0.75rem',
                  background: issue.startsWith('❌') ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                  border: `1px solid ${issue.startsWith('❌') ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
                  borderRadius: 8, fontSize: '0.78rem', color: '#cbd5e1',
                }}>
                  {issue}
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '0.75rem',
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 8, fontSize: '0.8rem', color: '#34d399',
            }}>
              ✅ ATS-friendly structure detected!
            </div>
          )}

          {/* Certs found */}
          {certifications_found && certifications_found.length > 0 && (
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#475569', marginBottom: '0.4rem' }}>
                Certifications detected:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {certifications_found.slice(0, 4).map(c => (
                  <span key={c} className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                    🏆 {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Priority Actions */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div className="section-icon section-icon-orange" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>🎯</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>Top 3 Priorities</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(priority_actions || []).map((p, i) => (
              <div key={i} style={{
                display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  background: i === 0 ? 'rgba(239,68,68,0.15)' : i === 1 ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.15)',
                  border: `1px solid ${i === 0 ? 'rgba(239,68,68,0.3)' : i === 1 ? 'rgba(245,158,11,0.3)' : 'rgba(99,102,241,0.3)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 700,
                  color: i === 0 ? '#f87171' : i === 1 ? '#fbbf24' : '#818cf8',
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.15rem' }}>
                    {p.dimension} · {p.score}/100
                  </div>
                  <div style={{ fontSize: '0.73rem', color: '#64748b', lineHeight: 1.5 }}>
                    {p.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .audit-top-grid { grid-template-columns: 1fr !important; text-align: center; }
          .audit-bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
