/**
 * CopilotPanel.jsx — v8
 * ----------------------
 * AI Career Copilot — replaces ChatBot.
 *
 * Upgrades over ChatBot:
 * - Context badge: "81% ready for ML Engineer"
 * - Suggested quick-action buttons (trigger navigation)
 * - AI response structured output: message + actions + nextSteps
 * - Intent detection → auto-navigate dashboard
 * - Groq /api/ai-chat backend (unchanged)
 * - Memory: remembers last role + last intent
 * - Typewriter effect preserved
 * - All ChatBot features preserved (clear, export, keyboard)
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useCopilot } from '../context/CopilotContext';
import { generateCareerInsight } from '../utils/insightEngine';
import { API_BASE } from '../utils/config';

// ── Quick-action prompt templates ────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: 'Improve to 90%',       icon: '🚀', msg: 'How do I improve my career readiness to 90%? What are the most impactful skills?' },
  { label: 'Fix My Resume',        icon: '📝', msg: 'What specific improvements should I make to my resume to get more interviews?' },
  { label: 'Get Best Jobs',        icon: '💼', msg: 'Which are my best-fit job matches and what should I do to get hired?' },
  { label: 'Practice Interview',   icon: '🎤', msg: 'Give me the 5 most important interview questions I should prepare for my target role.' },
  { label: 'Build a Study Plan',   icon: '📚', msg: 'Create a 30-day study plan to close my most critical skill gaps.' },
  { label: 'Salary Expectations',  icon: '💰', msg: 'What salary can I expect for my target role based on my current skill level?' },
];

// Safe bold text renderer — no dangerouslySetInnerHTML
function SafeBold({ text }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\*\*(.*?)\*\*$/.test(part)
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

// Safe markdown renderer — no dangerouslySetInnerHTML
function RenderMessage({ content }) {
  return (
    <div>
      {content.split('\n').map((line, i) => {
        if (/^[-•*]\s/.test(line)) return (
          <div key={i} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.1rem' }}>
            <span style={{ color: 'var(--primary)', flexShrink: 0 }}>•</span>
            <span><SafeBold text={line.replace(/^[-•*]\s/, '')} /></span>
          </div>
        );
        if (/^\d+\.\s/.test(line)) return (
          <div key={i} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.1rem' }}>
            <span style={{ color: 'var(--primary)', flexShrink: 0, minWidth: 16 }}>{line.match(/^\d+/)[0]}.</span>
            <span><SafeBold text={line.replace(/^\d+\.\s/, '')} /></span>
          </div>
        );
        if (line.trim() === '') return <div key={i} style={{ height: '0.35rem' }} />;
        return <div key={i} style={{ marginBottom: '0.05rem' }}><SafeBold text={line} /></div>;
      })}
    </div>
  );
}

function TypewriterMessage({ content, speed = 10 }) {
  const [displayed, setDisplayed] = useState('');
  const [finished,  setFinished]  = useState(false);
  useEffect(() => {
    setDisplayed(''); setFinished(false); let i = 0;
    const t = setInterval(() => {
      i++; setDisplayed(content.slice(0, i));
      if (i >= content.length) { setFinished(true); clearInterval(t); }
    }, speed);
    return () => clearInterval(t);
  }, [content]);
  return (
    <div>
      <RenderMessage content={displayed} />
      {!finished && <span style={{ display: 'inline-block', width: 2, height: 12, background: 'var(--primary)', marginLeft: 2, animation: 'blink 0.8s step-end infinite', verticalAlign: 'middle' }} />}
    </div>
  );
}

// ── AI response footer — action buttons from structured response ──────────────
function ResponseActions({ actions, nextSteps, onNavigate }) {
  if ((!actions || actions.length === 0) && (!nextSteps || nextSteps.length === 0)) return null;
  return (
    <div style={{ marginTop: '0.6rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
      {nextSteps?.length > 0 && (
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.63rem', color: 'var(--text-4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>🚀 Next Steps</div>
          {nextSteps.map((step, i) => (
            <div key={i} style={{ fontSize: '0.72rem', color: 'var(--text-2)', padding: '0.15rem 0', display: 'flex', gap: '0.4rem' }}>
              <span style={{ color: 'var(--primary)', flexShrink: 0 }}>{i + 1}.</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}
      {actions?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
          {actions.map((action, i) => (
            <button key={i} onClick={() => onNavigate(action.tab)}
              style={{ padding: '0.22rem 0.6rem', borderRadius: 100, border: '1px solid rgba(249,115,22,0.35)', background: 'var(--primary-subtle)', color: 'var(--primary)', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary-subtle)'; e.currentTarget.style.color = 'var(--primary)'; }}
            >
              {action.icon} {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg, isLatestAI, isFirst, onNavigate }) {
  const isUser = msg.role === 'user';
  const time = msg.time ? new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  return (
    <div style={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', gap: '0.45rem', alignItems: 'flex-end', marginBottom: '0.8rem' }}>
      {!isUser && (
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0 }}>🤖</div>
      )}
      <div style={{ maxWidth: '84%' }}>
        <div style={{ padding: '0.6rem 0.85rem', borderRadius: isUser ? '14px 14px 3px 14px' : '14px 14px 14px 3px', background: isUser ? 'var(--primary)' : 'var(--bg-card)', border: isUser ? 'none' : '1px solid var(--border)', color: isUser ? 'white' : 'var(--text-2)', fontSize: '0.81rem', lineHeight: 1.5, wordBreak: 'break-word', boxShadow: isUser ? '0 2px 10px rgba(249,115,22,0.25)' : 'none' }}>
          {msg.role === 'assistant' && isLatestAI && !isFirst
            ? <TypewriterMessage content={msg.content} />
            : <RenderMessage content={msg.content} />
          }
          {/* Structured response footer */}
          {!isUser && (msg.actions || msg.nextSteps) && (
            <ResponseActions actions={msg.actions} nextSteps={msg.nextSteps} onNavigate={onNavigate} />
          )}
        </div>
        {time && <div style={{ fontSize: '0.58rem', color: 'var(--text-4)', marginTop: '0.18rem', textAlign: isUser ? 'right' : 'left', paddingLeft: isUser ? 0 : '0.2rem' }}>{time}</div>}
      </div>
    </div>
  );
}

// ── Main CopilotPanel ─────────────────────────────────────────────────────────
export default function CopilotPanel({ resumeContext }) {
  const { userProfile, detectIntent, triggerAction, generateInsight, copilotOpen, setCopilotOpen, pendingMessage, setPendingMessage } = useCopilot();

  const insight = userProfile ? generateCareerInsight({
    readiness:     userProfile.readiness,
    topRole:       userProfile.topRole,
    missingSkills: userProfile.missingSkills,
    atsScore:      userProfile.atsScore,
    matchScore:    userProfile.topRoleScore,
    skills:        userProfile.skills,
  }) : null;

  const makeGreeting = () => resumeContext
    ? `🚀 **AI Career Copilot** ready!\n\n${insight?.headline || `You're ${resumeContext.career_readiness_score || 0}% career-ready.`}\n\n${insight?.subline || ''}\n\nAsk me anything or use the quick actions below!`
    : "👋 Welcome to your **AI Career Copilot**!\n\nUpload your resume to unlock personalized guidance — I'll help you:\n• Close skill gaps fast\n• Match to the right jobs\n• Ace interviews\n• Optimize your profile\n\nOr ask me any career question!";

  const [open,             setOpen]           = useState(false);
  const [messages,         setMessages]        = useState([{ role: 'assistant', content: makeGreeting(), time: Date.now() }]);
  const [input,            setInput]           = useState('');
  const [loading,          setLoading]         = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [pulse,            setPulse]           = useState(true);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Sync open state with context
  useEffect(() => { if (copilotOpen !== open) setOpen(copilotOpen); }, [copilotOpen]);
  useEffect(() => { setCopilotOpen(open); }, [open]);

  // Inject pending message from external "Ask Copilot" buttons
  useEffect(() => {
    if (pendingMessage && open) {
      sendMessage(pendingMessage);
      setPendingMessage(null);
    }
  }, [pendingMessage, open]);

  // Refresh greeting when resume loads
  useEffect(() => {
    if (resumeContext && messages.length === 1) {
      setMessages([{ role: 'assistant', content: makeGreeting(), time: Date.now() }]);
    }
  }, [resumeContext, userProfile]);

  useEffect(() => { const t = setTimeout(() => setPulse(false), 10000); return () => clearTimeout(t); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape' && open) setOpen(false); };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [open]);

  const handleNavigate = useCallback((tab) => {
    triggerAction(tab);
    setOpen(false);
  }, [triggerAction]);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setShowQuickActions(false);
    setLoading(true);

    const userMsg = { role: 'user', content: msg, time: Date.now() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);

    // Intent detection → auto-navigate
    const detected = detectIntent(msg);
    if (detected?.tab) {
      triggerAction(detected.tab, detected.intent);
    }

    try {
      const historyForAPI = newHistory.slice(1).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch(`${API_BASE}/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          conversation_history: historyForAPI.slice(0, -1),
          context: resumeContext ? {
            extracted_skills:      resumeContext.extracted_skills,
            career_readiness_score:resumeContext.career_readiness_score,
            best_fit_job:          resumeContext.best_fit_job,
            best_fit_job_score:    resumeContext.best_fit_job_score,
            top_3_matches:         resumeContext.top_3_matches?.slice(0, 3).map(j => ({
              title: j.title, match_percentage: j.match_percentage, missing_critical: j.missing_critical,
            })),
          } : null,
        }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      // Build structured response
      const aiMsg = {
        role: 'assistant',
        content: data.response,
        time: Date.now(),
        // Attach navigation actions if intent detected
        actions:   detected ? insight?.actions?.slice(0, 3) : null,
        nextSteps: insight?.nextSteps?.map(s => s.label)?.slice(0, 3) || null,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "⚠️ I'm having trouble connecting to the backend. Make sure it's running on port 8000!\n\nMeanwhile, use the quick actions below to explore your career insights.",
        time: Date.now(),
        actions: insight?.actions?.slice(0, 3) || null,
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, resumeContext, detectIntent, triggerAction, insight]);

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: makeGreeting(), time: Date.now() }]);
    setShowQuickActions(true);
  };

  const exportChat = () => {
    const text = messages.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'career-copilot-chat.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const latestAIIndex = messages.map(m => m.role).lastIndexOf('assistant');
  const readinessColor = !userProfile ? 'var(--text-4)' :
    userProfile.readiness >= 70 ? 'var(--green)' :
    userProfile.readiness >= 45 ? 'var(--primary)' : 'var(--yellow)';

  return (
    <>
      {/* ── FLOATING BUTTON ── */}
      <button onClick={() => { setOpen(o => !o); setPulse(false); }} title="AI Career Copilot"
        style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', width: 54, height: 54, borderRadius: '50%', background: open ? 'var(--bg-card)' : 'linear-gradient(135deg,var(--primary),#7c3aed)', border: open ? '1px solid var(--border)' : 'none', cursor: 'pointer', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: 'white', boxShadow: '0 4px 24px rgba(249,115,22,0.45)', transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? '✕' : '🤖'}
        {pulse && !open && <span style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid rgba(249,115,22,0.5)', animation: 'pulse-ring 1.5s ease-out infinite' }} />}
        {!open && <span style={{ position: 'absolute', top: 4, right: 4, width: 9, height: 9, borderRadius: '50%', background: 'var(--green)', border: '2px solid var(--bg-base)' }} />}
      </button>

      {/* ── COPILOT PANEL ── */}
      <div style={{ position: 'fixed', bottom: '5rem', right: '1.5rem', width: 390, height: 580, background: 'var(--bg-panel)', border: '1px solid var(--border-md)', borderRadius: 20, boxShadow: '0 24px 64px rgba(0,0,0,0.55)', zIndex: 999, display: 'flex', flexDirection: 'column', overflow: 'hidden', transform: open ? 'scale(1) translateY(0)' : 'scale(0.93) translateY(16px)', opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none', transition: 'all 0.28s cubic-bezier(0.16,1,0.3,1)', transformOrigin: 'bottom right' }}>

        {/* ── Header ── */}
        <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(124,58,237,0.06))', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-1)', letterSpacing: '-0.01em' }}>🚀 AI Career Copilot</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.63rem', color: 'var(--text-4)' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                Groq · llama3 · Online
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button onClick={exportChat} title="Export" className="btn btn-ghost btn-sm" style={{ padding: '0.22rem 0.5rem', fontSize: '0.72rem' }}>↓</button>
              <button onClick={clearChat}  title="Clear"  className="btn btn-ghost btn-sm" style={{ padding: '0.22rem 0.5rem', fontSize: '0.72rem' }}>🗑</button>
              <button onClick={() => setOpen(false)} className="btn btn-ghost btn-sm" style={{ padding: '0.22rem 0.5rem', fontSize: '0.72rem' }}>✕</button>
            </div>
          </div>

          {/* Context badge */}
          {userProfile && (
            <div style={{ marginTop: '0.5rem', padding: '0.35rem 0.7rem', background: `${readinessColor}12`, border: `1px solid ${readinessColor}30`, borderRadius: 8, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <span style={{ color: readinessColor, fontWeight: 700 }}>
                {userProfile.readiness}% ready for {userProfile.topRole}
              </span>
              {insight?.potential > userProfile.readiness && (
                <span style={{ color: 'var(--text-4)', fontSize: '0.63rem' }}>
                  → {insight.potential}% potential
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Messages ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', scrollbarWidth: 'thin' }}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} isLatestAI={msg.role === 'assistant' && i === latestAIIndex && i > 0} isFirst={i === 0} onNavigate={handleNavigate} />
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>🤖</div>
              <div style={{ padding: '0.55rem 0.85rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px 12px 12px 3px', display: 'flex', gap: 4 }}>
                {[0,1,2].map(j => <span key={j} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--primary)', animation: `bounce 1.2s ease ${j*0.2}s infinite` }} />)}
              </div>
            </div>
          )}

          {/* Quick actions */}
          {showQuickActions && messages.length <= 2 && !loading && (
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-4)', marginBottom: '0.45rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Actions</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {QUICK_ACTIONS.map(qa => (
                  <button key={qa.label} onClick={() => sendMessage(qa.msg)}
                    style={{ padding: '0.25rem 0.6rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text-3)', fontSize: '0.68rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'; e.currentTarget.style.color = 'var(--primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-3)'; }}
                  >{qa.icon} {qa.label}</button>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── Input ── */}
        <div style={{ padding: '0.65rem', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-end', background: 'var(--bg-input)', border: '1px solid var(--border-md)', borderRadius: 10, padding: '0.45rem 0.65rem' }}>
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask your Career Copilot…" rows={1}
              style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-1)', fontSize: '0.81rem', fontFamily: 'Inter, sans-serif', resize: 'none', outline: 'none', lineHeight: 1.5, maxHeight: 80, overflowY: 'auto' }}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
              style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: input.trim() && !loading ? 'var(--primary)' : 'rgba(255,255,255,0.06)', border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem', color: 'white', transition: 'var(--transition)' }}
            >↑</button>
          </div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-4)', marginTop: '0.25rem', textAlign: 'center' }}>Enter to send · Esc to close · Copilot navigates for you</div>
        </div>
      </div>

      <style>{`
        @keyframes blink       { 50% { opacity: 0; } }
        @keyframes bounce      { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-5px); } }
        @keyframes pulse-ring  { 0% { transform:scale(1); opacity:1; } 100% { transform:scale(1.6); opacity:0; } }
      `}</style>
    </>
  );
}
