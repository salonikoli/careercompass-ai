/**
 * App.jsx — v11
 * - No login / auth required — fully public
 * - Landing page → Upload resume → Loading → Dashboard
 * - Demo mode available from Hero CTA
 */
import React, { useState, useEffect, Component } from 'react';
import LandingPage  from './components/LandingPage';
import Dashboard    from './components/Dashboard';
import { ThemeProvider }              from './context/ThemeContext';
import { CopilotProvider, useCopilot } from './context/CopilotContext';

import CopilotPanel from './components/CopilotPanel';

/* ── Global error boundary ─────────────────────────────────── */
class RootErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '16px',
        background: '#0b0f1a', padding: '32px',
      }}>
        <div style={{ fontSize: '40px' }}>🛠</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9' }}>Something went wrong</div>
        <div style={{
          fontSize: '12px', color: '#64748b', fontFamily: 'monospace',
          background: '#182030', padding: '12px 16px', borderRadius: 8,
          maxWidth: 500, wordBreak: 'break-word',
        }}>
          {this.state.error?.message || 'Unknown error'}
        </div>
        <button
          onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
          style={{
            padding: '10px 24px', background: '#6366f1', border: 'none',
            borderRadius: 8, color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '14px',
          }}
        >
          Reload App
        </button>
      </div>
    );
    return this.props.children;
  }
}

/* ── AI Analysis Loading Screen ────────────────────────────── */
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '24px',
      background: '#020c16',
    }}>
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid rgba(20,184,166,0.15)', borderTop: '3px solid #14b8a6', animation: 'spin 0.85s linear infinite', position: 'absolute' }} />
        <div style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid rgba(6,182,212,0.1)', borderBottom: '3px solid #06b6d4', animation: 'spin 1.2s linear infinite reverse', position: 'absolute' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>🧭</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#f0fdfa', marginBottom: '6px' }}>
          Analyzing your resume…
        </div>
        <div style={{ fontSize: '13px', color: '#475569' }}>
          Extracting skills · Matching roles · Generating insights
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['Parsing PDF', 'Finding Skills', 'Matching Jobs', 'AI Insights'].map((s, i) => (
          <div key={s} style={{
            padding: '4px 14px',
            background: 'rgba(20,184,166,0.1)',
            border: '1px solid rgba(20,184,166,0.2)',
            borderRadius: '100px', fontSize: '11px', color: '#5eead4',
            opacity: 0, animation: `fadeIn 0.4s ease ${i * 0.6}s forwards`,
          }}>{s}</div>
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeIn { to { opacity: 1; } }`}</style>
    </div>
  );
}

/* ── Inner App ─────────────────────────────────────────────── */
function AppInner() {
  const { setProfile } = useCopilot();

  const [appState,     setAppState]     = useState('landing');
  const [analysisData, setAnalysisData] = useState(null);
  const [error,        setError]        = useState('');

  useEffect(() => {
    try { if (analysisData) setProfile(analysisData); } catch (e) { console.warn('setProfile:', e); }
  }, [analysisData]);

  /* ── Demo mode ── */
  const handleDemo = async () => {
    setError('');
    setAppState('loading');
    setTimeout(async () => {
      try {
        const { DEMO_DATA } = await import('./utils/demoData');
        setAnalysisData(DEMO_DATA);
        setAppState('dashboard');
      } catch (err) {
        setError('Failed to load demo data.');
        setAppState('landing');
      }
    }, 1500);
  };

  /* ── Upload resume — 3-tier: client AI → Python backend → demo ── */
  const handleUpload = async (file) => {
    setError('');
    setAppState('loading');

    // ── Tier 1: Client-side Groq analysis (works everywhere, no backend needed) ──
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    if (groqKey && groqKey !== 'your_groq_api_key_here') {
      try {
        const { analyzeResumeClientSide } = await import('./utils/clientAnalysis');
        const data = await analyzeResumeClientSide(file);
        setAnalysisData(data);
        setAppState('dashboard');
        return;
      } catch (clientErr) {
        console.warn('Client-side analysis failed, trying backend:', clientErr.message);
      }
    }

    // ── Tier 2: Try Python backend (localhost dev server) ──
    try {
      const { uploadResume } = await import('./utils/api');
      const data = await uploadResume(file);
      setAnalysisData(data);
      setAppState('dashboard');
      return;
    } catch (backendErr) {
      console.warn('Backend unavailable:', backendErr.message);
    }

    // ── Tier 3: Fallback to demo data ──
    setError('Using demo data — add VITE_GROQ_API_KEY to .env for real analysis.');
    setTimeout(async () => {
      try {
        const { DEMO_DATA } = await import('./utils/demoData');
        setAnalysisData(DEMO_DATA);
        setAppState('dashboard');
      } catch {
        setError('Analysis failed. Please check your setup.');
        setAppState('landing');
      }
    }, 1500);
  };

  /* ── Reset to landing ── */
  const handleReset = () => {
    setAppState('landing');
    setAnalysisData(null);
    setError('');
  };

  return (
    <>
      {appState === 'landing' && (
        <LandingPage
          onUpload={handleUpload}
          onDemo={handleDemo}
          error={error}
        />
      )}

      {appState === 'loading' && <LoadingScreen />}

      {appState === 'dashboard' && analysisData && (
        <RootErrorBoundary>
          <Dashboard data={analysisData} onReset={handleReset} onLogout={handleReset} />
        </RootErrorBoundary>
      )}

      <RootErrorBoundary>
        <CopilotPanel resumeContext={analysisData} />
      </RootErrorBoundary>
    </>
  );
}

/* ── Root ─────────────────────────────────────────────────── */
export default function App() {
  return (
    <ThemeProvider>
      <CopilotProvider>
        <AppInner />
      </CopilotProvider>
    </ThemeProvider>
  );
}
