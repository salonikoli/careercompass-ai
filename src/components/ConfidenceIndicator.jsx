import React from 'react';

export default function ConfidenceIndicator({ score }) {
  let level = 'High';
  let color = 'var(--success)';
  if (score < 60) { level = 'Low'; color = 'var(--danger)'; }
  else if (score < 80) { level = 'Medium'; color = 'var(--warning)'; }

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      padding: '0.25rem 0.6rem',
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${color}40`,
      borderRadius: 100,
      fontSize: '0.7rem',
      fontWeight: 600,
      color: 'var(--text-2)'
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {level} Confidence
    </div>
  );
}
