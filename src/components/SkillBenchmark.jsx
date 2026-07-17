/**
 * SkillBenchmark.jsx — v7
 * -----------------------
 * Role-based competitive benchmark:
 * - Auto-detects best role from topJob
 * - Role switcher (9 roles)
 * - Core skill coverage % + human-language headline
 * - ✔ Strong Skills / ❌ Missing Core grid
 * - Category heatmap (unchanged)
 * - Insight: "Learning X will significantly increase your match"
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ROLE_BENCHMARKS,
  benchmarkAgainstRole,
} from '../utils/roleIntelligence';
import CopilotTrigger from './CopilotTrigger';

const CATEGORIES = [
  { key: 'programming', label: 'Programming',   icon: '💻', color: '#6366f1', skills: ['python','java','javascript','typescript','c++','r','scala','golang','c#','kotlin'] },
  { key: 'web',         label: 'Web Dev',        icon: '🌐', color: '#06b6d4', skills: ['html','css','react','angular','vue','nodejs','rest api','graphql','nextjs'] },
  { key: 'ml_ai',       label: 'AI / ML',        icon: '🤖', color: '#f472b6', skills: ['machine learning','deep learning','nlp','tensorflow','pytorch','scikit-learn','llm','computer vision'] },
  { key: 'data',        label: 'Data',           icon: '📊', color: '#10b981', skills: ['sql','pandas','numpy','data analysis','statistics','tableau','power bi','spark'] },
  { key: 'cloud',       label: 'Cloud / DevOps', icon: '☁️', color: '#f59e0b', skills: ['aws','azure','gcp','docker','kubernetes','terraform','linux','ci/cd','devops'] },
  { key: 'soft',        label: 'Fundamentals',   icon: '🔑', color: '#a78bfa', skills: ['git','agile','unit testing','data structures','algorithms','mongodb','postgresql'] },
];

function Bar({ value, max = 100, color, delay = 0 }) {
  const [w, setW] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setW((value / max) * 100), delay); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, max, delay]);
  return (
    <div ref={ref} style={{ height: 7, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', width: `${w}%`, background: color, borderRadius: 100, transition: `width 1.1s cubic-bezier(0.4,0,0.2,1) ${delay}ms`, boxShadow: `0 0 8px ${color}66` }} />
    </div>
  );
}

function estimatePercentile(userSkills, roleName) {
  const bench = benchmarkAgainstRole(userSkills, roleName);
  if (!bench) return 40;
  const coreW = bench.coreMatch * 0.6;
  const secW  = bench.secondaryMatch * 0.4;
  return Math.min(Math.round(coreW + secW), 97);
}

export default function SkillBenchmark({ extractedSkills = [], topJob = null }) {
  const ROLE_NAMES = Object.keys(ROLE_BENCHMARKS);

  // Auto-select role from topJob, fallback to first role
  const autoRole = topJob?.title
    ? ROLE_NAMES.find(r => topJob.title.toLowerCase().includes(r.toLowerCase())) || ROLE_NAMES[0]
    : ROLE_NAMES[0];

  const [selectedRole, setSelectedRole] = useState(autoRole);

  const skillSet      = new Set(extractedSkills.map(s => s.toLowerCase()));
  const bench         = benchmarkAgainstRole(extractedSkills, selectedRole);
  const percentile    = estimatePercentile(extractedSkills, selectedRole);
  const roleData      = ROLE_BENCHMARKS[selectedRole];

  // Category coverage
  const categoryData = CATEGORIES.map(cat => {
    const matched = cat.skills.filter(s => skillSet.has(s));
    return { ...cat, matched: matched.length, total: cat.skills.length };
  });
  const categoriesCovered = categoryData.filter(c => c.matched > 0).length;

  const percentileColor = percentile >= 75 ? '#34d399' : percentile >= 55 ? '#818cf8' : percentile >= 35 ? '#fbbf24' : '#f87171';
  const percentileLabel = percentile >= 80 ? `Top ${100 - percentile}% of ${selectedRole} candidates` :
                          percentile >= 60 ? `Above average for ${selectedRole}` :
                          percentile >= 40 ? `Average ${selectedRole} candidate profile` :
                          `Below average — focus on ${selectedRole} core skills`;

  // Top insight
  const topMissing     = bench?.missingCore?.slice(0, 2) || [];
  const insightBoost   = topMissing.length > 0 ? Math.min(topMissing.length * 12, 22) : 0;
  const insightNewPct  = Math.min(percentile + insightBoost, 97);

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div className="section-icon section-icon-purple">📈</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.05rem', color: '#f1f5f9', marginBottom: '0.15rem' }}>Skill Benchmark</h3>
          <p style={{ fontSize: '0.78rem', marginBottom: 0 }}>Your skills vs industry standard for a <strong style={{ color: 'var(--primary-light)' }}>{selectedRole}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ padding: '0.3rem 0.75rem', borderRadius: 100, background: `${percentileColor}15`, border: `1px solid ${percentileColor}35`, fontSize: '0.72rem', fontWeight: 600, color: percentileColor, flexShrink: 0 }}>
            {percentileLabel}
          </div>
          <CopilotTrigger
            message={`I scored ${percentile}% on the ${selectedRole} benchmark. I'm missing ${bench?.missingCore?.join(', ') || 'some core skills'}. How should I improve my weak areas?`}
            label="Ask Copilot"
            variant="ghost"
            icon="🤖"
          />
        </div>
      </div>

      {/* Role Selector */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.25rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border)' }}>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-4)', alignSelf: 'center', marginRight: '0.25rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role:</span>
        {ROLE_NAMES.map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            style={{
              padding: '0.22rem 0.65rem', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600,
              background: selectedRole === role ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
              color: selectedRole === role ? 'white' : 'var(--text-4)',
              transition: 'all 0.18s ease',
            }}
          >
            {roleData.icon && selectedRole === role ? `${roleData.icon} ` : ''}{role}
          </button>
        ))}
      </div>

      {/* Core score headline */}
      {bench && (
        <div style={{
          padding: '1rem 1.25rem', borderRadius: 10, marginBottom: '1.25rem',
          background: bench.coreMatch >= 70 ? 'rgba(16,185,129,0.08)' : bench.coreMatch >= 45 ? 'rgba(99,102,241,0.08)' : 'rgba(245,158,11,0.08)',
          border: `1px solid ${bench.coreMatch >= 70 ? 'rgba(16,185,129,0.25)' : bench.coreMatch >= 45 ? 'rgba(99,102,241,0.2)' : 'rgba(245,158,11,0.2)'}`,
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.4rem' }}>
            {bench.coreMatch >= 80 ? `🚀 You match ${bench.coreMatch}% of core ${selectedRole} skills — excellent!` :
             bench.coreMatch >= 60 ? `⭐ You match ${bench.coreMatch}% of core ${selectedRole} skills — solid foundation.` :
             bench.coreMatch >= 40 ? `📈 You match ${bench.coreMatch}% of core ${selectedRole} skills — keep building.` :
             `💡 You match ${bench.coreMatch}% of core ${selectedRole} skills — significant gaps to close.`}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Core Skills',      value: bench.coreMatch,      color: bench.coreMatch >= 70 ? 'var(--green)' : 'var(--yellow)' },
              { label: 'Supporting Skills', value: bench.secondaryMatch, color: 'var(--blue)' },
              { label: 'Overall Score',    value: percentile,            color: percentileColor },
            ].map((m, i) => (
              <div key={m.label} style={{ flex: 1, minWidth: '120px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-4)' }}>{m.label}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: m.color }}>{m.value}%</span>
                </div>
                <Bar value={m.value} color={m.color} delay={i * 100} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }} className="benchmark-top-grid">

        {/* Strong Skills */}
        <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.65rem' }}>
            ✔ Strong Skills ({bench?.strongSkills?.length || 0})
          </div>
          {bench?.coreMatched?.length > 0 && (
            <>
              <div style={{ fontSize: '0.63rem', color: 'var(--text-4)', fontWeight: 600, marginBottom: '0.3rem', textTransform: 'uppercase' }}>Core</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.6rem' }}>
                {bench.coreMatched.map(s => (
                  <span key={s} style={{ padding: '0.18rem 0.55rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#4ade80' }}>{s}</span>
                ))}
              </div>
            </>
          )}
          {bench?.secondaryMatched?.length > 0 && (
            <>
              <div style={{ fontSize: '0.63rem', color: 'var(--text-4)', fontWeight: 600, marginBottom: '0.3rem', textTransform: 'uppercase' }}>Supporting</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {bench.secondaryMatched.slice(0, 6).map(s => (
                  <span key={s} style={{ padding: '0.18rem 0.55rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 500, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', color: '#22d3ee' }}>{s}</span>
                ))}
              </div>
            </>
          )}
          {(!bench?.strongSkills?.length) && (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-4)', fontStyle: 'italic' }}>No matches yet — start building core skills.</div>
          )}
        </div>

        {/* Missing Core */}
        <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.65rem' }}>
            ❌ Missing Core Skills ({bench?.missingCore?.length || 0})
          </div>
          {bench?.missingCore?.length > 0 ? (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.6rem' }}>
                {bench.missingCore.map(s => (
                  <span key={s} style={{ padding: '0.18rem 0.55rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>{s}</span>
                ))}
              </div>
              {bench.missingSecondary?.length > 0 && (
                <>
                  <div style={{ fontSize: '0.63rem', color: 'var(--text-4)', fontWeight: 600, marginBottom: '0.3rem', textTransform: 'uppercase' }}>Nice to have</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {bench.missingSecondary.slice(0, 4).map(s => (
                      <span key={s} style={{ padding: '0.18rem 0.55rem', borderRadius: 100, fontSize: '0.68rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}>{s}</span>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={{ fontSize: '0.82rem', color: 'var(--green)', fontWeight: 600 }}>🎉 You have all core skills for this role!</div>
          )}
        </div>
      </div>

      {/* Category Heatmap */}
      <div style={{ padding: '1rem', background: 'rgba(15,23,45,0.5)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.85rem' }}>Skill Category Coverage</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {categoryData.map((cat, i) => (
            <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.85rem', width: 20, flexShrink: 0 }}>{cat.icon}</span>
              <div style={{ fontSize: '0.73rem', color: '#94a3b8', width: 95, flexShrink: 0 }}>{cat.label}</div>
              <div style={{ display: 'flex', gap: 3, flex: 1 }}>
                {Array.from({ length: Math.min(cat.total, 8) }, (_, j) => (
                  <div key={j} style={{ width: 8, height: 8, borderRadius: 2, background: j < cat.matched ? cat.color : 'rgba(255,255,255,0.07)', boxShadow: j < cat.matched ? `0 0 4px ${cat.color}66` : 'none', transition: 'background 0.5s ease' }} />
                ))}
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: cat.matched > 0 ? cat.color : '#334155', width: 30, textAlign: 'right', flexShrink: 0 }}>{cat.matched}/{Math.min(cat.total, 8)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Insight Banner */}
      {topMissing.length > 0 && (
        <div style={{ padding: '0.85rem 1.1rem', borderRadius: 10, background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>⚡ Key Insight</div>
          <div style={{ fontSize: '0.87rem', color: 'var(--text-1)', lineHeight: 1.5 }}>
            Learning <strong style={{ color: '#c4b5fd' }}>{topMissing.join(' and ')}</strong> will boost your <strong style={{ color: 'var(--primary-light)' }}>{selectedRole}</strong> benchmark score from{' '}
            <strong style={{ color: 'var(--yellow)', fontFamily: 'Space Grotesk, sans-serif' }}>{percentile}%</strong> →{' '}
            <strong style={{ color: 'var(--green)', fontFamily: 'Space Grotesk, sans-serif' }}>{insightNewPct}%</strong> significantly.
          </div>
        </div>
      )}

      <style>{`@media (max-width: 700px) { .benchmark-top-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
