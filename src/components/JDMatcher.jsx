/**
 * JDMatcher.jsx  — Job Description Matching (Game-Changer Feature)
 * -----------------------------------------------------------------
 * Allows user to paste any job description and instantly see:
 *  - Match % against their resume skills
 *  - Which JD skills they already have (green chips)
 *  - Which JD skills are missing (red chips)
 *  - Course recommendations for each missing skill
 *  - Improvement suggestions
 *  - Closest matching standard job role
 */

import React, { useState, useRef } from 'react';
import { matchJD } from '../utils/api';
import CoursesPanel from './CoursesPanel';
import { detectRole, detectExperienceLevel, computeWeightedMatch, ROLE_BENCHMARKS } from '../utils/roleIntelligence';
import CopilotTrigger from './CopilotTrigger';

// ---------------------------------------------------------------------------
// Client-side JD matching fallback (used when backend is unavailable)
// ---------------------------------------------------------------------------
const MASTER_SKILLS = [
  'python','java','javascript','typescript','c++','c#','r','scala','go','rust','kotlin','swift','php','ruby','matlab','golang',
  'html','css','react','angular','vue','nodejs','node.js','express','django','flask','fastapi','rest api','graphql','responsive design',
  'machine learning','deep learning','nlp','computer vision','tensorflow','pytorch','keras','scikit-learn','transformers','openai','llm',
  'sql','mysql','postgresql','mongodb','redis','spark','hadoop','pandas','numpy','matplotlib','tableau','power bi','data visualization',
  'data analysis','data engineering','etl','airflow','kafka','excel',
  'aws','azure','gcp','docker','kubernetes','terraform','ansible','jenkins','ci/cd','devops','linux','bash','git','github','gitlab',
  'cybersecurity','network security','penetration testing','cryptography','siem','incident response','firewall',
  'selenium','unit testing','test automation','api testing','postman','jira','agile','scrum',
  'figma','wireframing','user research','prototyping','ui design','ux design','adobe xd','design systems',
  'product strategy','roadmapping','stakeholder management','a/b testing','communication',
  'react native','flutter','firebase','mobile ui','solidity','ethereum','smart contracts','blockchain',
  'technical writing','documentation','markdown','mlops','cloud computing','microservices','api design',
];

function clientSideMatchJD(jdText, resumeSkills) {
  const jdLower = jdText.toLowerCase();
  const jdSkills = MASTER_SKILLS.filter(skill => jdLower.includes(skill));
  if (jdSkills.length === 0) {
    throw new Error('Could not extract recognizable skills from this job description. Make sure it contains technical skill terms.');
  }
  const resumeSet = new Set(resumeSkills.map(s => s.toLowerCase()));
  const matched = jdSkills.filter(s => resumeSet.has(s));
  const missing = jdSkills.filter(s => !resumeSet.has(s));
  const match_percentage = jdSkills.length > 0 ? Math.round((matched.length / jdSkills.length) * 100) : 0;
  let headline;
  if (match_percentage >= 75) headline = `🚀 Excellent! You match ${match_percentage}% of this job description. Apply with confidence!`;
  else if (match_percentage >= 50) headline = `⭐ You are ${match_percentage}% aligned with this JD. A few targeted skills would make you a top candidate.`;
  else if (match_percentage >= 30) headline = `📈 You match ${match_percentage}% of this JD. Focus on the missing skills below to become competitive.`;
  else headline = `💪 You match ${match_percentage}% of this JD. Use this as a gap analysis to plan your learning path.`;
  return {
    jd_skills: jdSkills,
    matched_skills: matched,
    missing_skills: missing,
    match_percentage,
    headline,
    closest_job_role: null,
    improvement_suggestions: missing.slice(0, 5).map(s => `Add "${s}" to your resume — it appears in the job description.`),
    recommended_courses: [],
    _client_side: true,
  };
}

const EXAMPLE_JD = `We are looking for a Data Scientist to join our team.

Requirements:
- Strong proficiency in Python and R
- Experience with Machine Learning and Deep Learning frameworks (TensorFlow, PyTorch)
- Knowledge of SQL and data analysis techniques
- Familiarity with Pandas, NumPy, and Scikit-learn
- Understanding of statistics and data visualization
- Experience with cloud platforms (AWS or GCP)
- Strong communication and problem-solving skills`;

function MatchCircle({ pct }) {
  const color = pct >= 65 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
      <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="45" cy="45" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
        <circle cx="45" cy="45" r={radius} fill="none" stroke={color} strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)', filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '1.3rem', fontWeight: 800, color, lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>match</span>
      </div>
    </div>
  );
}

function SkillChip({ label, type }) {
  const styles = {
    matched: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: '#34d399', icon: '✅' },
    missing: { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)', text: '#f87171', icon: '❌' },
    neutral: { bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.25)', text: '#818cf8', icon: '🔵' },
  };
  const s = styles[type] || styles.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.28rem 0.7rem', borderRadius: '100px',
      background: s.bg, border: `1px solid ${s.border}`,
      fontSize: '0.78rem', color: s.text, fontWeight: 500,
    }}>
      <span style={{ fontSize: '0.7rem' }}>{s.icon}</span> {label}
    </span>
  );
}

export default function JDMatcher({ resumeSkills = [], topJob = null }) {
  const [jdText, setJdText]     = useState('');
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [showAll, setShowAll]   = useState(false);
  const textareaRef             = useRef(null);

  const hasResume = resumeSkills.length > 0;

  const handleAnalyze = async () => {
    if (!jdText.trim()) { setError('Please paste a job description first.'); return; }
    if (jdText.trim().length < 50) { setError('Job description seems too short. Paste the full JD text.'); return; }
    if (!hasResume) { setError('Please upload your resume first to enable JD matching.'); return; }

    setError('');
    setLoading(true);
    setResult(null);

    let data;
    try {
      data = await matchJD(jdText, resumeSkills);
    } catch (backendErr) {
      // Backend unavailable — fall back to client-side keyword matching
      console.warn('[JDMatcher] Backend unavailable, using client-side matching:', backendErr.message);
      try {
        data = clientSideMatchJD(jdText, resumeSkills);
      } catch (clientErr) {
        setError(clientErr.message || 'Failed to analyze job description. Please try again.');
        setLoading(false);
        return;
      }
    }

    // ── Enrich with client-side role intelligence ──
    try {
      const detectedRole  = detectRole(jdText);
      const expLevel      = detectExperienceLevel(jdText);
      const allJdSkills   = [...(data.matched_skills || []), ...(data.missing_skills || [])];
      const weightedStats = computeWeightedMatch(allJdSkills, resumeSkills, detectedRole);
      setResult({ ...data, detectedRole, expLevel, weightedStats });
    } catch {
      setResult(data);
    }
    setLoading(false);
  };

  const handleLoadExample = () => {
    setJdText(EXAMPLE_JD);
    setResult(null);
    setError('');
    textareaRef.current?.focus();
  };

  const handleClear = () => {
    setJdText('');
    setResult(null);
    setError('');
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.3rem' }}>JD Matcher</h2>
          <p style={{ fontSize: '0.88rem' }}>Paste any job description to instantly see how close you are — and exactly what to learn to reach 80%+.</p>
        </div>
        <CopilotTrigger
          message="I just analyzed a job description. What are the most critical missing skills I should learn to improve my JD match score?"
          label="Ask Copilot what to learn"
          variant="ghost"
          icon="🤖"
        />
      </div>

      {/* Input area */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="section-icon section-icon-cyan">📋</div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Paste Job Description
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>
                Copy from LinkedIn, Naukri, Internshala, or any job board
              </div>
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleLoadExample}
            style={{ flexShrink: 0 }}
          >
            Try Example JD
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={jdText}
          onChange={e => { setJdText(e.target.value); setError(''); }}
          placeholder={`Paste the full job description here...\n\nExample:\n"We are looking for a Data Scientist with Python, SQL, Machine Learning experience..."`}
          style={{
            width: '100%', minHeight: '180px', padding: '0.85rem 1rem',
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-sm)', color: 'var(--text-main)',
            fontFamily: 'inherit', fontSize: '0.87rem', lineHeight: 1.6,
            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
          onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
        />

        {/* Character count */}
        {jdText && (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.4rem', textAlign: 'right' }}>
            {jdText.length} characters
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            marginTop: '0.75rem', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm)',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
            fontSize: '0.83rem', color: '#f87171',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Resume warning */}
        {!hasResume && (
          <div style={{
            marginTop: '0.75rem', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm)',
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
            fontSize: '0.83rem', color: '#fbbf24',
          }}>
            ℹ️ Upload your resume first so we can compare your skills against this JD.
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={loading || !jdText.trim()}
            style={{ flex: 1, minWidth: '160px', padding: '0.8rem 1.25rem' }}
          >
            {loading ? (
              <>
                <span style={{
                  width: '16px', height: '16px', borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white',
                  animation: 'spin 0.8s linear infinite', display: 'inline-block', marginRight: '0.5rem',
                }} />
                Analyzing JD...
              </>
            ) : '🔍 Analyze JD Match'}
          </button>
          {jdText && (
            <button className="btn btn-secondary btn-sm" onClick={handleClear}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="animate-slide-up">

          {/* Role + Experience Detection */}
          {(result.detectedRole || result.expLevel) && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {result.detectedRole && (() => {
                const rb = ROLE_BENCHMARKS[result.detectedRole];
                return (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.8rem', borderRadius: 100, fontSize: '0.78rem', fontWeight: 700, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)', color: '#c4b5fd' }}>
                    {rb?.icon} {result.detectedRole}
                  </span>
                );
              })()}
              {result.expLevel && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.8rem', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600, background: result.expLevel === 'Senior' ? 'rgba(239,68,68,0.12)' : result.expLevel === 'Junior' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: '1px solid ' + (result.expLevel === 'Senior' ? 'rgba(239,68,68,0.3)' : result.expLevel === 'Junior' ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'), color: result.expLevel === 'Senior' ? '#f87171' : result.expLevel === 'Junior' ? '#4ade80' : '#fbbf24' }}>
                  📋 {result.expLevel}
                </span>
              )}
            </div>
          )}

          {/* Weighted Score Breakdown */}
          {result.weightedStats && (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem', padding: '0.85rem 1rem', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
              {[
                { label: 'Weighted Match', value: result.weightedStats.overall,        color: result.weightedStats.overall >= 70 ? 'var(--green)' : result.weightedStats.overall >= 45 ? 'var(--primary)' : 'var(--yellow)', bold: true },
                { label: 'Core Skills',   value: result.weightedStats.coreMatch,       color: result.weightedStats.coreMatch >= 70 ? 'var(--green)' : 'var(--yellow)' },
                { label: 'Supporting',    value: result.weightedStats.secondaryMatch,  color: 'var(--blue)' },
              ].map(m => (
                <div key={m.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 70 }}>
                  <div style={{ fontSize: m.bold ? '1.2rem' : '1rem', fontWeight: 800, color: m.color, fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>{m.value}%</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-4)', marginTop: '0.2rem', textAlign: 'center' }}>{m.label}</div>
                </div>
              ))}
              <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '0.72rem', color: 'var(--text-4)' }}>
                Core skills weighted 1.0× · Secondary 0.5× · Optional 0.2×
              </div>
            </div>
          )}

          {/* Headline card */}
          <div className="glass-card" style={{
            padding: '1.5rem', marginBottom: '1.25rem',
            border: `1px solid ${result.match_percentage >= 65 ? 'rgba(16,185,129,0.3)' : result.match_percentage >= 40 ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)'}`,
          }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <MatchCircle pct={result.match_percentage} />
              <div style={{ flex: 1, minWidth: '200px' }}>
                {/* Human-language headline */}
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', lineHeight: 1.4 }}>
                  {result.match_percentage >= 75 ? 'You are a strong candidate for this role.' :
                   result.match_percentage >= 55 ? "You're close — a few skills will make you highly competitive." :
                   result.match_percentage >= 35 ? 'You are on the right track. Focus on the gaps below.' :
                   'With focused learning, you can reach this role within months.'}
                </div>
                {result.closest_job_role && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.35rem 0.85rem', borderRadius: '100px',
                    background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
                    fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 500,
                  }}>
                    <span>{result.closest_job_role.icon}</span>
                    Closest role: {result.closest_job_role.title} @ {result.closest_job_role.company_name}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <div style={{ padding: '0.5rem 0.9rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>{result.matched_skills.length}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-sub)' }}>You Have</div>
                </div>
                <div style={{ padding: '0.5rem 0.9rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f87171' }}>{result.missing_skills.length}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-sub)' }}>To Learn</div>
                </div>
                <div style={{ padding: '0.5rem 0.9rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#818cf8' }}>{result.jd_skills.length}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-sub)' }}>JD Skills</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── IMPACT INSIGHT ENGINE ── */}
          {(() => {
            const top3 = result.missing_skills.slice(0, 3);
            const boost = Math.min(top3.length * 7, 25);
            const potential = Math.min(result.match_percentage + boost, 98);
            return top3.length > 0 ? (
              <>
                {/* Top 3 Critical Skills */}
                <div style={{
                  padding: '1.1rem 1.25rem', marginBottom: '1rem',
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(245,158,11,0.05))',
                  border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10,
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>
                    🔴 Top 3 Critical Skills Missing — Your Fastest Improvement Path
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {top3.map((s, i) => (
                      <span key={s} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.35rem 0.85rem', borderRadius: 100, fontSize: '0.82rem', fontWeight: 600,
                        background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5',
                      }}>
                        <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>#{i+1}</span> {s}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-3)', lineHeight: 1.5 }}>
                    Focus on <strong style={{ color: '#fca5a5' }}>{top3.slice(0,2).join(' and ')}</strong> to reach <strong style={{ color: 'var(--green)' }}>{potential}%+ match</strong> for this role.
                  </div>
                </div>

                {/* Impact Insight */}
                <div style={{
                  padding: '1rem 1.15rem', marginBottom: '1.25rem',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))',
                  border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10,
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
                    ⚡ Impact Insight
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'var(--text-1)', lineHeight: 1.5 }}>
                    If you learn <strong style={{ color: '#c4b5fd' }}>{top3.slice(0,2).join(', ')}</strong>, your match increases from{' '}
                    <strong style={{ color: 'var(--yellow)', fontFamily: 'Space Grotesk, sans-serif' }}>{result.match_percentage}%</strong>
                    {' '}→{' '}
                    <strong style={{ color: 'var(--green)', fontFamily: 'Space Grotesk, sans-serif' }}>{potential}%</strong>.
                  </div>
                </div>
              </>
            ) : null;
          })()}

          {/* ── Weighted Missing Core Skills Highlight ── */}
          {result.weightedStats?.missingCore?.length > 0 && (
            <div style={{
              padding: '1rem 1.15rem', marginBottom: '1.25rem',
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10,
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
                ⚠ Missing Critical Skills (Weighted 1.0×)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem' }}>
                {result.weightedStats.missingCore.map(s => (
                  <span key={s} style={{ padding: '0.22rem 0.65rem', borderRadius: 100, fontSize: '0.78rem', fontWeight: 700, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5' }}>{s}</span>
                ))}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', lineHeight: 1.4 }}>
                These are core skills for a <strong style={{ color: '#c4b5fd' }}>{result.detectedRole || 'this role'}</strong>. Learning them will have the highest impact on your weighted score.
              </div>
            </div>
          )}

          {/* Skills breakdown */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem', marginBottom: '1.25rem',
          }}>
            {/* Matched */}
            {result.matched_skills.length > 0 && (
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#34d399', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  ✅ Skills You Have <span style={{ fontWeight: 400, color: 'var(--text-dim)' }}>({result.matched_skills.length})</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {result.matched_skills.map(s => <SkillChip key={s} label={s} type="matched" />)}
                </div>
              </div>
            )}

            {/* Missing */}
            {result.missing_skills.length > 0 && (
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f87171', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  ❌ Skills to Acquire <span style={{ fontWeight: 400, color: 'var(--text-dim)' }}>({result.missing_skills.length})</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {result.missing_skills.map(s => <SkillChip key={s} label={s} type="missing" />)}
                </div>
              </div>
            )}
          </div>

          {/* Recommended courses */}
          {result.recommended_courses?.length > 0 && (
            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📚</span> Recommended Courses for This JD
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {result.recommended_courses.map((c, i) => (
                  <a
                    key={i} href={c.url} target="_blank" rel="noreferrer"
                    style={{
                      display: 'block', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-border)',
                      textDecoration: 'none', transition: 'border-color 0.2s ease, transform 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      {c.icon} {c.title}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--primary-light)' }}>{c.platform}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{c.difficulty} · {c.duration}</span>
                      {c.free && <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '100px', background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>FREE</span>}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                      for: <span style={{ color: '#f87171' }}>{c.skill}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Resume improvement suggestions */}
          {result.improvement_suggestions?.skill_specific_tips?.length > 0 && (
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📝</span> Resume Improvement Suggestions
              </div>
              <div>
                {(showAll
                  ? result.improvement_suggestions.skill_specific_tips
                  : result.improvement_suggestions.skill_specific_tips.slice(0, 3)
                ).map((tip, i) => (
                  <div key={i} style={{
                    padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.55rem',
                    background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-border)',
                    display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                  }}>
                    <span style={{
                      padding: '0.15rem 0.5rem', borderRadius: '100px', flexShrink: 0, marginTop: '1px',
                      fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                      background: tip.priority === 'high' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.1)',
                      border: `1px solid ${tip.priority === 'high' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.25)'}`,
                      color: tip.priority === 'high' ? '#f87171' : '#fbbf24',
                    }}>
                      {tip.priority}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-light)', marginBottom: '0.25rem' }}>
                        {tip.skill.charAt(0).toUpperCase() + tip.skill.slice(1)}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-sub)', lineHeight: 1.5 }}>{tip.tip}</div>
                    </div>
                  </div>
                ))}
                {result.improvement_suggestions.skill_specific_tips.length > 3 && (
                  <button className="btn btn-secondary btn-sm" onClick={() => setShowAll(s => !s)} style={{ marginTop: '0.25rem' }}>
                    {showAll ? '▲ Show Less' : `▼ Show ${result.improvement_suggestions.skill_specific_tips.length - 3} More`}
                  </button>
                )}
              </div>
            </div>
          )}
          {/* ── SMART COURSE RECOMMENDATIONS ── */}
          {result.missing_skills?.length > 0 && (
            <div className="glass-card" style={{ padding: '1.25rem', marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.15rem' }}>📚</span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Start Learning — Recommended Courses</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-4)', marginTop: '0.1rem' }}>
                    Top courses to improve your match from <strong style={{ color: 'var(--yellow)' }}>{result.match_percentage}%</strong> toward <strong style={{ color: 'var(--green)' }}>80%+</strong>
                  </div>
                </div>
              </div>
              <CoursesPanel
                missingSkills={result.missing_skills.slice(0, 6)}
                presentSkills={result.matched_skills || []}
                currentMatch={result.match_percentage}
                compact={true}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
