/**
 * InterviewPrep.jsx — v7
 * -----------------------
 * - Groq AI generates role-specific questions (direct client-side call)
 * - Offline fallback to questionBank.js if API fails
 * - Difficulty selector (Easy / Medium / Hard / All)
 * - Score tracker with animated counter
 * - Question counter badge
 * - Reveal answer + explanation animation
 * - Next Question navigation mode
 * - Caches generated questions per role+difficulty
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { generateInterviewQuestions, clearQuestionCache } from '../utils/groqClient';
import { getFallbackQuestions }                             from '../utils/questionBank';
import { API_BASE }                                         from '../utils/config';

const DIFFICULTY_STYLE = {
  Easy:   { bg: 'var(--green-subtle)',  border: 'var(--green-border)',  text: 'var(--green)' },
  Medium: { bg: 'var(--yellow-subtle)', border: 'var(--yellow-border)', text: 'var(--yellow)' },
  Hard:   { bg: 'var(--red-subtle)',    border: 'var(--red-border)',    text: 'var(--red)' },
  All:    { bg: 'rgba(255,255,255,0.05)', border: 'var(--border)',      text: 'var(--text-3)' },
};

const TYPE_STYLE = {
  Technical:  { bg: 'var(--blue-subtle)',   border: 'rgba(59,130,246,0.3)', text: 'var(--blue)'   },
  Behavioral: { bg: 'var(--purple-subtle)', border: 'var(--purple-border)', text: 'var(--purple)' },
};

// ── Single Question Card ─────────────────────────────────────────────────────
function QuestionCard({ q, index, practiceMode, onAnswer, answered }) {
  const [showHint,       setShowHint]       = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (!practiceMode) { setShowHint(false); setSelectedOption(null); }
  }, [practiceMode]);

  const ds  = DIFFICULTY_STYLE[q.difficulty] || DIFFICULTY_STYLE.Easy;
  const ts  = TYPE_STYLE[q.type] || TYPE_STYLE.Technical;
  const isAnswered = selectedOption !== null;

  const handleOption = (i) => {
    if (!practiceMode || isAnswered) return;
    setSelectedOption(i);
    setShowHint(true);
    const isCorrect = q.correct_index === i;
    if (onAnswer) onAnswer(isCorrect);
  };

  return (
    <div style={{
      padding: '1.1rem 1.25rem', marginBottom: '0.75rem',
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 12,
      borderLeft: q.source === 'groq' ? '3px solid var(--primary)' : '3px solid transparent',
      animation: `slideUp ${0.15 + index * 0.05}s ease both`,
      transition: 'box-shadow 0.2s ease',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
    >
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        {/* Number bubble */}
        <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: 'var(--primary-subtle)', border: '1px solid rgba(249,115,22,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
          {index + 1}
        </div>

        <div style={{ flex: 1 }}>
          {/* Badges */}
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ padding: '0.12rem 0.45rem', borderRadius: 100, fontSize: '0.63rem', fontWeight: 600, background: ds.bg, border: `1px solid ${ds.border}`, color: ds.text }}>{q.difficulty}</span>
            <span style={{ padding: '0.12rem 0.45rem', borderRadius: 100, fontSize: '0.63rem', fontWeight: 600, background: ts.bg, border: `1px solid ${ts.border}`, color: ts.text }}>{q.type}</span>
            {q.source === 'groq' && <span style={{ padding: '0.12rem 0.45rem', borderRadius: 100, fontSize: '0.6rem', fontWeight: 700, background: 'var(--primary-subtle)', border: '1px solid rgba(249,115,22,0.3)', color: 'var(--primary)' }}>✨ AI</span>}
          </div>

          {/* Question */}
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
            {q.q}
          </div>

          {/* Options */}
          {q.options?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
              {q.options.map((opt, i) => {
                const isCorrect = q.correct_index === i;
                let bg = 'rgba(255,255,255,0.015)', border = '1px solid var(--border)', iconColor = 'var(--primary)', iconBg = 'var(--primary-subtle)';
                let icon = String.fromCharCode(65 + i);

                if (practiceMode && isAnswered) {
                  if (isCorrect)            { bg = 'var(--green-subtle)'; border = '1px solid var(--green)'; icon = '✓'; iconColor = 'var(--green)'; iconBg = 'rgba(34,197,94,0.2)'; }
                  else if (selectedOption === i) { bg = 'var(--red-subtle)'; border = '1px solid var(--red)'; icon = '✕'; iconColor = 'var(--red)'; iconBg = 'rgba(239,68,68,0.2)'; }
                } else if (!practiceMode && isCorrect) {
                  bg = 'var(--green-subtle)'; border = '1px solid var(--green)'; icon = '✓'; iconColor = 'var(--green)'; iconBg = 'rgba(34,197,94,0.2)';
                }

                return (
                  <div key={i} onClick={() => handleOption(i)} style={{ padding: '0.5rem 0.75rem', background: bg, border, borderRadius: 7, fontSize: '0.8rem', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: practiceMode && !isAnswered ? 'pointer' : 'default', transition: 'all 0.18s ease' }}
                    onMouseEnter={e => { if (practiceMode && !isAnswered) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { if (practiceMode && !isAnswered) e.currentTarget.style.background = bg; }}
                  >
                    <span style={{ fontWeight: 700, color: iconColor, background: iconBg, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.65rem', flexShrink: 0 }}>{icon}</span>
                    <span>{opt}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Hint / Explanation */}
          {practiceMode ? (
            <div>
              <button onClick={() => setShowHint(h => !h)} className="btn btn-ghost btn-sm" style={{ fontSize: '0.7rem', padding: '0.28rem 0.65rem' }}>
                {showHint ? '▲ Hide explanation' : '▼ Reveal answer & explanation'}
              </button>
              {showHint && (
                <div style={{ marginTop: '0.5rem', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.79rem', color: 'var(--text-2)', lineHeight: 1.55, animation: 'slideUp 0.22s ease both' }}>
                  💡 {q.hint}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.79rem', color: 'var(--text-3)', lineHeight: 1.55 }}>
              💡 {q.hint}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ correct, total }) {
  if (total === 0) return null;
  const pct = Math.round((correct / total) * 100);
  const color = pct >= 70 ? 'var(--green)' : pct >= 40 ? 'var(--yellow)' : 'var(--red)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: 100, background: `${color}10`, border: `1px solid ${color}40` }}>
      <span style={{ fontSize: '0.72rem', color: 'var(--text-4)' }}>Score</span>
      <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.9rem', fontWeight: 800, color }}>{correct}/{total}</span>
      <span style={{ fontSize: '0.68rem', color }}>{pct}%</span>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function InterviewPrep({ topJob, extractedSkills = [] }) {
  const [allJobs,       setAllJobs]       = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(topJob?.id || 'default');

  const [baseQuestions, setBaseQuestions] = useState([]);  // from backend
  const [aiQuestions,   setAiQuestions]   = useState([]);  // from Groq
  const [loading,       setLoading]       = useState(false);
  const [aiLoading,     setAiLoading]     = useState(false);
  const [error,         setError]         = useState('');

  const [practiceMode,  setPracticeMode]  = useState(true);
  const [activeType,    setActiveType]    = useState('All');
  const [difficulty,    setDifficulty]    = useState('All');

  // Score tracking
  const [scoreMap, setScoreMap] = useState({});  // questionIndex → true/false

  // Fetch job list
  useEffect(() => {
    fetch(`${API_BASE}/salary-insights`)
      .then(r => r.json())
      .then(d => setAllJobs(d.salary_data || []))
      .catch(() => {});
  }, []);

  const currentJobTitle = allJobs.find(j => j.id === selectedJobId)?.title || topJob?.title || 'Software Engineer';
  const missingSkills   = topJob?.id === selectedJobId ? topJob?.missing_skills || [] : [];

  // Load backend static questions
  useEffect(() => {
    setLoading(true);
    setScoreMap({});
    setAiQuestions([]);
    fetch(`${API_BASE}/interview-prep`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: selectedJobId, job_title: currentJobTitle, extracted_skills: extractedSkills, missing_skills: missingSkills, generate_ai: false }),
    })
      .then(r => r.json())
      .then(d => {
        const backendQs = d.static_questions || [];
        // Merge with local fallback if backend returns few questions
        const localFallback = getFallbackQuestions(currentJobTitle, 'All');
        const combined = backendQs.length >= 8 ? backendQs : [...backendQs, ...localFallback].slice(0, 20);
        setBaseQuestions(combined);
        setLoading(false);
      })
      .catch(() => {
        // Full fallback to local bank
        setBaseQuestions(getFallbackQuestions(currentJobTitle, 'All'));
        setLoading(false);
      });
  }, [selectedJobId, currentJobTitle]);

  // Generate AI questions via Groq (client-side direct call)
  const generateAI = useCallback(async (forceRefresh = false) => {
    setAiLoading(true);
    setError('');
    if (forceRefresh) clearQuestionCache(currentJobTitle, difficulty === 'All' ? 'Medium' : difficulty);
    try {
      const qs = await generateInterviewQuestions(currentJobTitle, difficulty === 'All' ? 'Medium' : difficulty);
      setAiQuestions(qs);
    } catch (err) {
      // Fallback to local bank filtered by difficulty
      const fallback = getFallbackQuestions(currentJobTitle, difficulty === 'All' ? 'Medium' : difficulty).slice(0, 5);
      setAiQuestions(fallback);
      setError(`Groq API unavailable — showing offline questions for ${currentJobTitle}.`);
    } finally {
      setAiLoading(false);
    }
  }, [currentJobTitle, difficulty]);

  // Combine + filter questions
  const allQ = useMemo(() => {
    const combined = [...aiQuestions, ...baseQuestions];
    return combined.filter(q => {
      const typeMatch = activeType === 'All' || q.type === activeType;
      const diffMatch = difficulty === 'All' || q.difficulty === difficulty;
      return typeMatch && diffMatch;
    });
  }, [aiQuestions, baseQuestions, activeType, difficulty]);

  const counts = useMemo(() => ({
    All:        allQ.length,
    Technical:  allQ.filter(q => q.type === 'Technical').length,
    Behavioral: allQ.filter(q => q.type === 'Behavioral').length,
  }), [allQ]);

  const correct = Object.values(scoreMap).filter(Boolean).length;
  const answered = Object.keys(scoreMap).length;

  const handleAnswer = useCallback((index, isCorrect) => {
    setScoreMap(prev => ({ ...prev, [index]: isCorrect }));
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'grid', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Header */}
      <div className="page-header">
        <h2 className="page-title">Interview Prep</h2>
        <p className="page-subtitle">
          Role-specific MCQ practice for <strong style={{ color: 'var(--primary)' }}>{currentJobTitle}</strong>
          {topJob?.company_name && selectedJobId === topJob?.id && <> at <strong style={{ color: 'var(--text-1)' }}>{topJob.company_name}</strong></>}
        </p>
      </div>

      {/* Role Selector */}
      {allJobs.length > 0 && (
        <div style={{ minWidth: 0, width: '100%', overflowX: 'hidden' }}>
          <div style={{ display: 'flex', gap: '0.55rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1rem', scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {allJobs.map(job => (
              <button key={job.id} className={`btn btn-sm ${selectedJobId === job.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flexShrink: 0, padding: '0.35rem 0.85rem' }}
                onClick={() => { if (selectedJobId !== job.id) { setSelectedJobId(job.id); setAiQuestions([]); setScoreMap({}); } }}>
                {job.icon} {job.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', flexWrap: 'wrap', padding: '0.85rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }}>
        {/* Type filter */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {Object.entries(counts).map(([type, count]) => (
            <button key={type} className={`btn btn-sm ${activeType === type ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveType(type)}>
              {type} {count > 0 && <span style={{ marginLeft: '0.15rem', opacity: 0.75 }}>({count})</span>}
            </button>
          ))}
        </div>

        {/* Difficulty selector */}
        <div style={{ display: 'flex', gap: '0.25rem', marginLeft: '0.25rem' }}>
          {['All', 'Easy', 'Medium', 'Hard'].map(d => (
            <button key={d} onClick={() => setDifficulty(d)}
              style={{ padding: '0.22rem 0.6rem', borderRadius: 100, cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600, transition: 'all 0.15s ease',
                background: difficulty === d ? (DIFFICULTY_STYLE[d]?.bg || 'var(--primary)') : 'rgba(255,255,255,0.04)',
                color: difficulty === d ? (DIFFICULTY_STYLE[d]?.text || 'var(--primary)') : 'var(--text-4)',
                border: difficulty === d ? `1px solid ${DIFFICULTY_STYLE[d]?.border || 'var(--primary)'}` : '1px solid transparent',
              }}>{d}</button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Score tracker */}
          <ScoreRing correct={correct} total={answered} />

          {/* Question counter */}
          {allQ.length > 0 && (
            <span style={{ fontSize: '0.68rem', color: 'var(--text-4)', padding: '0.3rem 0.65rem', borderRadius: 100, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
              {allQ.length} questions
            </span>
          )}

          {/* Practice mode */}
          <button className={`btn btn-sm ${practiceMode ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setPracticeMode(m => !m); setScoreMap({}); }}>
            {practiceMode ? '👁 Practice ON' : '🎯 Practice'}
          </button>

          {/* Groq AI generate */}
          <button className="btn btn-primary btn-sm" onClick={() => generateAI(aiQuestions.length > 0)} disabled={aiLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {aiLoading ? (
              <><div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', animation: 'spin 0.7s linear infinite' }} /> Generating…</>
            ) : (
              <>🧠 {aiQuestions.length > 0 ? 'Regenerate AI' : 'Generate AI Questions'}</>
            )}
          </button>
        </div>
      </div>

      {/* Status messages */}
      {aiQuestions.length > 0 && (
        <div style={{ padding: '0.5rem 1rem', marginBottom: '0.75rem', background: 'var(--primary-subtle)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>
          ✨ {aiQuestions.length} AI-generated questions for <strong>{currentJobTitle}</strong> — difficulty: <strong>{difficulty === 'All' ? 'Medium' : difficulty}</strong>
        </div>
      )}
      {error && <div className="alert alert-danger" style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>⚠️ {error}</div>}
      {practiceMode && (
        <div className="alert alert-info" style={{ marginBottom: '1rem', fontSize: '0.78rem' }}>
          ◑ Practice Mode: click an option to answer, then reveal the explanation. Your score is tracked above.
        </div>
      )}

      {/* Questions */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(249,115,22,0.2)', borderTop: '3px solid var(--primary)', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          Loading {currentJobTitle} questions…
        </div>
      ) : allQ.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-4)' }}>
          No questions match this filter. Try changing difficulty or type.
        </div>
      ) : (
        <div>
          {aiQuestions.filter(q => (activeType === 'All' || q.type === activeType) && (difficulty === 'All' || q.difficulty === difficulty)).length > 0 && (
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ flex: 1, height: 1, background: 'rgba(249,115,22,0.3)' }} />
              ✨ AI Generated — {currentJobTitle}
              <span style={{ flex: 1, height: 1, background: 'rgba(249,115,22,0.3)' }} />
            </div>
          )}
          {allQ.map((q, i) => (
            <QuestionCard key={`${q.source || 'base'}-${i}`} q={q} index={i} practiceMode={practiceMode}
              answered={scoreMap[i] !== undefined}
              onAnswer={(isCorrect) => handleAnswer(i, isCorrect)}
            />
          ))}
        </div>
      )}

      {/* STAR Framework */}
      <div className="glass-card" style={{ padding: '1.1rem', marginTop: '1.5rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.6rem' }}>📌 STAR Framework — For Behavioral Questions</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {[{ letter: 'S', word: 'Situation', desc: 'Set the context' }, { letter: 'T', word: 'Task', desc: 'Your responsibility' }, { letter: 'A', word: 'Action', desc: 'What you did' }, { letter: 'R', word: 'Result', desc: 'Measurable outcome' }].map(s => (
            <div key={s.letter} style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{s.letter}</div>
              <div style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--text-1)', marginTop: '0.2rem' }}>{s.word}</div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-4)', marginTop: '0.1rem' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
