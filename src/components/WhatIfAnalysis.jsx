import React, { useState } from 'react';

export default function WhatIfAnalysis({ baseScore, missingSkills }) {
  const [toggled, setToggled] = useState({});

  const handleToggle = (skill) => setToggled(prev => ({ ...prev, [skill]: !prev[skill] }));

  const activeCount = Object.values(toggled).filter(Boolean).length;
  // Calculate dynamic score, giving +4% per skill roughly
  const dynamicScore = Math.min(baseScore + (activeCount * 4), 99);
  
  // Show top 3 missing skills logically
  const options = missingSkills?.slice(0, 3) || ['Machine Learning', 'AWS', 'Docker'];

  return (
    <div className="card" style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-1)' }}>🧪 What-If Analysis</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-4)' }}>See how new skills impact your readiness</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projected Score</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: activeCount > 0 ? 'var(--success)' : 'var(--text-1)' }}>
            {dynamicScore}%
          </div>
        </div>
        {activeCount > 0 && (
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success)', background: 'var(--success-subtle)', padding: '0.2rem 0.6rem', borderRadius: 100 }}>
            +{activeCount * 4}% Boost
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {options.map(skill => (
          <button
            key={skill}
            onClick={() => handleToggle(skill)}
            className="hover-lift"
            style={{
              padding: '0.35rem 0.8rem',
              borderRadius: 100,
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: toggled[skill] ? '1px solid var(--primary)' : '1px solid var(--border-md)',
              background: toggled[skill] ? 'var(--primary-subtle)' : 'var(--bg-card)',
              color: toggled[skill] ? 'var(--primary)' : 'var(--text-2)',
              transition: 'all 0.2s ease',
            }}
          >
            {toggled[skill] ? '✓' : '+'} Learn {skill}
          </button>
        ))}
      </div>
    </div>
  );
}
