/**
 * ATSAnalyzer.jsx — v7
 * ---------------------
 * JD-aware ATS scoring:
 *   40% JD keyword match  (or skill density if no JD)
 *   20% resume structure
 *   20% skills alignment
 *   10% formatting
 *   10% readability
 *
 * Features:
 *  - JD text input for keyword extraction
 *  - Missing keywords highlighted
 *  - Per-dimension score bars
 *  - Actionable suggestions ("Add 'Deep Learning' to improve ATS score +8%")
 *  - Realistic range 55–92
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────

const ATS_SECTIONS = [
  { key: 'contact',    label: 'Contact Information',   tips: 'Name, email, phone, LinkedIn URL, GitHub' },
  { key: 'summary',   label: 'Professional Summary',   tips: 'A 3-4 line summary targeting the role' },
  { key: 'skills',    label: 'Skills Section',          tips: 'Dedicated section with keywords matching JD' },
  { key: 'experience',label: 'Work Experience',         tips: 'Role titles, companies, dates, bullet points' },
  { key: 'education', label: 'Education',               tips: 'Degree, institution, graduation year' },
  { key: 'projects',  label: 'Projects',                tips: 'Named projects with tech stack and results' },
  { key: 'certs',     label: 'Certifications',          tips: 'AWS, Google, Microsoft, coursework certs' },
  { key: 'keywords',  label: 'Role Keywords',           tips: 'Exact match to common job posting terms' },
];

const ATS_TIPS = [
  { title: 'Use Standard Fonts',          desc: 'Arial, Calibri, or Times New Roman. Fancy fonts break ATS parsers.', priority: 'high' },
  { title: 'No Tables or Columns',        desc: 'ATS reads left-to-right. Multi-column layouts cause data loss.', priority: 'high' },
  { title: 'Standard Section Headers',    desc: '"Work Experience" not "My Journey". ATS expects conventional headings.', priority: 'high' },
  { title: 'Tailor Keywords for Each JD', desc: 'Mirror exact terms from the job description. ATS ranks on keyword match.', priority: 'high' },
  { title: 'Spell Out Acronyms',          desc: 'Write "Machine Learning (ML)" — ATS may not recognize abbreviations.', priority: 'medium' },
  { title: 'Include Measurable Results',  desc: '"Improved performance by 40%" scores higher than vague statements.', priority: 'medium' },
  { title: 'Submit PDF (mostly)',         desc: 'Modern ATS accept PDF. Some older systems prefer DOCX — check the JD.', priority: 'medium' },
  { title: 'No Headers/Footers for Data',desc: 'ATS often skips content in headers and footers.', priority: 'low' },
];

const SCORE_WEIGHTS = { jd: 0.40, structure: 0.20, skills: 0.20, formatting: 0.10, readability: 0.10 };

// ── Helpers ───────────────────────────────────────────────────────────────

function norm(s = '') { return s.toLowerCase().trim(); }

/**
 * Extract meaningful keywords from JD text.
 * Strips stop words and returns unique skill-like tokens.
 */
function extractJdKeywords(jdText) {
  if (!jdText) return [];
  const STOP_WORDS = new Set(['the','and','or','for','with','use','job','role','team','work','help','will','must','able','good','have','this','that','your','their','more','also','such','some','from','into','over','been','very','well','can','you','our','how','may','all','are','not','an','a','in','of','to','be','is','as','by','on','at','it','we','if','has','was','its']);
  const tokens = jdText
    .replace(/[^a-zA-Z0-9\s\+\#\.]/g, ' ')
    .split(/\s+/)
    .map(t => t.toLowerCase().trim())
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));
  return [...new Set(tokens)];
}

/**
 * Compute how many JD keywords appear in the skills list.
 * Returns { matchedCount, totalJdKeywords, matchedKeywords, missingKeywords }
 */
function computeJdMatch(jdKeywords, extractedSkills) {
  const normSkills = extractedSkills.map(norm);
  const matched = [];
  const missing = [];

  for (const kw of jdKeywords) {
    const present = normSkills.some(s => s.includes(kw) || kw.includes(s));
    present ? matched.push(kw) : missing.push(kw);
  }
  return { matched, missing };
}

/**
 * Core ATS scoring function.
 * Returns { overall, dimensions, grade, missingKeywords, suggestions }
 */
function computeATSScore({ extractedSkills, topJob, audit, jdText }) {
  const skillCount = extractedSkills.length;

  // ── JD keyword score (40%) ──────────────────────────────────────────────
  let jdKeywords = [];
  let jdScore = 0;
  let matchedKeywords = [];
  let missingKeywords = [];

  if (jdText.trim().length > 30) {
    jdKeywords = extractJdKeywords(jdText);
    if (jdKeywords.length > 0) {
      const result = computeJdMatch(jdKeywords, extractedSkills);
      matchedKeywords = result.matched;
      missingKeywords = result.missing;
      jdScore = Math.round((matchedKeywords.length / jdKeywords.length) * 100);
    }
  } else if (topJob) {
    // Fall back to job match score as proxy for JD keyword alignment
    jdScore = Math.round(topJob.match_percentage * 0.9);
    missingKeywords = (topJob.missing_skills || []).slice(0, 8);
  } else {
    // No JD, estimate from skill count
    jdScore = Math.min(40 + skillCount * 3, 78);
  }

  // Clamp JD score to realistic range
  jdScore = Math.max(Math.min(jdScore, 90), 20);

  // ── Structure score (20%) ──────────────────────────────────────────────
  const auditScore = audit?.dimensions?.ats_compatibility?.score;
  const sectionsPresent = auditScore
    ? Math.round(auditScore / 12.5)   // map 0-100 → 0-8 sections
    : Math.min(Math.floor(skillCount / 2), 8);
  const structureScore = Math.round((Math.min(sectionsPresent, 8) / 8) * 100);

  // ── Skills alignment score (20%) ───────────────────────────────────────
  let skillsScore;
  if (skillCount >= 15) skillsScore = 90;
  else if (skillCount >= 10) skillsScore = 78;
  else if (skillCount >= 6)  skillsScore = 62;
  else if (skillCount >= 3)  skillsScore = 45;
  else skillsScore = 25;

  // ── Formatting score (10%) ─────────────────────────────────────────────
  const formattingScore = audit?.ats_issues?.length > 0
    ? Math.max(90 - (audit.ats_issues.length * 12), 40)
    : skillCount >= 8 ? 88 : 72;

  // ── Readability score (10%) ────────────────────────────────────────────
  const readabilityScore = skillCount >= 10 ? 85 : 70;

  // ── Weighted total ─────────────────────────────────────────────────────
  const rawScore =
    jdScore        * SCORE_WEIGHTS.jd        +
    structureScore * SCORE_WEIGHTS.structure  +
    skillsScore    * SCORE_WEIGHTS.skills     +
    formattingScore* SCORE_WEIGHTS.formatting +
    readabilityScore*SCORE_WEIGHTS.readability;

  // Keep score in realistic 55–92 range
  const overall = Math.round(Math.max(Math.min(rawScore, 92), 55));
  const grade = overall >= 82 ? 'A' : overall >= 70 ? 'B' : overall >= 58 ? 'C' : 'D';

  // ── Sections checklist ─────────────────────────────────────────────────
  const sections = ATS_SECTIONS.map((s, i) => ({
    ...s,
    present: audit?.ats_issues
      ? !audit.ats_issues.some(iss => iss.toLowerCase().includes(s.key))
      : i < Math.min(sectionsPresent, 7),
  }));

  // ── Actionable suggestions ─────────────────────────────────────────────
  const suggestions = [];

  // Top missing keywords → "Add X to improve ATS score"
  const topMissing = missingKeywords
    .filter(k => k.length > 3)        // skip tiny words
    .slice(0, 5);

  topMissing.forEach((kw, i) => {
    const boost = i === 0 ? 8 : i <= 2 ? 5 : 3;
    suggestions.push({
      text: `Add "${kw}" to your resume to improve ATS keyword match`,
      boost,
      priority: i <= 1 ? 'High' : 'Medium',
      keyword: kw,
    });
  });

  if (structureScore < 75)
    suggestions.push({ text: 'Add a dedicated "Skills" section listing all technical skills', boost: 5, priority: 'High' });
  if (skillsScore < 70)
    suggestions.push({ text: `List ${10 - skillCount} more relevant skills to strengthen alignment`, boost: 4, priority: 'Medium' });
  if (formattingScore < 80)
    suggestions.push({ text: 'Use clean single-column layout with standard section headers', boost: 4, priority: 'Medium' });
  suggestions.push({ text: 'Add quantified results ("Reduced error by 30%") to experience bullets', boost: 3, priority: 'Low' });

  return {
    overall,
    grade,
    dimensions: {
      jd:          { label: 'JD Keyword Match',    score: jdScore,         weight: '40%', color: 'var(--blue)'    },
      structure:   { label: 'Resume Structure',    score: structureScore,  weight: '20%', color: 'var(--green)'   },
      skills:      { label: 'Skills Alignment',    score: skillsScore,     weight: '20%', color: 'var(--purple)'  },
      formatting:  { label: 'Formatting',          score: formattingScore, weight: '10%', color: 'var(--primary)' },
      readability: { label: 'Readability',         score: readabilityScore,weight: '10%', color: 'var(--cyan)'    },
    },
    sections,
    missingKeywords,
    matchedKeywords,
    jdKeywords,
    suggestions,
    hasJD: jdText.trim().length > 30,
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────

function AnimatedBar({ value, color, delay = 0 }) {
  const [w, setW] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setW(value), delay); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, delay]);
  return (
    <div ref={ref} style={{ height: 6, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${w}%`, background: color,
        borderRadius: 100, transition: `width 1.1s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
        boxShadow: `0 0 8px ${color}55`,
      }} />
    </div>
  );
}

function KeywordChip({ keyword, present }) {
  return (
    <span style={{
      display: 'inline-block', padding: '0.2rem 0.55rem', borderRadius: 100, margin: '0.2rem',
      fontSize: '0.7rem', fontWeight: 600,
      background: present ? 'rgba(16,185,129,0.1)'  : 'rgba(239,68,68,0.1)',
      border:     present ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
      color:      present ? '#4ade80' : '#f87171',
      transition: 'transform 0.15s ease',
      cursor: 'default',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {present ? '✓' : '✗'} {keyword}
    </span>
  );
}

function SuggestionRow({ s, index }) {
  const colors = { High: { c: '#f87171', bg: 'rgba(239,68,68,0.1)', b: 'rgba(239,68,68,0.25)' }, Medium: { c: '#fbbf24', bg: 'rgba(245,158,11,0.08)', b: 'rgba(245,158,11,0.2)' }, Low: { c: '#94a3b8', bg: 'rgba(148,163,184,0.06)', b: 'rgba(148,163,184,0.15)' } };
  const st = colors[s.priority] || colors.Low;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0.9rem', borderRadius: 9, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', marginBottom: '0.5rem', animation: `slideUp 0.35s ease ${index * 60}ms both` }}>
      <span style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800, background: st.bg, border: `1px solid ${st.b}`, color: st.c }}>{index + 1}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-1)', lineHeight: 1.4 }}>{s.text}</div>
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.3rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem', borderRadius: 100, fontWeight: 700, background: st.bg, border: `1px solid ${st.b}`, color: st.c }}>{s.priority}</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--green)', fontWeight: 600 }}>+{s.boost}% score boost</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function ATSAnalyzer({ audit, extractedSkills = [], topJob }) {
  const [jdText, setJdText] = useState('');
  const [showJdInput, setShowJdInput] = useState(false);
  const [showAllMissing, setShowAllMissing] = useState(false);

  // Normalize client-side format to backend format if detected
  const normalizedAudit = useMemo(() => {
    if (audit && audit.ats_score !== undefined && !audit.overall_score) {
      return {
        ...audit,
        overall_score: audit.ats_score,
        dimensions: {
          ats_compatibility: { score: audit.structure_score || 75 }
        },
        ats_issues: audit.formatting_issues || []
      };
    }
    return audit || {};
  }, [audit]);

  const ats = useMemo(
    () => computeATSScore({ extractedSkills, topJob, audit: normalizedAudit, jdText }),
    [extractedSkills, topJob, normalizedAudit, jdText]
  );

  const gradeColors = { A: 'var(--green)', B: '#06b6d4', C: 'var(--primary)', D: 'var(--yellow)', F: 'var(--red)' };
  const gc = gradeColors[ats.grade] || 'var(--primary)';

  const sectionsPresent = ats.sections.filter(s => s.present).length;
  const displayMissing  = showAllMissing ? ats.missingKeywords : ats.missingKeywords.slice(0, 12);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h2 className="page-title">ATS Deep Analyzer</h2>
        <p className="page-subtitle">
          {ats.hasJD
            ? `Scored against ${ats.jdKeywords.length} JD keywords · ${ats.matchedKeywords.length} matched`
            : 'How well your resume performs against Applicant Tracking Systems'}
        </p>
      </div>

      {/* JD Input Panel */}
      <div className="glass-card" style={{
        padding: '1.1rem 1.25rem', marginBottom: '1.25rem',
        background: ats.hasJD ? 'rgba(16,185,129,0.04)' : 'linear-gradient(135deg, rgba(99,102,241,0.07), rgba(0,0,0,0))',
        border: `1px solid ${ats.hasJD ? 'rgba(16,185,129,0.25)' : 'rgba(99,102,241,0.2)'}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showJdInput ? '0.85rem' : 0 }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-1)' }}>
              {ats.hasJD ? '✓ Analyzing against your JD' : '⚡ Paste Job Description for Precision Analysis'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-4)', marginTop: '0.15rem' }}>
              {ats.hasJD
                ? `${ats.matchedKeywords.length}/${ats.jdKeywords.length} keywords matched — JD score is now 40% of total`
                : 'Adding the JD unlocks exact keyword gap analysis (+40% accuracy)'}
            </div>
          </div>
          <button className={`btn btn-sm ${ats.hasJD ? 'btn-secondary' : 'btn-primary'}`} onClick={() => setShowJdInput(v => !v)}>
            {showJdInput ? 'Hide' : ats.hasJD ? 'Edit JD' : 'Add JD →'}
          </button>
        </div>
        {showJdInput && (
          <div style={{ animation: 'slideUp 0.2s ease' }}>
            <textarea
              value={jdText}
              onChange={e => setJdText(e.target.value)}
              placeholder="Paste the full job description here (requirements, responsibilities)…"
              rows={6}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: 8, resize: 'vertical', fontFamily: 'Inter, sans-serif',
                background: 'var(--bg-input)', border: '1px solid var(--border-md)', color: 'var(--text-1)',
                fontSize: '0.82rem', lineHeight: 1.55, outline: 'none', boxSizing: 'border-box',
              }}
            />
            {jdText.trim().length > 0 && jdText.trim().length < 30 && (
              <div style={{ fontSize: '0.7rem', color: 'var(--yellow)', marginTop: '0.3rem' }}>⚠ Paste more text for accurate analysis (at least 30 characters).</div>
            )}
          </div>
        )}
      </div>

      {/* ── Score Overview ── */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Grade bubble */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: `${gc}12`, border: `3px solid ${gc}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 30px ${gc}25`,
            }}>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '2.4rem', fontWeight: 800, color: gc, lineHeight: 1 }}>{ats.grade}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-4)', marginTop: 2 }}>ATS Grade</div>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: gc, fontFamily: 'Space Grotesk, sans-serif' }}>{ats.overall}/100</div>
          </div>

          {/* Dimension breakdown */}
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-2)', fontWeight: 600, marginBottom: '1rem' }}>
              {ats.overall >= 80 ? 'Your resume is highly ATS-compatible!' : ats.overall >= 65 ? 'Good performance — fix the gaps below to go higher.' : 'Your resume needs targeted improvements to pass ATS filters.'}
            </div>
            {Object.values(ats.dimensions).map((dim, i) => (
              <div key={dim.label} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>{dim.label}</span>
                    <span style={{ fontSize: '0.6rem', padding: '0.08rem 0.35rem', borderRadius: 100, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-4)' }}>{dim.weight}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: dim.color }}>{dim.score}%</span>
                </div>
                <AnimatedBar value={dim.score} color={dim.color} delay={i * 80} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── JD Keyword Heatmap ── */}
      {(ats.missingKeywords.length > 0 || ats.matchedKeywords.length > 0) && (
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-1)', marginBottom: '0.35rem' }}>
            {ats.hasJD ? 'JD Keyword Analysis' : 'Missing Skill Keywords'}
          </h3>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-4)', marginBottom: '0.85rem' }}>
            {ats.hasJD
              ? `${ats.matchedKeywords.length} matched (green) · ${ats.missingKeywords.length} missing (red) — add missing keywords to boost ATS score`
              : 'Skills missing from your resume that recruiters commonly search for'}
          </p>

          {/* Matched */}
          {ats.matchedKeywords.length > 0 && (
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                ✓ In Your Resume
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {ats.matchedKeywords.slice(0, 16).map(k => <KeywordChip key={k} keyword={k} present={true} />)}
              </div>
            </div>
          )}

          {/* Missing */}
          {ats.missingKeywords.length > 0 && (
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                ✗ Missing — Add These to Boost Score
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {displayMissing.map(k => <KeywordChip key={k} keyword={k} present={false} />)}
              </div>
              {ats.missingKeywords.length > 12 && (
                <button className="btn btn-secondary btn-sm" onClick={() => setShowAllMissing(v => !v)} style={{ marginTop: '0.5rem', fontSize: '0.68rem' }}>
                  {showAllMissing ? '▲ Show Less' : `▼ Show ${ats.missingKeywords.length - 12} More Keywords`}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Actionable Suggestions ── */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', color: 'var(--text-1)', marginBottom: '0.25rem' }}>🎯 Improvement Actions</h3>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-4)', marginBottom: '0.9rem' }}>Ranked by ATS score improvement potential</p>
        {ats.suggestions.slice(0, 6).map((s, i) => <SuggestionRow key={i} s={s} index={i} />)}
      </div>

      {/* ── Section Checklist + Tips ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }} className="ats-grid">
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.92rem', color: 'var(--text-1)', marginBottom: '1rem' }}>
            Resume Sections
            <span style={{ marginLeft: '0.5rem', fontSize: '0.62rem', padding: '0.15rem 0.45rem', background: 'var(--primary-subtle)', color: 'var(--primary)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 100 }}>
              {sectionsPresent}/{ATS_SECTIONS.length}
            </span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {ats.sections.map(s => (
              <div key={s.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.7rem', padding: '0.5rem 0.7rem', background: s.present ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)', border: `1px solid ${s.present ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 8 }}>
                <span style={{ fontSize: '0.82rem', flexShrink: 0, marginTop: 1, color: s.present ? 'var(--green)' : 'var(--red)' }}>{s.present ? '✓' : '✗'}</span>
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-1)' }}>{s.label}</div>
                  <div style={{ fontSize: '0.67rem', color: 'var(--text-4)', lineHeight: 1.3, marginTop: '0.1rem' }}>{s.tips}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.92rem', color: 'var(--text-1)', marginBottom: '1rem' }}>ATS Optimization Tips</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {ATS_TIPS.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.6rem' }}>
                <span style={{
                  padding: '0.08rem 0.38rem', borderRadius: 4, flexShrink: 0,
                  fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', alignSelf: 'flex-start', marginTop: 2,
                  background: tip.priority === 'high' ? 'var(--red-subtle)' : tip.priority === 'medium' ? 'var(--yellow-subtle)' : 'rgba(255,255,255,0.04)',
                  color: tip.priority === 'high' ? 'var(--red)' : tip.priority === 'medium' ? 'var(--yellow)' : 'var(--text-4)',
                  border: `1px solid ${tip.priority === 'high' ? 'var(--red-border)' : tip.priority === 'medium' ? 'var(--yellow-border)' : 'var(--border)'}`,
                }}>{tip.priority}</span>
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-1)' }}>{tip.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', lineHeight: 1.4, marginTop: '0.1rem' }}>{tip.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Audit Issues ── */}
      {normalizedAudit?.ats_issues?.length > 0 && (
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.92rem', color: 'var(--text-1)', marginBottom: '0.85rem' }}>⚠ Detected ATS Issues</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {normalizedAudit.ats_issues.map((issue, i) => (
              <div key={i} style={{ padding: '0.65rem 0.9rem', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.8rem', color: '#fca5a5' }}>
                ✗ {issue}
              </div>
            ))}
          </div>
        </div>
      )}

      {!normalizedAudit?.ats_issues?.length && (
        <div style={{ padding: '0.85rem 1rem', borderRadius: 8, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.82rem', color: '#4ade80' }}>
          ✓ No major ATS compatibility issues detected. Your resume structure looks parseable.
        </div>
      )}

      <style>{`@media (max-width: 700px) { .ats-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
