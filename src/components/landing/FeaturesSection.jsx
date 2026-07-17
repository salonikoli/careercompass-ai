/**
 * FeaturesSection.jsx
 * CareerCompass AI — Redesigned Premium Bento Grid Features
 */
import React, { useRef, useState, useEffect } from 'react';

const FEATURES = [
  {
    icon: '📄',
    title: 'AI Resume Analyzer',
    desc: 'Deep parsing extracts tech stack, experience duration, and accomplishments in seconds.',
    color: '#14b8a6',
    tag: 'Core Analysis',
    gridSpan: 'span 2'
  },
  {
    icon: '🔍',
    title: 'Skill Gap Detection',
    desc: 'Match your resume against requirements to see exactly what critical skills are missing.',
    color: '#06b6d4',
    tag: 'Comparison',
    gridSpan: 'span 1'
  },
  {
    icon: '🎯',
    title: 'Career Recommendations',
    desc: 'Compatibility rating mapped against 25 distinct engineering and tech pathways.',
    color: '#2dd4bf',
    tag: 'Smart Matching',
    gridSpan: 'span 1'
  },
  {
    icon: '🗺️',
    title: 'Learning Roadmaps',
    desc: 'Get structured progression timelines with curated external resources and course suggestions.',
    color: '#22c55e',
    tag: 'Timeline',
    gridSpan: 'span 2'
  },
  {
    icon: '💼',
    title: 'Opportunity Mapping',
    desc: 'Discover tailored internship roles with direct skill criteria and compatibility metrics.',
    color: '#f59e0b',
    tag: 'Internships',
    gridSpan: 'span 1'
  },
  {
    icon: '⚡',
    title: 'ATS Compliance Audits',
    desc: 'Receive immediate compliance score reports to bypass automated recruitment gateways.',
    color: '#a78bfa',
    tag: 'Optimization',
    gridSpan: 'span 1'
  },
  {
    icon: '🧠',
    title: 'AI MCQ Assessments',
    desc: 'Generate interactive mock practice questions to validate your skill readiness levels.',
    color: '#38bdf8',
    tag: 'Preparation',
    gridSpan: 'span 1'
  }
];

export default function FeaturesSection() {
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
    <section ref={ref} id="features" style={{
      padding: '100px clamp(1rem, 5vw, 4rem)',
      background: 'linear-gradient(180deg, #020c16 0%, #061220 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
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
            ✨ Intelligent Toolset
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800, color: '#f0fdfa',
            letterSpacing: '-0.03em', lineHeight: 1.15
          }}>
            Equipped with Everything <br />
            <span style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', display: 'inline-block'
            }}>
              You Need to Succeed
            </span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          gridAutoFlow: 'dense',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }} className="bento-grid-container">
          
          {FEATURES.map((feat, i) => (
            <div
              key={feat.title}
              style={{
                gridColumn: feat.gridSpan,
                background: 'rgba(6, 18, 32, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'between',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = feat.color;
                e.currentTarget.style.boxShadow = `0 12px 30px ${feat.color}08`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              className="bento-card"
            >
              <div>
                <div style={{ display: 'flex', justifyBetween: 'center', alignItems: 'center', marginBottom: '1.5rem', justifyContent: 'space-between' }}>
                  <div style={{
                    fontSize: '1.4rem', width: '42px', height: '42px',
                    borderRadius: '12px', background: `${feat.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${feat.color}25`
                  }}>
                    {feat.icon}
                  </div>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 600, color: feat.color,
                    padding: '4px 10px', borderRadius: '100px',
                    background: `${feat.color}08`, border: `1px solid ${feat.color}20`,
                    textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}>
                    {feat.tag}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '1.15rem', fontWeight: 700, color: '#f0fdfa',
                  marginBottom: '0.75rem'
                }}>{feat.title}</h3>
                <p style={{
                  fontSize: '0.88rem', color: '#94a3b8',
                  lineHeight: 1.5, marginBottom: '1rem'
                }}>{feat.desc}</p>
              </div>
            </div>
          ))}

        </div>

      </div>

      <style>{`
        @media (max-width: 960px) {
          .bento-grid-container {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .bento-card {
            grid-column: span 1 !important;
          }
        }
        @media (max-width: 640px) {
          .bento-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
