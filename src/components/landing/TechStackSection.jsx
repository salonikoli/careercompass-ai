/**
 * TechStackSection.jsx
 * Technology badges/cards display
 */
import React, { useRef, useState, useEffect } from 'react';

const TECHNOLOGIES = [
  { name: 'Python',          icon: '🐍', color: '#3b7ab8', category: 'Backend' },
  { name: 'FastAPI',         icon: '⚡', color: '#009688', category: 'Backend' },
  { name: 'React',           icon: '⚛️', color: '#61dafb', category: 'Frontend' },
  { name: 'Vite',            icon: '🔥', color: '#646cff', category: 'Frontend' },
  { name: 'MongoDB',         icon: '🍃', color: '#47a248', category: 'Database' },
  { name: 'Node.js',         icon: '💚', color: '#68a063', category: 'Backend' },
  { name: 'Groq AI',         icon: '🧭', color: '#14b8a6', category: 'AI/ML' },
  { name: 'NLP',             icon: '💬', color: '#06b6d4', category: 'AI/ML' },
  { name: 'Machine Learning',icon: '🤖', color: '#2dd4bf', category: 'AI/ML' },
  { name: 'TensorFlow',      icon: '🔶', color: '#ff8f00', category: 'AI/ML' },
  { name: 'OpenAI APIs',     icon: '🌐', color: '#74aa9c', category: 'AI/ML' },
  { name: 'JWT Auth',        icon: '🔐', color: '#a78bfa', category: 'Security' },
  { name: 'Uvicorn',         icon: '🦄', color: '#9333ea', category: 'Backend' },
  { name: 'Mongoose',        icon: '📦', color: '#880000', category: 'Database' },
  { name: 'CSS3',            icon: '🎨', color: '#264de4', category: 'Frontend' },
  { name: 'Docker',          icon: '🐳', color: '#0ea5e9', category: 'DevOps' },
];

const CATEGORIES = ['All', 'AI/ML', 'Backend', 'Frontend', 'Database', 'Security', 'DevOps'];

function TechBadge({ tech, index, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '0.8rem 1.1rem',
        background: hovered ? `${tech.color}18` : 'rgba(15,23,42,0.8)',
        border: `1px solid ${hovered ? tech.color + '55' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '12px',
        transition: 'all 0.28s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hovered ? `0 12px 28px ${tech.color}25` : 'none',
        backdropFilter: 'blur(10px)',
        cursor: 'default',
        opacity: visible ? 1 : 0,
        animation: visible ? `fadeIn 0.4s ease ${(index * 40)}ms both` : 'none',
      }}
    >
      <span style={{
        fontSize: '1.4rem',
        filter: hovered ? `drop-shadow(0 0 8px ${tech.color})` : 'none',
        transition: 'filter 0.3s ease',
      }}>{tech.icon}</span>
      <div>
        <div style={{
          fontSize: '0.85rem', fontWeight: 700,
          color: hovered ? tech.color : '#e2e8f0',
          transition: 'color 0.3s ease',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>{tech.name}</div>
        <div style={{ fontSize: '0.68rem', color: '#475569', marginTop: '1px' }}>
          {tech.category}
        </div>
      </div>
    </div>
  );
}

export default function TechStackSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const filtered = activeCategory === 'All'
    ? TECHNOLOGIES
    : TECHNOLOGIES.filter(t => t.category === activeCategory);

  return (
    <section ref={ref} id="tech-stack" style={{
      padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
      background: 'linear-gradient(180deg, #030712 0%, #060d1f 100%)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', borderRadius: '100px',
            background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)',
            fontSize: '0.75rem', fontWeight: 700, color: '#67e8f9',
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.25rem',
          }}>
            ⚙️ Tech Stack
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2rem, 4.5vw, 3rem)',
            fontWeight: 800, color: '#f8fafc',
            letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1rem',
          }}>
            Built with{' '}
            <span style={{
              background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Modern Technologies
            </span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto' }}>
            A production-grade stack powering every AI feature
          </p>
        </div>

        {/* Category filter */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '0.5rem',
          flexWrap: 'wrap', marginBottom: '2.5rem',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 16px', borderRadius: '100px', border: 'none',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                transition: 'all 0.2s ease',
                background: activeCategory === cat ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.04)',
                color: activeCategory === cat ? '#67e8f9' : '#475569',
                borderBottom: activeCategory === cat ? '1px solid rgba(6,182,212,0.5)' : '1px solid transparent',
                outline: 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tech grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '0.85rem',
        }}>
          {filtered.map((tech, i) => (
            <TechBadge key={tech.name} tech={tech} index={i} visible={visible} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}
