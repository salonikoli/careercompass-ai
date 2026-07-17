/**
 * AboutSection.jsx
 * CareerCompass AI — Redesigned Premium About Section
 */
import React, { useRef, useState, useEffect } from 'react';

const PILLARS = [
  {
    icon: '🧠',
    title: 'AI Analysis',
    desc: 'Groq LLM extracts technical and soft skills, keyword density, and formatting compliance in under 5 seconds.',
    color: '#14b8a6',
    gradient: 'rgba(20, 184, 166, 0.08)'
  },
  {
    icon: '🧭',
    title: 'Precision Matching',
    desc: 'Compatibility analysis mapping your experience, education level, and tech stack against target profiles.',
    color: '#06b6d4',
    gradient: 'rgba(6, 182, 212, 0.08)'
  },
  {
    icon: '🗺️',
    title: 'Step-by-Step Roadmaps',
    desc: 'Instantly generate detailed progression schedules, project goals, and targeted online courses.',
    color: '#2dd4bf',
    gradient: 'rgba(45, 212, 191, 0.08)'
  },
  {
    icon: '🔓',
    title: 'Completely Open',
    desc: 'No credit cards, sign-ins, or gated walls. Just pure instant feedback for your professional growth.',
    color: '#22c55e',
    gradient: 'rgba(34, 197, 94, 0.08)'
  }
];

export default function AboutSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="about" style={{
      padding: '100px clamp(1rem, 5vw, 4rem)',
      background: 'linear-gradient(180deg, #061220 0%, #020c16 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '5rem',
          alignItems: 'center'
        }} className="about-grid">
          
          {/* LEFT: Bento grid of core pillars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }} className="about-pillars">
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.title}
                style={{
                  background: 'rgba(6, 18, 32, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '24px',
                  padding: '24px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                  cursor: 'default'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = pillar.color;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <div style={{
                  fontSize: '1.5rem', width: '42px', height: '42px',
                  borderRadius: '10px', background: pillar.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1rem', border: `1px solid ${pillar.color}25`
                }}>
                  {pillar.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '1.05rem', fontWeight: 700, color: '#f0fdfa',
                  marginBottom: '0.5rem'
                }}>{pillar.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>{pillar.desc}</p>
              </div>
            ))}
          </div>

          {/* RIGHT: Metric Progress list */}
          <div style={{
            textAlign: 'left',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s'
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '100px',
              background: 'rgba(20, 184, 166, 0.08)', border: '1px solid rgba(20, 184, 166, 0.25)',
              fontSize: '0.8rem', fontWeight: 600, color: '#2dd4bf',
              letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.25rem'
            }}>
              ⚙️ Architecture & Quality
            </div>
            
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800, color: '#f0fdfa',
              letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.5rem'
            }}>
              Calibrated for <br />
              <span style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', display: 'inline-block'
              }}>
                Maximum Precision
              </span>
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Unlike simple keyword matching engines, CareerCompass AI uses natural language understanding to assess the depth and context of your achievements. We calibrate matches against active criteria from leading platforms.
            </p>

            {/* Micro Progress Metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { label: 'Parser Skill Extraction', value: '94%', color: '#14b8a6' },
                { label: 'ATS Compat Analysis', value: '89%', color: '#06b6d4' },
                { label: 'Role Alignment Rate', value: '97%', color: '#2dd4bf' }
              ].map(m => (
                <div key={m.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, color: '#94a3b8' }}>{m.label}</span>
                    <span style={{ fontWeight: 700, color: m.color }}>{m.value}</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', top: 0, bottom: 0, left: 0,
                      width: visible ? m.value : '0%',
                      background: m.color, borderRadius: '100px',
                      transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
                    }} />
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 4rem !important;
          }
        }
        @media (max-width: 500px) {
          .about-pillars {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
