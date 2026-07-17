/**
 * TrendingSkills.jsx — v6
 * 2025 skills heatmap — visual grid showing hot, rising, and stable skills.
 * Shows which trending skills the user already has vs missing.
 */

import React from 'react';

const TRENDING_SKILLS = [
  // Hot (AI/ML wave)
  { skill: 'LLM / GenAI',      category: 'AI',       level: 'hot',     icon: '🔥' },
  { skill: 'RAG Systems',       category: 'AI',       level: 'hot',     icon: '🔥' },
  { skill: 'Python',            category: 'Code',     level: 'hot',     icon: '🔥' },
  { skill: 'Kubernetes',        category: 'DevOps',   level: 'hot',     icon: '🔥' },
  { skill: 'Rust',              category: 'Code',     level: 'hot',     icon: '🔥' },
  { skill: 'TypeScript',        category: 'Web',      level: 'hot',     icon: '🔥' },
  { skill: 'Terraform',         category: 'DevOps',   level: 'hot',     icon: '🔥' },
  { skill: 'React',             category: 'Web',      level: 'hot',     icon: '🔥' },
  // Rising
  { skill: 'Solidity / Web3',   category: 'Blockchain', level: 'rising', icon: '📈' },
  { skill: 'MLOps',             category: 'AI',         level: 'rising', icon: '📈' },
  { skill: 'Next.js',           category: 'Web',        level: 'rising', icon: '📈' },
  { skill: 'Figma / Design Sys',category: 'Design',     level: 'rising', icon: '📈' },
  { skill: 'Kafka',             category: 'Data',       level: 'rising', icon: '📈' },
  { skill: 'Spark',             category: 'Data',       level: 'rising', icon: '📈' },
  { skill: 'Flutter',           category: 'Mobile',     level: 'rising', icon: '📈' },
  { skill: 'Selenium / QA',     category: 'QA',         level: 'rising', icon: '📈' },
  // Stable
  { skill: 'SQL',               category: 'Data',     level: 'stable', icon: '→' },
  { skill: 'Docker',            category: 'DevOps',   level: 'stable', icon: '→' },
  { skill: 'Machine Learning',  category: 'AI',       level: 'stable', icon: '→' },
  { skill: 'AWS',               category: 'Cloud',    level: 'stable', icon: '→' },
  { skill: 'Git',               category: 'DevOps',   level: 'stable', icon: '→' },
  { skill: 'Agile / Scrum',     category: 'PM',       level: 'stable', icon: '→' },
  { skill: 'Node.js',           category: 'Web',      level: 'stable', icon: '→' },
  { skill: 'Linux',             category: 'DevOps',   level: 'stable', icon: '→' },
];

const LEVEL_CONFIG = {
  hot:    { bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.3)',    text: '#ef4444',  label: 'Hot'    },
  rising: { bg: 'rgba(249,115,22,0.1)',   border: 'rgba(249,115,22,0.3)',   text: 'var(--primary)', label: 'Rising' },
  stable: { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', text: 'var(--text-3)', label: 'Stable' },
};

const CAT_COLORS = {
  AI:         '#ef4444',
  Code:       '#3b82f6',
  Web:        '#06b6d4',
  DevOps:     '#f97316',
  Data:       '#10b981',
  Cloud:      '#6366f1',
  Mobile:     '#a855f7',
  Blockchain: '#eab308',
  Design:     '#ec4899',
  QA:         '#14b8a6',
  PM:         '#8b5cf6',
};

export default function TrendingSkills({ extractedSkills = [] }) {
  const skillSet = new Set(extractedSkills.map(s => s.toLowerCase()));

  const matches = TRENDING_SKILLS.filter(t =>
    skillSet.has(t.skill.toLowerCase()) ||
    extractedSkills.some(s => t.skill.toLowerCase().includes(s.toLowerCase()))
  );

  const hotMatches = matches.filter(m => m.level === 'hot').length;
  const total = TRENDING_SKILLS.filter(t => t.level === 'hot').length;

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-1)', marginBottom: '0.1rem' }}>
            2025 Trending Skills Heatmap
          </h3>
          <p style={{ fontSize: '0.78rem', marginBottom: 0 }}>
            Skills in highest demand this year — <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
              {matches.length}/{TRENDING_SKILLS.length}
            </span> you already have
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.65rem' }}>
          {[
            { level: 'hot',    label: '🔥 Hot' },
            { level: 'rising', label: '📈 Rising' },
            { level: 'stable', label: '→ Stable' },
          ].map(({ level, label }) => {
            const c = LEVEL_CONFIG[level];
            return (
              <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: c.text }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: c.text, flexShrink: 0 }} />
                {label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hot skills score */}
      <div style={{
        padding: '0.7rem 1rem', marginBottom: '1.25rem',
        background: hotMatches >= 4 ? 'var(--green-subtle)' : 'var(--primary-subtle)',
        border: `1px solid ${hotMatches >= 4 ? 'var(--green-border)' : 'rgba(249,115,22,0.25)'}`,
        borderRadius: 10, fontSize: '0.82rem',
        color: hotMatches >= 4 ? 'var(--green)' : 'var(--primary)',
        fontWeight: 500,
      }}>
        🔥 You have <strong>{hotMatches}/{total}</strong> of the hottest 2025 skills.
        {hotMatches >= 6 ? " Outstanding! You're ahead of most candidates." :
         hotMatches >= 3 ? " Good coverage. Add 2-3 more hot skills to stand out." :
         " Focus on Python, LLM/GenAI, and TypeScript to gain a competitive edge."}
      </div>

      {/* Heatmap grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem' }}>
        {TRENDING_SKILLS.map(t => {
          const hasSkill = skillSet.has(t.skill.toLowerCase()) ||
            extractedSkills.some(s => t.skill.toLowerCase().includes(s.toLowerCase()));
          const lc = LEVEL_CONFIG[t.level];
          const catColor = CAT_COLORS[t.category] || '#6366f1';

          return (
            <div
              key={t.skill}
              style={{
                padding: '0.6rem 0.75rem',
                background: hasSkill ? `${catColor}12` : lc.bg,
                border: `1px solid ${hasSkill ? `${catColor}30` : lc.border}`,
                borderRadius: 8,
                transition: 'var(--transition)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 4px 12px ${catColor}20`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Has-skill indicator stripe */}
              {hasSkill && (
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 0, height: 0,
                  borderLeft: '14px solid transparent',
                  borderTop: `14px solid ${catColor}`,
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem' }}>{t.icon}</span>
                <span style={{
                  fontSize: '0.63rem', padding: '0.05rem 0.35rem',
                  borderRadius: 100, fontWeight: 600,
                  background: `${catColor}20`, color: catColor,
                }}>{t.category}</span>
              </div>
              <div style={{
                fontSize: '0.78rem', fontWeight: 600,
                color: hasSkill ? 'var(--text-1)' : lc.text,
                lineHeight: 1.2,
              }}>
                {t.skill}
              </div>
              <div style={{ fontSize: '0.65rem', color: hasSkill ? catColor : 'var(--text-4)', marginTop: '0.2rem', fontWeight: hasSkill ? 600 : 400 }}>
                {hasSkill ? '✓ You have this' : lc.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
