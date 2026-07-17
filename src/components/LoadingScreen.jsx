/**
 * LoadingScreen.jsx
 * -----------------
 * Animated processing screen shown while backend analyzes the resume.
 */

import React, { useState, useEffect } from 'react';

const STEPS = [
  { icon: '📄', label: 'Parsing PDF resume...', duration: 800 },
  { icon: '🧠', label: 'Running NLP skill extraction...', duration: 1000 },
  { icon: '🔍', label: 'Matching against job roles...', duration: 900 },
  { icon: '📊', label: 'Calculating match scores...', duration: 700 },
  { icon: '📚', label: 'Finding top course recommendations...', duration: 600 },
  { icon: '✨', label: 'Building your career dashboard...', duration: 500 },
];

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    let stepIndex = 0;
    const runStep = () => {
      if (stepIndex < STEPS.length - 1) {
        const timeout = setTimeout(() => {
          stepIndex++;
          setCurrentStep(stepIndex);
          runStep();
        }, STEPS[stepIndex].duration);
        return () => clearTimeout(timeout);
      }
    };
    runStep();
  }, []);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', padding: '3rem 2rem',
    }}>
      {/* Animated orb */}
      <div style={{ position: 'relative', marginBottom: '3rem' }}>
        {/* Pulse rings */}
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '2px solid var(--primary)',
            animation: `pulse-ring ${1.5 + i * 0.4}s ease-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }} />
        ))}
        {/* Core orb */}
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem', boxShadow: '0 0 40px var(--primary-glow)',
          animation: 'spin 4s linear infinite',
        }}>
          🧠
        </div>
      </div>

      {/* Title */}
      <h2 style={{
        fontSize: '1.6rem', marginBottom: '0.5rem',
        background: 'linear-gradient(135deg, var(--primary-light), var(--secondary))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        AI Processing{dots}
      </h2>
      <p style={{ marginBottom: '3rem', fontSize: '0.95rem' }}>
        Our AI is analyzing your resume
      </p>

      {/* Steps list */}
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {STEPS.map((step, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;
          return (
            <div
              key={index}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
                marginBottom: '0.5rem',
                background: isActive
                  ? 'rgba(99, 102, 241, 0.12)'
                  : isDone ? 'rgba(16, 185, 129, 0.07)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(99, 102, 241, 0.3)' : isDone ? 'rgba(16, 185, 129, 0.2)' : 'transparent'}`,
                transition: 'all 0.4s ease',
                opacity: index > currentStep ? 0.3 : 1,
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>
                {isDone ? '✅' : isActive ? step.icon : step.icon}
              </span>
              <span style={{
                fontSize: '0.9rem',
                color: isActive ? 'var(--text-main)' : isDone ? '#34d399' : 'var(--text-dim)',
                fontWeight: isActive ? 600 : 400,
              }}>
                {step.label}
              </span>
              {isActive && (
                <div style={{
                  marginLeft: 'auto', width: '16px', height: '16px', borderRadius: '50%',
                  border: '2px solid rgba(99,102,241,0.3)', borderTopColor: 'var(--primary)',
                  animation: 'spin 0.8s linear infinite', flexShrink: 0,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
