import React, { useState } from 'react';

export default function RecruiterView({ score, strengths, concerns }) {
  const [active, setActive] = useState(false);

  if (!active) {
    return (
      <button 
        onClick={() => setActive(true)}
        className="btn btn-secondary btn-sm"
        style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
      >
        👁️ View as Recruiter
      </button>
    );
  }

  const hireProb = score >= 80 ? 'High' : score >= 60 ? 'Moderate' : 'Low';
  const hireColor = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="card" style={{ padding: 'var(--sp-4)', background: 'var(--bg-input)', border: '1px solid var(--border)', position: 'relative' }}>
      <button 
        onClick={() => setActive(false)} 
        style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer' }}
      >✕</button>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.2rem' }}>👔</span>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-1)' }}>Recruiter Context</h3>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-4)', textTransform: 'uppercase' }}>Hiring Probability</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: hireColor }}>{hireProb}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)', marginBottom: '0.4rem' }}>👍 Strengths</div>
          <ul style={{ fontSize: '0.75rem', color: 'var(--text-2)', paddingLeft: '1rem', margin: 0 }}>
            {strengths?.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--warning)', marginBottom: '0.4rem' }}>🚩 Concerns</div>
          <ul style={{ fontSize: '0.75rem', color: 'var(--text-2)', paddingLeft: '1rem', margin: 0 }}>
            {concerns?.slice(0, 2).map((c, i) => <li key={i}>{c}</li>)}
            {!concerns?.length && <li>Lack of recent projects</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
