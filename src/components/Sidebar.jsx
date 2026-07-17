/**
 * Sidebar.jsx — v8 SaaS
 * Clean professional sidebar with emoji icons and built-in theme toggle.
 * Theme toggle moved FROM floating button INTO sidebar footer.
 */

import React, { useState } from 'react';


const PRIMARY_NAV = [
  { id: 'overview',  icon: '📊', label: 'Dashboard'     },
  { id: 'jobs',      icon: '💼', label: 'Job Mapping'   },
  { id: 'roadmap',   icon: '🗺',  label: 'Career Roadmap'},
  { id: 'jd',        icon: '📋', label: 'JD Matcher'    },
];

const TOOLS_NAV = [
  { id: 'audit',     icon: '📄', label: 'Resume Audit'      },
  { id: 'ats',       icon: '🎯', label: 'ATS Analyzer'      },
  { id: 'benchmark', icon: '📈', label: 'Skill Benchmark'   },
  { id: 'salary',    icon: '💰', label: 'Salary Insights'   },
  { id: 'interview', icon: '🎤', label: 'Interview Prep'    },
  { id: 'linkedin',  icon: '🔗', label: 'LinkedIn Optimizer'},
  { id: 'courses',   icon: '📚', label: 'Courses'           },
];

export default function Sidebar({ activeTab, onTabChange, data, onLogout }) {
  const [toolsOpen, setToolsOpen] = useState(false);


  const score     = data?.career_readiness_score || 0;
  const role      = data?.best_fit_job || '';
  const skills    = data?.extracted_skills?.length || 0;

  const scoreColor =
    score >= 70 ? 'var(--success)' :
    score >= 45 ? 'var(--primary)' : 'var(--warning)';

  const isToolActive = TOOLS_NAV.some(t => t.id === activeTab);

  return (
    <aside className="sidebar">

      {/* ── Logo ── */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🧭</div>
        <div>
          <div className="sidebar-logo-text">CareerCompass AI</div>
          <div className="sidebar-logo-sub">Career Platform</div>
        </div>
      </div>

      {/* ── Readiness Card ── */}
      {score > 0 && (
        <div style={{
          margin: '0.75rem',
          padding: '0.75rem 0.85rem',
          background: `${scoreColor}10`,
          border: `1px solid ${scoreColor}28`,
          borderRadius: 10,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-2)', lineHeight: 1.3, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {role || 'Analyzing…'}
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-4)', marginTop: '0.1rem' }}>
                {skills} skills detected
              </div>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'Space Grotesk,sans-serif', color: scoreColor, lineHeight: 1, flexShrink: 0 }}>
              {score}%
            </div>
          </div>
          <div style={{ height: 3, borderRadius: 100, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${score}%`, background: scoreColor, borderRadius: 100, transition: 'width 1.2s ease' }} />
          </div>
        </div>
      )}

      {/* ── Primary Nav ── */}
      <div style={{ padding: '0 0.5rem' }}>
        <div className="sidebar-section-label">Main</div>
        {PRIMARY_NAV.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {activeTab === item.id && (
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
            )}
          </button>
        ))}
      </div>

      {/* ── Tools Nav — collapsible ── */}
      <div style={{ padding: '0 0.5rem', marginTop: '0.35rem' }}>
        <button
          onClick={() => setToolsOpen(o => !o)}
          style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0.25rem 0.5rem 0.25rem 1rem', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6 }}
        >
          <div className="sidebar-section-label" style={{ margin: 0, flex: 1, textAlign: 'left' }}>Tools</div>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-4)', transform: (toolsOpen || isToolActive) ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease', paddingRight: '0.5rem' }}>▼</span>
        </button>

        {(toolsOpen || isToolActive) && (
          <div style={{ animation: 'slideUp 0.2s ease' }}>
            {TOOLS_NAV.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => onTabChange(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span style={{ flex: 1, fontSize: '0.8rem' }}>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-4)', textAlign: 'center', padding: '4px' }}>🧭 CareerCompass AI</div>
      </div>
    </aside>
  );
}
