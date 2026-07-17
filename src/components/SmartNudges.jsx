import React, { useState, useEffect } from 'react';

const NUDGES = [
  (score) => score >= 80 ? "⚡ You're 3% away from top 10% candidates in this role." : "⚡ Adding 1 certified project unlocks premium interviews.",
  () => "⚡ Candidates who learn MLOps see a 40% higher callback rate.",
  (score) => `⚡ Your score of ${score}% puts you ahead of 65% of applicants.`
];

export default function SmartNudges({ score }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % NUDGES.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      padding: '0.6rem 1rem',
      background: 'var(--primary-subtle)',
      border: '1px solid var(--primary-glow)',
      borderRadius: 'var(--r-md)',
      color: 'var(--primary)',
      fontSize: '0.82rem',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: 'var(--sp-4)',
      animation: 'fadeIn 0.5s ease',
    }}>
      <div key={index} style={{ animation: 'slideUp 0.3s ease' }}>
        {NUDGES[index](score)}
      </div>
    </div>
  );
}
