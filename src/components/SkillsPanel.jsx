/**
 * SkillsPanel.jsx
 * ---------------
 * Displays extracted skills as animated chips with category coloring.
 */

import React, { useState } from 'react';

// Categorize skill into a color variant
function getSkillVariant(skill) {
  const s = skill.toLowerCase();
  if (['python','java','javascript','typescript','r','c++','scala','go','rust','kotlin'].some(x => s.includes(x))) return 'primary';
  if (['html','css','react','angular','vue','nodejs','express','django','flask'].some(x => s.includes(x))) return 'warning';
  if (['machine learning','deep learning','nlp','tensorflow','pytorch','keras','scikit'].some(x => s.includes(x))) return 'success';
  if (['sql','pandas','numpy','tableau','power bi','data'].some(x => s.includes(x))) return 'info';
  return 'primary';
}

function getVariantStyles(variant) {
  const map = {
    primary: 'skill-chip-primary',
    success: 'skill-chip-success',
    warning: 'skill-chip-warning',
    info: {
      background: 'rgba(6, 182, 212, 0.12)',
      border: '1px solid rgba(6, 182, 212, 0.3)',
      color: '#22d3ee',
    },
  };
  return map[variant] || 'skill-chip-primary';
}

export default function SkillsPanel({ skills = [] }) {
  const [showAll, setShowAll] = useState(false);
  const displaySkills = showAll ? skills : skills.slice(0, 20);

  return (
    <div className="glass-card animate-slide-up" style={{ padding: '1.75rem' }}>
      {/* Header */}
      <div className="section-header">
        <div className="section-icon section-icon-purple">🧩</div>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 0 }}>
            Extracted Skills
          </h3>
          <p style={{ fontSize: '0.82rem', marginBottom: 0 }}>
            {skills.length} skills identified from your resume
          </p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span className="badge badge-info">{skills.length} skills</span>
        </div>
      </div>

      {/* Skills chips */}
      {skills.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '2rem',
          color: 'var(--text-dim)', fontSize: '0.9rem',
        }}>
          No skills detected. Try uploading a more detailed resume.
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {displaySkills.map((skill, i) => {
              const variant = getSkillVariant(skill);
              return (
                <span
                  key={skill}
                  className={`skill-chip ${typeof getVariantStyles(variant) === 'string' ? getVariantStyles(variant) : ''}`}
                  style={{
                    ...(typeof getVariantStyles(variant) === 'object' ? getVariantStyles(variant) : {}),
                    animationDelay: `${i * 30}ms`,
                    animation: 'scaleIn 0.3s ease forwards',
                  }}
                >
                  {skill}
                </span>
              );
            })}
          </div>

          {skills.length > 20 && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowAll(s => !s)}
              style={{ marginTop: '1rem' }}
            >
              {showAll ? '▲ Show Less' : `▼ Show ${skills.length - 20} More`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
