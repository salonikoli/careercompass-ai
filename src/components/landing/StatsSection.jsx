/**
 * StatsSection.jsx
 * CareerCompass AI — Premium Asymmetric Stats Section
 */
import React, { useState, useEffect, useRef } from 'react';

const STATS = [
  { value: 5000, suffix: '+', label: 'Students Guided', icon: '🎓', color: '#14b8a6', desc: 'Across leading engineering & tech institutes' },
  { value: 1000, suffix: '+', label: 'Matches Created', icon: '🎯', color: '#06b6d4', desc: 'Successful job compatibility maps generated' },
  { value: 95, suffix: '%', label: 'Accuracy Rating', icon: '⭐', color: '#2dd4bf', desc: 'Precision of AI gap & ATS score recommendations' },
  { value: 300, suffix: '+', label: 'Learning Paths', icon: '🗺️', color: '#22c55e', desc: 'Curated courses & custom skill roadmaps' }
];

function useCountUp(target, duration = 2000, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function StatCard({ stat, active, index }) {
  const count = useCountUp(stat.value, 1500 + index * 200, active);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '24px',
        background: hovered ? 'rgba(20, 184, 166, 0.05)' : 'rgba(6, 18, 32, 0.4)',
        border: '1px solid rgba(20, 184, 166, 0.1)',
        borderColor: hovered ? stat.color : 'rgba(20, 184, 166, 0.1)',
        borderRadius: '20px',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? `0 20px 40px ${stat.color}15` : 'none',
        backdropFilter: 'blur(10px)',
        opacity: active ? 1 : 0,
        animation: active ? `fadeSlideUp 0.6s ease ${index * 0.1}s both` : 'none'
      }}
    >
      <div style={{
        fontSize: '1.8rem',
        marginBottom: '1rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: `${stat.color}12`,
        border: `1px solid ${stat.color}30`
      }}>
        {stat.icon}
      </div>

      <div style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
        fontWeight: 800,
        color: '#f0fdfa',
        letterSpacing: '-0.04em',
        lineHeight: 1,
        marginBottom: '0.25rem'
      }}>
        {count}{stat.suffix}
      </div>

      <div style={{
        fontSize: '1rem',
        fontWeight: 700,
        color: stat.color,
        marginBottom: '0.5rem',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        {stat.label}
      </div>

      <p style={{
        fontSize: '0.82rem',
        color: '#64748b',
        lineHeight: 1.4
      }}>
        {stat.desc}
      </p>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="stats" style={{
      padding: '100px clamp(1rem, 5vw, 4rem)',
      background: '#020c16',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.2), transparent)'
      }} />

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1.3fr',
        gap: '4rem',
        alignItems: 'center'
      }} className="stats-layout">
        
        {/* Left Side: Modern Copy block */}
        <div style={{ textAlign: 'left' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', borderRadius: '100px',
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            fontSize: '0.8rem', fontWeight: 600, color: '#06b6d4',
            letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.25rem'
          }}>
            📈 Platform Metrics
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            fontWeight: 800,
            color: '#f0fdfa',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1.25rem'
          }}>
            Powering Student <br />
            Success Globally
          </h2>
          <p style={{
            fontSize: '1.05rem',
            color: '#94a3b8',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            Real-time analytics and data driving actual transformations. We track student readiness metrics across critical tech stacks to build true industry alignment.
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(20, 184, 166, 0.03)',
            border: '1px solid rgba(20, 184, 166, 0.1)',
            padding: '16px 20px',
            borderRadius: '16px',
            maxWidth: '380px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>
              Insights are calibrated daily using active job requirements from leading platforms.
            </span>
          </div>
        </div>

        {/* Right Side: Bento grid of stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem'
        }} className="stats-grid">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} active={active} index={i} />
          ))}
        </div>

      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .stats-layout {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
        @media (max-width: 500px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
