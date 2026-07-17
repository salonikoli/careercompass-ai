/**
 * HeroSection.jsx
 * CareerCompass AI — Next-gen Split-Screen interactive Hero
 */
import React, { useState, useEffect } from 'react';



export default function HeroSection({ onGetStarted, onAnalyzeResume, onExploreCareers }) {
  const [visible, setVisible] = useState(false);
  const [scanState, setScanState] = useState('idle'); // idle -> scanning -> success
  const [skillsList, setSkillsList] = useState([]);

  useEffect(() => {
    setVisible(true);
    // Loop simulation of scanning in the hero graphic
    const interval = setInterval(() => {
      setScanState('scanning');
      setSkillsList([]);
      setTimeout(() => {
        setSkillsList(['Python', 'React', 'FastAPI', 'Groq LLM', 'Docker']);
        setScanState('success');
      }, 3000);
    }, 9000);

    // Initial trigger
    setScanState('scanning');
    setTimeout(() => {
      setSkillsList(['Python', 'React', 'FastAPI', 'Groq LLM', 'Docker']);
      setScanState('success');
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      padding: '100px clamp(1rem, 5vw, 4rem) 60px',
      background: '#020c16',
      overflow: 'hidden',
    }}>
      {/* Background visual graphics */}
      <div style={{
        position: 'absolute', top: '10%', right: '-5%',
        width: '50vw', height: '50vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 60%)',
        filter: 'blur(80px)', pointerEvents: 'none', zIndex: 1
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-10%',
        width: '45vw', height: '45vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 60%)',
        filter: 'blur(80px)', pointerEvents: 'none', zIndex: 1
      }} />

      {/* Grid Pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none', zIndex: 1
      }} />

      <div style={{
        width: '100%', maxWidth: '1280px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem',
        alignItems: 'center', position: 'relative', zIndex: 2,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
      }} className="hero-grid">

        {/* LEFT COLUMN: Premium Copy & Interactive CTAs */}
        <div style={{ textAlign: 'left' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(20,184,166,0.08)',
            border: '1px solid rgba(20,184,166,0.25)',
            marginBottom: '1.75rem',
            fontSize: '0.8rem', fontWeight: 600, color: '#2dd4bf',
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#14b8a6', boxShadow: '0 0 10px #14b8a6',
              animation: 'pulse 2s infinite'
            }} />
            New Era of Career Guidance
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 800, lineHeight: 1.1,
            color: '#f0fdfa', letterSpacing: '-0.03em',
            marginBottom: '1.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            Navigate Your <br />
            <span style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', display: 'inline-block',
              marginTop: '12px'
            }}>
              Perfect Career Path
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: '#94a3b8', lineHeight: 1.7,
            maxWidth: '560px', marginBottom: '2.5rem',
            fontFamily: "'Inter', sans-serif"
          }}>
            Analyze your resume instantly with CareerCompass AI. Extract skills, audit keyword compliance, match against job requirements, and get structured learning paths tailored to land your next job.
          </p>

          {/* Premium Pill-shaped Buttons */}
          <div style={{
            display: 'flex', gap: '1rem', flexWrap: 'wrap',
            alignItems: 'center', marginBottom: '3rem'
          }}>
            <button
              onClick={onGetStarted}
              style={{
                padding: '16px 36px', borderRadius: '100px', border: 'none',
                background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                color: '#fff', fontSize: '1rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: '0 8px 30px rgba(20,184,166,0.3)',
                transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(20,184,166,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(20,184,166,0.3)';
              }}
            >
              Get Started Free <span>→</span>
            </button>

          </div>

          {/* Quick Metrics */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '2rem', maxWidth: '500px'
          }}>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f0fdfa', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>&lt; 5s</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Response Time</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2dd4bf', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>100%</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Private & Secure</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#06b6d4', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>25+</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Tech Job Roles</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Asymmetric Interactive Resume Scanner Mockup */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'
        }} className="hero-right">
          {/* Glass Card Mockup */}
          <div style={{
            width: '100%', maxWidth: '440px',
            background: 'rgba(6, 18, 32, 0.75)',
            border: '1px solid rgba(20, 184, 166, 0.15)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            zIndex: 2,
            transition: 'border-color 0.5s ease',
            borderColor: scanState === 'scanning' ? 'rgba(20, 184, 166, 0.4)' : 'rgba(20, 184, 166, 0.15)'
          }}>
            {/* Mock Card Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'between',
              paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>resume_scanner.py</span>
            </div>

            {/* Scan animation element */}
            <div style={{
              background: 'rgba(2, 12, 22, 0.8)',
              borderRadius: '16px',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '260px'
            }}>
              {/* Laser line scanner */}
              {scanState === 'scanning' && (
                <div style={{
                  position: 'absolute', left: 0, right: 0,
                  height: '3px', background: 'linear-gradient(90deg, transparent, #2dd4bf, transparent)',
                  boxShadow: '0 0 12px #2dd4bf',
                  animation: 'laserScan 3s linear infinite',
                  zIndex: 3
                }} />
              )}

              {/* Mock Resume Document Layout */}
              <div style={{ opacity: scanState === 'scanning' ? 0.4 : 1, transition: 'all 0.5s' }}>
                <div style={{ width: '60px', height: '8px', background: '#94a3b8', borderRadius: '4px', marginBottom: '12px' }} />
                <div style={{ width: '120px', height: '6px', background: '#475569', borderRadius: '3px', marginBottom: '24px' }} />
                
                {/* Horizontal skeleton bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  <div style={{ width: '100%', height: '5px', background: '#334155', borderRadius: '2px' }} />
                  <div style={{ width: '90%', height: '5px', background: '#334155', borderRadius: '2px' }} />
                  <div style={{ width: '95%', height: '5px', background: '#334155', borderRadius: '2px' }} />
                </div>
              </div>

              {/* Output parsed skills in real-time */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '0.75rem', color: '#14b8a6', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {scanState === 'scanning' ? '🔍 Parsing Skills...' : '🎯 Skills Extracted:'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {skillsList.map((skill, index) => (
                    <span
                      key={skill}
                      style={{
                        padding: '5px 12px', borderRadius: '100px',
                        background: 'rgba(20, 184, 166, 0.1)',
                        border: '1px solid rgba(20, 184, 166, 0.25)',
                        color: '#2dd4bf', fontSize: '0.75rem', fontWeight: 500,
                        animation: 'fadeInScale 0.3s ease forwards',
                        animationDelay: `${index * 0.1}s`,
                        opacity: 0, transform: 'scale(0.8)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                  {scanState === 'scanning' && (
                    <span style={{ fontSize: '0.75rem', color: '#475569', fontStyle: 'italic' }}>Reading document structure...</span>
                  )}
                </div>
              </div>

              {/* Status footer inside card */}
              <div style={{
                marginTop: '30px', display: 'flex', justifyBetween: 'center', alignItems: 'center',
                borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: scanState === 'scanning' ? '#f59e0b' : '#22c55e',
                    boxShadow: scanState === 'scanning' ? '0 0 8px #f59e0b' : '0 0 8px #22c55e',
                  }} />
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                    {scanState === 'scanning' ? 'STATUS: PROCESSING_PDF' : 'STATUS: ANALYSIS_COMPLETE'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Underlay glowing decoration elements */}
          <div style={{
            position: 'absolute', bottom: '-20px', left: '-20px',
            width: '140px', height: '140px', background: 'rgba(6,182,212,0.15)',
            borderRadius: '24px', filter: 'blur(30px)', zIndex: 1
          }} />
        </div>

      </div>

      {/* Embedded local CSS Animations */}
      <style>{`
        @keyframes laserScan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes fadeInScale {
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            gap: 4rem !important;
          }
          .hero-grid > div {
            text-align: center !important;
          }
          .hero-grid div[style*="justify-content: center"] {
            justify-content: center !important;
          }
          .hero-right {
            order: -1 !important;
          }
        }
      `}</style>
    </section>
  );
}
