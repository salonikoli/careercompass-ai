/**
 * DashboardPreviewSection.jsx
 * CareerCompass AI — Redesigned Premium Interactive Dashboard Mockup
 */
import React, { useRef, useState, useEffect } from 'react';

const TABS = ['Resume Analysis', 'Job Matches', 'Skill Gaps', 'Interview Prep'];

const MOCK_JOBS = [
  { title: 'ML Engineer', company: 'Google', match: 94, color: '#14b8a6' },
  { title: 'Data Scientist', company: 'Microsoft', match: 88, color: '#06b6d4' },
  { title: 'AI Researcher', company: 'Meta', match: 81, color: '#2dd4bf' },
  { title: 'Backend Engineer', company: 'Stripe', match: 76, color: '#22c55e' }
];

const MOCK_SKILLS = [
  { name: 'Python', level: 90, status: 'Strong Match', color: '#22c55e' },
  { name: 'Machine Learning', level: 75, status: 'Target Skill', color: '#14b8a6' },
  { name: 'React', level: 60, status: 'Moderate', color: '#f59e0b' },
  { name: 'Docker', level: 35, status: 'Skill Gap', color: '#ef4444' },
  { name: 'Kubernetes', level: 12, status: 'Missing', color: '#ef4444' }
];

function TabContent({ activeTab }) {
  if (activeTab === 0) return (
    <div style={{ animation: 'fadeInScale 0.35s ease forwards' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'ATS Score', value: '94%', color: '#22c55e', icon: '✅' },
          { label: 'Skills Found', value: '18', color: '#14b8a6', icon: '⚡' },
          { label: 'Pathways Matched', value: '25', color: '#06b6d4', icon: '🎯' }
        ].map(m => (
          <div key={m.label} style={{
            flex: 1, minWidth: '100px',
            padding: '1.25rem',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '16px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{m.icon}</div>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1.75rem', fontWeight: 800,
              color: m.color, lineHeight: 1
            }}>{m.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', fontWeight: 500 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{
        background: 'rgba(20, 184, 166, 0.05)',
        border: '1px solid rgba(20, 184, 166, 0.15)',
        borderRadius: '14px',
        padding: '16px 20px'
      }}>
        <div style={{ fontSize: '0.8rem', color: '#2dd4bf', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          💡 Optimization Suggestion
        </div>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
          Add measurable quantitative metrics to your experience section (e.g. "Improved processing speed by 40%"). Resumes with stats get significantly higher recruitment callbacks.
        </p>
      </div>
    </div>
  );

  if (activeTab === 1) return (
    <div style={{ animation: 'fadeInScale 0.35s ease forwards' }}>
      {MOCK_JOBS.map((job, i) => (
        <div key={job.title} style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          padding: '14px 18px', marginBottom: '8px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px'
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: `${job.color}15`, border: `1px solid ${job.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', flexShrink: 0
          }}>💼</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f0fdfa', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{job.title}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{job.company}</div>
          </div>
          <div style={{
            padding: '5px 12px', borderRadius: '100px',
            background: `${job.color}15`, color: job.color,
            fontSize: '0.8rem', fontWeight: 700, border: `1px solid ${job.color}30`
          }}>{job.match}% match</div>
        </div>
      ))}
    </div>
  );

  if (activeTab === 2) return (
    <div style={{ animation: 'fadeInScale 0.35s ease forwards' }}>
      {MOCK_SKILLS.map((skill) => (
        <div key={skill.name} style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
            <span style={{ color: '#ccfbf1', fontWeight: 600 }}>{skill.name}</span>
            <span style={{
              fontSize: '0.75rem', padding: '2px 10px', borderRadius: '100px',
              background: `${skill.color}12`, color: skill.color, fontWeight: 700,
              border: `1px solid ${skill.color}25`
            }}>
              {skill.status}
            </span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '100px',
              width: `${skill.level}%`,
              background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)`,
              transition: 'width 1s ease'
            }} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ animation: 'fadeInScale 0.35s ease forwards' }}>
      {[
        { q: 'Explain the difference between supervised and unsupervised learning models?', diff: 'Hard', type: 'Technical' },
        { q: 'How do you approach managing memory overhead in large Python applications?', diff: 'Medium', type: 'Technical' },
        { q: 'Describe a project where you solved a major technical deadlock.', diff: 'Easy', type: 'Behavioral' }
      ].map((q, i) => (
        <div key={i} style={{
          padding: '16px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '14px', marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              fontSize: '0.7rem', padding: '3px 8px', borderRadius: '100px',
              background: q.diff === 'Hard' ? 'rgba(239,68,68,0.12)' : q.diff === 'Medium' ? 'rgba(245,158,11,0.12)' : 'rgba(34,197,94,0.12)',
              color: q.diff === 'Hard' ? '#f87171' : q.diff === 'Medium' ? '#fbbf24' : '#4ade80',
              fontWeight: 700, border: `1px solid ${q.diff === 'Hard' ? '#f8717130' : q.diff === 'Medium' ? '#fbbf2430' : '#4ade8030'}`
            }}>{q.diff}</span>
            <span style={{
              fontSize: '0.7rem', padding: '3px 8px', borderRadius: '100px',
              background: 'rgba(20,184,166,0.12)', color: '#2dd4bf', fontWeight: 700,
              border: '1px solid rgba(20,184,166,0.25)'
            }}>{q.type}</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{q.q}</p>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPreviewSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Auto rotate tabs for engagement
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(t => (t + 1) % TABS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} id="dashboard-preview" style={{
      padding: '100px clamp(1rem, 5vw, 4rem)',
      background: 'linear-gradient(180deg, #020c16 0%, #061220 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.25), transparent)'
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(20, 184, 166, 0.08)', border: '1px solid rgba(20, 184, 166, 0.25)',
            fontSize: '0.8rem', fontWeight: 600, color: '#2dd4bf',
            letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.25rem'
          }}>
            🖥️ Platform Preview
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800, color: '#f0fdfa',
            letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem'
          }}>
            Unveil Your Personalized <br />
            <span style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', display: 'inline-block'
            }}>
              Insight Dashboard
            </span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            Here is a live layout preview of the structured assessment modules populated for every profile.
          </p>
        </div>

        {/* Browser Mock Frame */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          maxWidth: '860px', margin: '0 auto'
        }}>
          
          {/* Header Chrome */}
          <div style={{
            background: 'rgba(6, 18, 32, 0.95)',
            border: '1px solid rgba(20, 184, 166, 0.15)',
            borderRadius: '20px 20px 0 0',
            padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: '10px',
            borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
            </div>
            <div style={{
              flex: 1, marginLeft: '12px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '8px', padding: '6px 16px',
              fontSize: '0.75rem', color: '#64748b',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              <span>🔒</span> careercompass-ai.vercel.app/dashboard
            </div>
          </div>

          {/* Body Content */}
          <div style={{
            background: 'rgba(6, 18, 32, 0.85)',
            border: '1px solid rgba(20, 184, 166, 0.15)',
            borderTop: 'none',
            borderRadius: '0 0 20px 20px',
            padding: '2rem',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02)',
            backdropFilter: 'blur(20px)'
          }}>
            
            {/* Custom rounded capsule tabs */}
            <div style={{
              display: 'flex', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap',
              background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.04)', maxWidth: 'fit-content'
            }}>
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  style={{
                    padding: '8px 20px', borderRadius: '100px', border: 'none',
                    background: activeTab === i ? 'rgba(20, 184, 166, 0.12)' : 'transparent',
                    color: activeTab === i ? '#2dd4bf' : '#64748b',
                    fontSize: '0.8rem', fontWeight: activeTab === i ? 700 : 600,
                    cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    border: activeTab === i ? '1px solid rgba(20, 184, 166, 0.25)' : '1px solid transparent'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <TabContent activeTab={activeTab} />
          </div>

        </div>

      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}
