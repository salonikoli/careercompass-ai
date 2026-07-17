/**
 * Dashboard.jsx — v7
 * Hero banner + Impact Insight Engine + human language throughout.
 * Primary journey: Dashboard → Job Mapping → Roadmap
 */

import React, { useState, useEffect, Component } from 'react';
import Sidebar          from './Sidebar';
import JobMatchCard     from './JobMatchCard';
import MissingSkills    from './MissingSkills';
import CoursesPanel     from './CoursesPanel';
import CareerRoadmap    from './CareerRoadmap';
import ResumeSuggestions from './ResumeSuggestions';
import JDMatcher        from './JDMatcher';
import ResumeAudit      from './ResumeAudit';
import SkillBenchmark   from './SkillBenchmark';
import ATSAnalyzer      from './ATSAnalyzer';
import InterviewPrep    from './InterviewPrep';
import SalaryInsights   from './SalaryInsights';
import LinkedInOptimizer from './LinkedInOptimizer';
import CopilotTrigger   from './CopilotTrigger';
import { useCopilot }   from '../context/CopilotContext';
import { useTheme }     from '../context/ThemeContext';
import SmartNudges        from './SmartNudges';
import ConfidenceIndicator from './ConfidenceIndicator';
import CompanyMatchPanel  from './CompanyMatchPanel';
import WhatIfAnalysis     from './WhatIfAnalysis';
import CareerSimulation   from './CareerSimulation';


function CountUp({ value, suffix = '' }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let start = 0; const step = value / 40;
    const t = setInterval(() => { start += step; if (start >= value) { setN(value); clearInterval(t); } else setN(Math.floor(start)); }, 20);
    return () => clearInterval(t);
  }, [value]);
  return <>{n}{suffix}</>;
}

/* Simple error boundary to prevent blank screens */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (
      <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--text-3)' }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-2)', marginBottom: '4px' }}>Section failed to load</div>
        <div style={{ fontSize: '12px', color: 'var(--text-4)' }}>{this.state.error?.message}</div>
        <button className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }} onClick={() => this.setState({ hasError: false, error: null })}>Retry</button>
      </div>
    );
    return this.props.children;
  }
}

function ThemeToggleTopBar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      style={{
        width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border-md)',
        background: 'var(--bg-card)', cursor: 'pointer', fontSize: '0.85rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'var(--transition)'
      }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

export default function Dashboard({ data, onReset, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Register navigation bridge with CopilotContext
  const { registerNavigate } = useCopilot();
  useEffect(() => { registerNavigate(setActiveTab); }, [registerNavigate]);

  const {
    filename                   = '',
    extracted_skills           = [],
    job_matches                = [],
    top_3_matches              = [],
    career_readiness_score     = 0,
    best_fit_job               = '',
    best_fit_job_score         = 0,
    global_recommended_courses = [],
    insights                   = [],
    roadmap                    = [],
    roadmap_job                = '',
    resume_suggestions         = {},
    resume_audit               = null,
  } = data;

  const topJob = top_3_matches[0] || null;

  const allCourses = (() => {
    const seen = new Set(); const result = [];
    const add = (cs) => cs.forEach(c => { if (!seen.has(c.url)) { seen.add(c.url); result.push(c); } });
    add(global_recommended_courses);
    top_3_matches.forEach(j => add(j.recommended_courses || []));
    return result.slice(0, 12);
  })();

  const readinessColor =
    career_readiness_score >= 70 ? 'var(--green)' :
    career_readiness_score >= 45 ? 'var(--primary)' : 'var(--yellow)';

  const handleViewRoadmap = () => setActiveTab('roadmap');

  const renderContent = () => {
    // LAZY rendering: only render active tab to avoid pre-evaluated crashes
    switch (activeTab) {
      case 'jobs':      return <JobsTab jobMatches={job_matches} onViewRoadmap={handleViewRoadmap} />;
      case 'jd':        return <div className="animate-fade-in" style={{ padding: '2rem' }}><JDMatcher resumeSkills={extracted_skills} topJob={topJob} /></div>;
      case 'roadmap':   return <RoadmapTab roadmap={roadmap} roadmapJob={roadmap_job} jobMatches={job_matches} />;
      case 'audit':     return <div className="animate-fade-in" style={{ padding: '2rem' }}><ResumeAudit audit={resume_audit} /><div style={{marginTop:'1.5rem'}}><ResumeSuggestions suggestions={resume_suggestions} /></div></div>;
      case 'ats':       return <div className="animate-fade-in" style={{ padding: '2rem' }}><ATSAnalyzer audit={resume_audit} extractedSkills={extracted_skills} topJob={topJob} /></div>;
      case 'benchmark': return <div className="animate-fade-in" style={{ padding: '2rem' }}><SkillBenchmark extractedSkills={extracted_skills} topJob={topJob} /></div>;
      case 'salary':    return <div className="animate-fade-in" style={{ padding: '2rem' }}><SalaryInsights extractedSkills={extracted_skills} bestFitJobId={topJob?.id} /></div>;
      case 'interview': return <div className="animate-fade-in" style={{ padding: '2rem' }}><InterviewPrep topJob={topJob} extractedSkills={extracted_skills} /></div>;
      case 'linkedin':  return <div className="animate-fade-in" style={{ padding: '2rem' }}><LinkedInOptimizer data={data} /></div>;
      case 'courses':   return <div className="animate-fade-in" style={{ padding: '2rem' }}><CoursesPanel courses={allCourses} missingSkills={topJob?.missing_skills || []} presentSkills={extracted_skills} currentMatch={best_fit_job_score} title="Recommended Courses" subtitle="Curated learning paths matched to your skill gaps and target roles" /></div>;
      default:          return <OverviewTab data={data} topJob={topJob} onTabChange={setActiveTab} onViewRoadmap={handleViewRoadmap} />;
    }
  };

  return (
    <div className="layout-sidebar">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} data={data} onLogout={onLogout} />

      <div className="sidebar-content">
        {/* ── Sticky Top Bar ── */}
        <div className="top-bar">
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-4)', fontWeight: 500 }}>Career AI</span>
            <span style={{ color: 'var(--text-4)', fontSize: '10px' }}>›</span>
            <span style={{ color: 'var(--text-2)', fontWeight: 600, textTransform: 'capitalize' }}>
              {activeTab === 'overview' ? 'Dashboard' : activeTab === 'jd' ? 'JD Matcher' : activeTab.replace('_', ' ')}
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Readiness pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '4px 10px', borderRadius: 100,
              background: `${readinessColor}14`, border: `1px solid ${readinessColor}30`,
              fontSize: '12px'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: readinessColor, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontWeight: 700, color: readinessColor }}>{career_readiness_score}%</span>
              <span style={{ color: 'var(--text-3)' }}>ready</span>
            </div>
            <CopilotTrigger
              message={`I am ${career_readiness_score}% ready for ${best_fit_job}. What should I do next?`}
              label="Ask AI"
              variant="ghost"
              icon="🤖"
            />
            <button className="btn btn-secondary btn-sm" onClick={onReset} style={{ gap: '4px' }}>↺ Reset</button>
            <ThemeToggleTopBar />

          </div>
        </div>

        {/* Main content */}
        <ErrorBoundary>
          {renderContent()}
        </ErrorBoundary>

        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-4)', fontSize: '11px', borderTop: '1px solid var(--border)' }}>
          🧭 CareerCompass AI · Powered by Groq
        </div>
      </div>
    </div>
  );
}

/* ── HERO SECTION ── */
function HeroBanner({ score, role, topJob, onTabChange, onOpenCopilot }) {
  const missing   = topJob?.missing_critical || [];
  const topTwo    = missing.slice(0, 2);
  const potential = Math.min(score + Math.min(missing.length * 5, 25), 98);
  const color     = score >= 70 ? 'var(--success)' : score >= 45 ? 'var(--primary)' : 'var(--warning)';
  const fitLabel  = score >= 75 ? 'Strong Fit' : score >= 55 ? 'Moderate Fit' : 'Needs Work';
  const fitIcon   = score >= 75 ? '🟢' : score >= 55 ? '🟡' : '🔴';

  return (
    <div style={{
      padding: '32px 48px 28px',
      background: `linear-gradient(135deg, ${score >= 70 ? 'rgba(34,197,94,0.07)' : score >= 45 ? 'rgba(99,102,241,0.07)' : 'rgba(245,158,11,0.07)'}, transparent 60%)`,
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>

        {/* LEFT — Score + headline */}
        <div style={{ flex: 1, minWidth: 260 }}>
          {/* Labels row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Career Readiness</span>
            <ConfidenceIndicator score={score} />
            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: 100, background: `${color}15`, border: `1px solid ${color}30`, fontWeight: 600, color }}>{fitIcon} {fitLabel}</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-1)', lineHeight: 1.15, marginBottom: '8px', letterSpacing: '-0.03em' }}>
            <span style={{ color, fontVariantNumeric: 'tabular-nums' }}>{score}%</span> ready for
            <br /><span style={{ color: 'var(--text-1)' }}>{role}</span>
          </h1>

          {/* Impact line */}
          {topTwo.length > 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-3)', margin: 0 }}>
              ⚡ Learn <strong style={{ color: 'var(--primary-light)' }}>{topTwo.join(' + ')}</strong> → reach <strong style={{ color }}>{potential}%</strong>
            </p>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--text-3)', margin: 0 }}>✅ Strong profile — build projects to stand out</p>
          )}

          {/* Progress bar */}
          <div style={{ maxWidth: 360, marginTop: '16px' }}>
            <div style={{ height: 6, borderRadius: 100, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ height: '100%', width: `${score}%`, background: `linear-gradient(90deg, ${color}, ${color}bb)`, borderRadius: 100, transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)', boxShadow: `0 0 8px ${color}60` }} />
              {potential > score && (
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${potential}%`, width: 2, background: 'rgba(255,255,255,0.3)', borderRadius: 100 }} />
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-4)' }}>Current · {score}%</span>
              {potential > score && <span style={{ fontSize: '11px', color: 'var(--text-4)' }}>Potential · {potential}%</span>}
            </div>
          </div>
        </div>

        {/* RIGHT — 2 actions max */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
          {onOpenCopilot && (
            <button
              onClick={() => onOpenCopilot(`I am ${score}% ready for ${role}. How do I reach ${potential}%?`)}
              className="btn btn-primary"
            >
              🚀 Improve to {potential}%
            </button>
          )}
          {onTabChange && (
            <button onClick={() => onTabChange('roadmap')} className="btn btn-secondary">
              🗺 View Roadmap
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Tab: Overview ── */
function OverviewTab({ data, topJob, onTabChange, onViewRoadmap }) {
  const {
    extracted_skills = [], job_matches = [], top_3_matches = [],
    career_readiness_score = 0, best_fit_job = '', best_fit_job_score = 0,
    insights = [], roadmap = []
  } = data;
  const { openCopilot } = useCopilot();

  const scoreColor = career_readiness_score >= 70 ? 'var(--success)' : career_readiness_score >= 45 ? 'var(--primary)' : 'var(--warning)';
  const topMissing = topJob?.missing_critical?.slice(0, 3) || [];

  return (
    <div className="animate-fade-in">
      {/* 1 — HERO */}
      <HeroBanner
        score={career_readiness_score}
        role={best_fit_job}
        topJob={topJob}
        onTabChange={onTabChange}
        onOpenCopilot={openCopilot}
      />

      <div style={{ padding: '32px 48px' }}>

        {/* 2 — METRICS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }} className="stats-row">
          {[
            { icon: '📊', label: 'Readiness', value: `${career_readiness_score}%`, sub: career_readiness_score >= 70 ? 'Strong profile' : 'Keep improving', color: scoreColor },
            { icon: '🎯', label: 'Top Role Fit', value: `${best_fit_job_score}%`, sub: best_fit_job.split(' ')[0], color: 'var(--success)' },
            { icon: '💼', label: 'Roles Matched', value: job_matches.length, sub: 'Across all levels', color: 'var(--primary)' },
          ].map(s => (
            <div key={s.label} className="stat-card hover-lift">
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.icon}</div>
              <div className="stat-value" style={{ color: s.color, WebkitTextFillColor: s.color, backgroundImage: 'none', fontSize: '32px' }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sublabel">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Smart Nudge */}
        <SmartNudges score={career_readiness_score} />

        {/* 3 — NEXT STEPS */}
        <div style={{ marginBottom: '32px' }}>
          <div className="section-row">
            <div>
              <div className="section-title">🚀 Next Steps</div>
              <div className="section-sub">Highest ROI actions for you right now</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="dash-r1">
            <WhatIfAnalysis baseScore={career_readiness_score} missingSkills={insights[0]?.focus_skills || topMissing} />
            <CareerSimulation currentScore={career_readiness_score} />
          </div>
        </div>

        {/* 4A — Critical Missing Skills (scannable bullets) */}
        {topMissing.length > 0 && (
          <div className="card" style={{ padding: '20px 24px', marginBottom: '16px', borderLeft: '3px solid var(--danger)' }}>
            <div className="section-row" style={{ marginBottom: '12px' }}>
              <div className="section-title">⚠️ Critical Gaps</div>
              <button className="btn btn-ghost btn-sm" onClick={() => onTabChange('roadmap')}>Fix These →</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {topMissing.map(skill => (
                <span key={skill} className="badge badge-danger" style={{ fontSize: '12px', padding: '4px 10px' }}>🔥 {skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* 4B — DETAILS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginBottom: '16px' }} className="dash-r1">
          {/* Best-Fit Roles card */}
          <div className="card" style={{ padding: '20px 24px' }}>
            <div className="section-row">
              <div>
                <div className="section-title">💼 Best-Fit Roles</div>
                <div className="section-sub">Matched from {job_matches.length} roles</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => onTabChange('jobs')}>All →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {top_3_matches.slice(0, 2).map((job, i) => (
                <JobMatchCard key={job.id} job={job} rank={i + 1} onViewRoadmap={onViewRoadmap} />
              ))}
            </div>
          </div>
          <CompanyMatchPanel baseScore={career_readiness_score} skills={extracted_skills} />
        </div>

        {/* Copilot CTA */}
        <div className="card-gradient" style={{ padding: '20px 24px', marginBottom: '16px', cursor: 'pointer' }}
          onClick={() => openCopilot(`I have ${extracted_skills.length} skills, ${career_readiness_score}% ready for ${best_fit_job}. Give me a 30-day plan.`)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '28px' }}>🤖</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)' }}>Ask Copilot for a personalised plan</div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Context-aware · based on your resume</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>Chat →</div>
          </div>
        </div>

        {/* Skill Gap + Roadmap */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="dash-r2">
          <MissingSkills jobMatches={job_matches} />
          <CareerRoadmap roadmap={roadmap.slice(0, 7)} roadmapJob={data.roadmap_job || best_fit_job} />
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .dash-r1, .dash-r2 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .stats-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Tab: Jobs ── */
function JobsTab({ jobMatches, onViewRoadmap }) {
  const [sortBy, setSortBy] = useState('match');
  const [filterLevel, setFilterLevel] = useState('All');
  const levels = ['All', 'Intermediate', 'Senior'];

  const filtered = jobMatches
    .filter(j => filterLevel === 'All' || j.experience_level === filterLevel)
    .sort((a, b) => sortBy === 'match' ? b.match_percentage - a.match_percentage : a.title.localeCompare(b.title));

  return (
    <div className="animate-fade-in" style={{ padding: '32px 48px' }}>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h2 className="page-title">💼 Job Mapping</h2>
          <p className="page-subtitle">{jobMatches.length} roles · sorted by fit</p>
        </div>
        <CopilotTrigger message="Which job should I apply to first?" label="Ask AI" variant="ghost" icon="🤖" />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-4)', fontWeight: 500 }}>Filter:</span>
        {levels.map(l => (
          <button key={l} onClick={() => setFilterLevel(l)}
            className={`btn btn-sm ${filterLevel === l ? 'btn-primary' : 'btn-secondary'}`}>{l}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          <button className={`btn btn-sm ${sortBy === 'match' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSortBy('match')}>📊 Best Fit</button>
          <button className={`btn btn-sm ${sortBy === 'alpha' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSortBy('alpha')}>A–Z</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
        {filtered.map((job, i) => (
          <div key={job.id} style={{ animation: `slideUp ${0.1 + i * 0.04}s ease forwards`, opacity: 0 }}>
            <JobMatchCard job={job} rank={i + 1} onViewRoadmap={onViewRoadmap} />
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">No roles found</div>
          <div className="empty-state-text">Try a different filter level</div>
        </div>
      )}
    </div>
  );
}

/* ── Tab: Roadmap ── */
function RoadmapTab({ roadmap, roadmapJob, jobMatches }) {
  return (
    <div className="animate-fade-in" style={{ padding: 'var(--sp-6) var(--sp-8)' }}>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 className="page-title">🗺 Career Roadmap</h2>
          <p className="page-subtitle">Personalized learning path · prioritized by impact</p>
        </div>
        <CopilotTrigger
          message="Explain my career roadmap. What should I learn first? Give me a 90-day plan."
          label="Ask Copilot"
          variant="ghost"
          icon="🤖"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }} className="dash-r1">
        <CareerRoadmap roadmap={roadmap} roadmapJob={roadmapJob} />
        <MissingSkills jobMatches={jobMatches} />
      </div>
      <style>{`@media(max-width:900px){ .dash-r1{grid-template-columns:1fr !important;} }`}</style>
    </div>
  );
}
