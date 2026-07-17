import React from 'react';

export default function CareerSimulation({ currentScore }) {
  const targetJob = "Senior ML Engineer"; // Mock
  const STAGES = [
    { label: 'Today', score: currentScore, active: true },
    { label: '30 Days', score: Math.min(currentScore + 8, 99), subtitle: '+AWS, Docker' },
    { label: '90 Days', score: Math.min(currentScore + 15, 99), subtitle: '+System Design' },
    { label: 'Job Ready', score: 99, subtitle: 'Offers unlocked' }
  ];

  return (
    <div className="card" style={{ padding: 'var(--sp-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-1)' }}>⏱️ Career Simulation</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-4)' }}>Projected timeline to {targetJob}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        {/* Track Line */}
        <div style={{ position: 'absolute', top: 12, left: '10%', right: '10%', height: 2, background: 'var(--border)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: 12, left: '10%', width: '40%', height: 2, background: 'var(--primary)', zIndex: 0 }} />

        {STAGES.map((s, i) => (
          <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: '0.4rem', width: 80 }}>
            {/* Node */}
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: i <= 1 ? 'var(--primary)' : 'var(--bg-card)',
              border: `2px solid ${i <= 1 ? 'var(--primary)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 700, color: i <= 1 ? 'white' : 'var(--text-3)',
              boxShadow: i <= 1 ? '0 0 10px rgba(99,102,241,0.4)' : 'none'
            }}>
              {i === 3 ? '🏆' : s.score}
            </div>
            {/* Label */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: i <= 1 ? 'var(--text-1)' : 'var(--text-3)' }}>{s.label}</div>
              {s.subtitle && <div style={{ fontSize: '0.6rem', color: 'var(--text-4)', marginTop: 2 }}>{s.subtitle}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
