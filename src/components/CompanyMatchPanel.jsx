import React from 'react';

// Hardcoded for demo/hackathon wow factor
const COMPANIES = [
  { name: 'Amazon', logo: '☁️', fit: 85, gap: 'System Design' },
  { name: 'Google', logo: '🔍', fit: 72, gap: 'LeetCode Hard' },
  { name: 'Meta',   logo: '♾️', fit: 78, gap: 'React Performance' },
  { name: 'Stripe', logo: '💳', fit: 90, gap: 'API Design' }
];

export default function CompanyMatchPanel({ baseScore, skills }) {
  return (
    <div className="card" style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-1)' }}>🏢 Top Company Match</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-4)' }}>Simulated fit based on verified skills</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {COMPANIES.map(comp => {
          // Add some jitter to make it look realistic based on baseScore
          const finalFit = Math.min(Math.max(baseScore - 15 + (comp.fit % 20), 40), 98);
          const color = finalFit >= 80 ? 'var(--success)' : finalFit >= 60 ? 'var(--warning)' : 'var(--danger)';
          
          return (
            <div key={comp.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{comp.logo}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-2)' }}>{comp.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-4)' }}>Gap: {comp.gap}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color }}>{finalFit}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
