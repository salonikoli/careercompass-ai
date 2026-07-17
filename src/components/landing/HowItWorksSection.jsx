/**
 * HowItWorksSection.jsx
 * CareerCompass AI — Redesigned Interactive Step Progression
 */
import React, { useRef, useState, useEffect } from 'react';

const STEPS = [
  {
    step: '01',
    icon: '📤',
    title: 'Upload Your Resume',
    desc: 'Upload your resume PDF in one click. Our parser extracts skills, qualifications, and history securely.',
    color: '#14b8a6'
  },
  {
    step: '02',
    icon: '🔬',
    title: 'AI Analysis & Audit',
    desc: 'Our AI checks formatting, filters keywords, and computes your compatibility rating.',
    color: '#06b6d4'
  },
  {
    step: '03',
    icon: '🎯',
    title: 'Role Matching',
    desc: 'Your profile matches against 25 pathways to calculate compatibility percentages and salary ranges.',
    color: '#2dd4bf'
  },
  {
    step: '04',
    icon: '🗺️',
    title: 'Custom Roadmap',
    desc: 'We map out precise step-by-step goals, projects to build, and resources to close skill gaps.',
    color: '#22c55e'
  }
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="how-it-works" style={{
      padding: '100px clamp(1rem, 5vw, 4rem)',
      background: 'linear-gradient(180deg, #061220 0%, #020c16 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: '10%', left: '50%',
        transform: 'translateX(-50%)',
        width: '50vw', height: '50vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(20,184,166,0.04) 0%, transparent 60%)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(20, 184, 166, 0.08)', border: '1px solid rgba(20, 184, 166, 0.25)',
            fontSize: '0.8rem', fontWeight: 600, color: '#2dd4bf',
            letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.25rem'
          }}>
            ⚡ Roadmap Flow
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800, color: '#f0fdfa',
            letterSpacing: '-0.03em', lineHeight: 1.15
          }}>
            How It Works in <br />
            <span style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', display: 'inline-block'
            }}>
              4 Simple Steps
            </span>
          </h2>
        </div>

        {/* Steps display - Horizontal on desktop, vertical on mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
          position: 'relative'
        }} className="steps-wrapper">
          
          {STEPS.map((step, i) => (
            <div
              key={step.step}
              onMouseEnter={() => setActiveStep(i)}
              style={{
                background: activeStep === i ? 'rgba(20,184,166,0.04)' : 'rgba(6, 18, 32, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderColor: activeStep === i ? step.color : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '30px 24px',
                textAlign: 'center',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'default',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                animation: visible ? `fadeSlideUp 0.6s ease ${i * 0.12}s both` : 'none',
                position: 'relative',
                boxShadow: activeStep === i ? `0 15px 35px ${step.color}08` : 'none'
              }}
            >
              {/* Step counter badge */}
              <div style={{
                position: 'absolute', top: '-15px', left: '50%',
                transform: 'translateX(-50%)',
                width: '32px', height: '32px', borderRadius: '50%',
                background: activeStep === i ? step.color : 'rgba(255,255,255,0.08)',
                color: '#fff', fontSize: '0.85rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: activeStep === i ? `0 0 12px ${step.color}` : 'none',
                transition: 'all 0.3s'
              }}>
                {step.step}
              </div>

              <div style={{
                fontSize: '2rem', marginBottom: '1.25rem', marginTop: '10px'
              }}>
                {step.icon}
              </div>

              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '1.1rem', fontWeight: 700,
                color: '#f0fdfa', marginBottom: '0.75rem'
              }}>{step.title}</h3>

              <p style={{
                fontSize: '0.85rem', color: '#94a3b8',
                lineHeight: 1.5
              }}>{step.desc}</p>
            </div>
          ))}

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .steps-wrapper {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
