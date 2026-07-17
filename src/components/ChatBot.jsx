/**
 * ChatBot.jsx — v6
 * Enhanced AI Career Mentor with:
 * - Groq llama3-8b via /api/ai-chat (proxy, not direct URL)
 * - Markdown-ish response rendering (bold, lists)
 * - Clear chat history button
 * - Export chat as text
 * - Keyboard shortcuts (Escape to close)
 * - Message timestamps
 * - Improved visual design matching v6 theme
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { API_BASE } from '../utils/config';

const SUGGESTIONS = [
  'What skills should I learn next?',
  'How do I improve my resume?',
  'Which companies should I target?',
  'What salary can I expect?',
  'How long to be job-ready?',
  'Give me a study plan for this week',
  'What interview questions should I prep for?',
  'Compare my top 3 job matches',
];

// Safe bold text renderer — splits on **text** and renders <strong> without dangerouslySetInnerHTML
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

// Safe markdown renderer (bold + bullet lists) — no dangerouslySetInnerHTML
function RenderMessage({ content }) {
  const parts = content.split('\n').map((line, i) => {
    // Bullet •/-/*
    if (/^[-•*]\s/.test(line)) {
      return <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.1rem' }}>
        <span style={{ color: 'var(--primary)', flexShrink: 0 }}>•</span>
        <span><SafeBold text={line.replace(/^[-•*]\s/, '')} /></span>
      </div>;
    }
    if (line.trim() === '') return <div key={i} style={{ height: '0.4rem' }} />;
    return <div key={i} style={{ marginBottom: '0.05rem' }}><SafeBold text={line} /></div>;
  });
  return <div>{parts}</div>;
}

// Typewriter effect for AI responses
function TypewriterMessage({ content, done, speed = 12 }) {
  const [displayed, setDisplayed] = useState('');
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setFinished(false);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDisplayed(content.slice(0, i));
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

function MessageBubble({ msg, isLatestAI, isFirst }) {
  const isUser = msg.role === 'user';
  const time = msg.time ? new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      gap: '0.5rem', alignItems: 'flex-end',
      marginBottom: '0.85rem',
    }}>
      {!isUser && (
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', flexShrink: 0, color: 'white',
        }}>🧠</div>
      )}
      <div style={{ maxWidth: '82%' }}>
        <div style={{
          padding: '0.6rem 0.85rem',
          borderRadius: isUser ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
          background: isUser ? 'var(--primary)' : 'var(--bg-card)',
          border: isUser ? 'none' : '1px solid var(--border)',
          color: isUser ? 'white' : 'var(--text-2)',
          fontSize: '0.82rem', lineHeight: 1.5,
          boxShadow: isUser ? '0 2px 10px rgba(249,115,22,0.25)' : 'none',
          wordBreak: 'break-word',
        }}>
          {msg.role === 'assistant' && isLatestAI && !isFirst
            ? <TypewriterMessage content={msg.content} />
            : <RenderMessage content={msg.content} />
          }
        </div>
        {time && (
          <div style={{ fontSize: '0.6rem', color: 'var(--text-4)', marginTop: '0.2rem', textAlign: isUser ? 'right' : 'left', paddingLeft: isUser ? 0 : '0.25rem' }}>
            {time}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatBot({ resumeContext }) {
  const makeGreeting = () => resumeContext
    ? `Hi! I've loaded your resume — **${resumeContext.extracted_skills?.length || 0} skills** found, you're **${resumeContext.career_readiness_score || 0}% career-ready** for ${resumeContext.best_fit_job || 'your best fit'}.\n\nAsk me anything about your career! 🚀`
    : "Hi! I'm your **CareerCompass AI** assistant powered by **Groq**.\n\nUpload your resume for personalized advice, or ask me anything about tech careers! 🧭";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: makeGreeting(), time: Date.now() }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (resumeContext && messages.length === 1) {
      setMessages([{ role: 'assistant', content: makeGreeting(), time: Date.now() }]);
    }
  }, [resumeContext]);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 8000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Keyboard: Escape to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && open) setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setShowSuggestions(false);
    setLoading(true);
    const userMsg = { role: 'user', content: msg, time: Date.now() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);

    try {
      const historyForAPI = newHistory.slice(1).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch(`${API_BASE}/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          conversation_history: historyForAPI.slice(0, -1),
          context: resumeContext ? {
            extracted_skills: resumeContext.extracted_skills,
            career_readiness_score: resumeContext.career_readiness_score,
            best_fit_job: resumeContext.best_fit_job,
            best_fit_job_score: resumeContext.best_fit_job_score,
            top_3_matches: resumeContext.top_3_matches?.slice(0, 3).map(j => ({
              title: j.title, match_percentage: j.match_percentage, missing_critical: j.missing_critical,
            })),
          } : null,
        }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response, time: Date.now() }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting. Make sure the backend is running on port 8000, then try again! 🔌",
        time: Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, resumeContext]);

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: makeGreeting(), time: Date.now() }]);
    setShowSuggestions(true);
  };

  const exportChat = () => {
    const text = messages.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ai-career-chat.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const latestAIIndex = messages.map(m => m.role).lastIndexOf('assistant');

  return (
    <>
      {/* ── FLOATING BUTTON ── */}
      <button
        onClick={() => { setOpen(o => !o); setPulse(false); }}
        title="CareerCompass AI (Groq)"
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem',
          width: 52, height: 52, borderRadius: '50%',
          background: open ? 'var(--bg-card)' : 'var(--primary)',
          border: open ? '1px solid var(--border)' : 'none',
          cursor: 'pointer', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.25rem', color: 'white',
          boxShadow: '0 4px 20px rgba(249,115,22,0.4)',
          transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? '✕' : '🧭'}
        {pulse && !open && (
          <span style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid rgba(249,115,22,0.5)', animation: 'pulse-ring 1.5s ease-out infinite' }} />
        )}
        {!open && (
          <span style={{ position: 'absolute', top: 4, right: 4, width: 9, height: 9, borderRadius: '50%', background: 'var(--green)', border: '2px solid var(--bg-base)' }} />
        )}
      </button>

      {/* ── CHAT PANEL ── */}
      <div style={{
        position: 'fixed', bottom: '4.75rem', right: '1.5rem',
        width: 370, height: 540,
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-md)',
        borderRadius: 18,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        zIndex: 999,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        transform: open ? 'scale(1) translateY(0)' : 'scale(0.93) translateY(14px)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: 'all 0.28s cubic-bezier(0.16,1,0.3,1)',
        transformOrigin: 'bottom right',
      }}>
        {/* Header */}
        <div style={{
          padding: '0.85rem 1rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-card)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>🧭</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-1)' }}>CareerCompass AI</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', color: 'var(--text-4)' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                Groq · llama3-8b · Online
              </div>
            </div>
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button onClick={exportChat} title="Export chat" className="btn btn-ghost btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>↓</button>
              <button onClick={clearChat}  title="Clear chat"  className="btn btn-ghost btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>🗑</button>
              <button onClick={() => setOpen(false)} className="btn btn-ghost btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>✕</button>
            </div>
          </div>

          {resumeContext && (
            <div style={{
              marginTop: '0.55rem', padding: '0.3rem 0.65rem',
              background: 'var(--green-subtle)',
              border: '1px solid var(--green-border)',
              borderRadius: 6, fontSize: '0.68rem', color: 'var(--green)',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>
              <span>📄</span>
              Resume loaded · {resumeContext.extracted_skills?.length} skills · {resumeContext.career_readiness_score}% ready
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem', display: 'flex', flexDirection: 'column' }}>
          {messages.map((msg, i) => (
            <MessageBubble
              key={i} msg={msg}
              isLatestAI={msg.role === 'assistant' && i === latestAIIndex && i > 0}
              isFirst={i === 0}
            />
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0, color: 'white' }}>🧠</div>
              <div style={{ padding: '0.55rem 0.85rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px 12px 12px 3px', display: 'flex', gap: 4 }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--primary)', animation: `bounce 1.2s ease ${i*0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && messages.length <= 2 && !loading && (
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-4)', marginBottom: '0.5rem' }}>Try asking:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {SUGGESTIONS.slice(0, 5).map(s => (
                  <button key={s} onClick={() => sendMessage(s)} style={{
                    padding: '0.28rem 0.65rem',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 100, color: 'var(--text-3)', fontSize: '0.7rem',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'var(--transition)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-3)'; }}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '0.65rem', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{
            display: 'flex', gap: '0.4rem', alignItems: 'flex-end',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-md)',
            borderRadius: 10, padding: '0.45rem 0.65rem',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask about your career…"
              rows={1}
              style={{
                flex: 1, background: 'none', border: 'none',
                color: 'var(--text-1)', fontSize: '0.82rem',
                fontFamily: 'Inter, sans-serif', resize: 'none',
                outline: 'none', lineHeight: 1.5, maxHeight: 80, overflowY: 'auto',
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                background: input.trim() && !loading ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', color: 'white', transition: 'var(--transition)',
              }}
            >↑</button>
          </div>
          <div style={{ fontSize: '0.63rem', color: 'var(--text-4)', marginTop: '0.3rem', textAlign: 'center' }}>
            Enter to send · Esc to close · Groq llama3-8b
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink  { 50% { opacity: 0; } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-5px); } }
      `}</style>
    </>
  );
}
