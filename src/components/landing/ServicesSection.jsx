/**
 * ServicesSection.jsx
 * CareerCompass AI — Redesigned Services Grid Component
 */
import React, { useRef, useState, useEffect } from 'react';

const SERVICES = [
  {
    icon: '📝',
    title: 'Resume Compliance Review',
    desc: 'Structured resume evaluation checks against scoring standards, layout guidelines, and ATS parameters.',
    features: ['ATS readiness index', 'Keyword frequency check', 'Structural layout report'],
    color: '#14b8a6'
  },
  {
    icon: '🧭',
    title: 'Automated Career Mentoring',
    desc: 'Powered by Groq LLM to respond to complex job queries, skill gaps, and professional direction paths.',
    features: ['Real-time AI advising', 'Targeted career matching', 'Industry growth benchmarks'],
    color: '#06b6d4'
  },
  {
    icon: '🗂️',
    title: 'Portfolio Calibration',
    desc: 'Analyze project repositories and personal portfolios to suggest high-impact stack additions.',
    features: ['GitHub project critiques', 'Stack selection guidance', 'Project roadmap links'],
    color: '#2dd4bf'
  },
  {
    icon: '🎤',
    title: 'Adaptive Mock Prep',
    desc: 'Practice core concepts through randomized, level-calibrated multiple-choice questionnaires.',
    features: ['Role-specific test banks', 'Difficulty scales', 'Score histories'],
    color: '#22c55e'
  },
  {
    icon: '🔬',
    title: 'Granular Skill Matrix',
    desc: 'Map out comprehensive tech stack matrices to reveal core proficiencies and path targets.',
    features: ['Skill map visualization', 'Gap recommendations', 'Priority queue learning'],
    color: '#f59e0b'
  },
  {
    icon: '📊',
    title: 'Readiness Score Tracker',
    desc: 'Real-time assessment tracking displays current progress scores as you mark milestones.',
    features: ['Real-time status scoring', 'Target metrics log', 'Goal completion alerts'],
    color: '#a78bfa'
  }
];

export default function ServicesSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="services" style={{
      padding: '100px clamp(1rem, 5vw, 4rem)',
      background: 'linear-gradient(180deg, #061220 0%, #020c16 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(20, 184, 166, 0.08)', border: '1px solid rgba(20, 184, 166, 0.25)',
            fontSize: '0.8rem', fontWeight: 600, color: '#2dd4bf',
            letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.25rem'
          }}>
            💼 Professional Services
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800, color: '#f0fdfa',
            letterSpacing: '-0.03em', lineHeight: 1.15
          }}>
            Accelerate Your Journey <br />
            <span style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', display: 'inline-block'
            }}>
              With Premium Assessments
            </span>
          </h2>
        </div>

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }} className="services-grid">
          
          {SERVICES.map((srv, i) => (
            <div
              key={srv.title}
              style={{
                background: 'rgba(6, 18, 32, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'default'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = srv.color;
                e.currentTarget.style.boxShadow = `0 12px 30px ${srv.color}08`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '1.5rem', width: '48px', height: '48px',
                borderRadius: '12px', background: `${srv.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem', border: `1px solid ${srv.color}25`
              }}>
                {srv.icon}
              </div>

              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '1.2rem', fontWeight: 700, color: '#f0fdfa',
                marginBottom: '0.75rem'
              }}>{srv.title}</h3>

              <p style={{
                fontSize: '0.9rem', color: '#94a3b8',
                lineHeight: 1.6, marginBottom: '1.75rem', flexGrow: 1
              }}>{srv.desc}</p>

              {/* Feature bullet list */}
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px'
              }}>
                {srv.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b' }}>
                    <span style={{ color: srv.color }}>✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
