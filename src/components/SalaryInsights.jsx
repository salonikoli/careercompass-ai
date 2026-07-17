/**
 * SalaryInsights.jsx — v6
 * Visual salary market data for all 25 job roles.
 * Entry/mid/senior salary bars, demand trend, top companies, remote-friendly flag.
 */

import React, { useState, useEffect, useRef } from 'react';
import { API_BASE } from '../utils/config';

// ---------------------------------------------------------------------------
// Static fallback salary data (subset of jobs.json — shown when backend is offline)
// ---------------------------------------------------------------------------
const STATIC_SALARY_DATA = [
  { id: 'ai_engineer',          title: 'AI Engineer',             icon: '🤖', experience_level: 'Advanced',     salary_entry: '$100k', salary_mid: '$160k', salary_senior: '$210k', demand: 'Extremely High', demand_trend: 'Rising',  remote_friendly: true,  top_companies: ['OpenAI','Microsoft','Google DeepMind','Anthropic'] },
  { id: 'ml_engineer',          title: 'Machine Learning Engineer',icon: '⚡', experience_level: 'Advanced',     salary_entry: '$90k',  salary_mid: '$145k', salary_senior: '$195k', demand: 'Extremely High', demand_trend: 'Rising',  remote_friendly: true,  top_companies: ['Amazon','Google','Microsoft','Tesla'] },
  { id: 'data_scientist',       title: 'Data Scientist',           icon: '🔬', experience_level: 'Intermediate', salary_entry: '$70k',  salary_mid: '$115k', salary_senior: '$155k', demand: 'Very High',     demand_trend: 'Rising',  remote_friendly: true,  top_companies: ['Google','Amazon','Meta','Netflix'] },
  { id: 'sre',                  title: 'Site Reliability Engineer', icon: '⚙️', experience_level: 'Advanced',    salary_entry: '$95k',  salary_mid: '$155k', salary_senior: '$205k', demand: 'Very High',     demand_trend: 'Rising',  remote_friendly: true,  top_companies: ['Google','Netflix','Cloudflare','Stripe'] },
  { id: 'cloud_architect',      title: 'Cloud Architect',           icon: '🏛️', experience_level: 'Advanced',    salary_entry: '$110k', salary_mid: '$170k', salary_senior: '$230k', demand: 'High',          demand_trend: 'Rising',  remote_friendly: true,  top_companies: ['Google','AWS','Microsoft','Deloitte'] },
  { id: 'devops_engineer',      title: 'DevOps Engineer',           icon: '🔄', experience_level: 'Intermediate', salary_entry: '$70k',  salary_mid: '$120k', salary_senior: '$170k', demand: 'Very High',     demand_trend: 'Rising',  remote_friendly: true,  top_companies: ['Accenture','ThoughtWorks','Atlassian','HashiCorp'] },
  { id: 'cloud_engineer',       title: 'Cloud Engineer',            icon: '☁️', experience_level: 'Intermediate', salary_entry: '$75k',  salary_mid: '$125k', salary_senior: '$175k', demand: 'High',          demand_trend: 'Rising',  remote_friendly: true,  top_companies: ['AWS','Azure','Google Cloud','Oracle Cloud'] },
  { id: 'blockchain_developer', title: 'Blockchain Developer',      icon: '⛓️', experience_level: 'Advanced',    salary_entry: '$88k',  salary_mid: '$150k', salary_senior: '$210k', demand: 'High',          demand_trend: 'Rising',  remote_friendly: true,  top_companies: ['Polygon','Coinbase','Binance','WazirX'] },
  { id: 'software_engineer',    title: 'Software Engineer',         icon: '💻', experience_level: 'Beginner',    salary_entry: '$70k',  salary_mid: '$115k', salary_senior: '$160k', demand: 'Very High',     demand_trend: 'Stable',  remote_friendly: true,  top_companies: ['Microsoft','Google','Apple','Amazon'] },
  { id: 'fullstack_developer',  title: 'Full Stack Developer',      icon: '🧱', experience_level: 'Intermediate', salary_entry: '$65k',  salary_mid: '$110k', salary_senior: '$160k', demand: 'Very High',     demand_trend: 'Stable',  remote_friendly: true,  top_companies: ['Wipro','Capgemini','IBM','EPAM'] },
  { id: 'backend_developer',    title: 'Backend Developer',         icon: '⚙️', experience_level: 'Intermediate', salary_entry: '$65k',  salary_mid: '$115k', salary_senior: '$165k', demand: 'Very High',     demand_trend: 'Stable',  remote_friendly: false, top_companies: ['TCS','Infosys','Wipro','HCL'] },
  { id: 'frontend_developer',   title: 'Frontend Developer',        icon: '🎨', experience_level: 'Beginner',    salary_entry: '$60k',  salary_mid: '$100k', salary_senior: '$150k', demand: 'High',          demand_trend: 'Stable',  remote_friendly: true,  top_companies: ['Zoho','Freshworks','Razorpay','Swiggy'] },
  { id: 'data_engineer',        title: 'Data Engineer',             icon: '🔧', experience_level: 'Intermediate', salary_entry: '$75k',  salary_mid: '$125k', salary_senior: '$175k', demand: 'Very High',     demand_trend: 'Rising',  remote_friendly: true,  top_companies: ['Flipkart','Razorpay','Juspay'] },
  { id: 'cybersecurity_analyst',title: 'Cybersecurity Analyst',     icon: '🔐', experience_level: 'Intermediate', salary_entry: '$68k',  salary_mid: '$120k', salary_senior: '$170k', demand: 'Very High',     demand_trend: 'Rising',  remote_friendly: true,  top_companies: ['CrowdStrike','Palo Alto Networks','Cisco'] },
  { id: 'data_analyst',         title: 'Data Analyst',              icon: '📊', experience_level: 'Beginner',    salary_entry: '$50k',  salary_mid: '$80k',  salary_senior: '$115k', demand: 'High',          demand_trend: 'Stable',  remote_friendly: true,  top_companies: ['Infosys','Deloitte','Accenture'] },
  { id: 'product_manager',      title: 'Product Manager',           icon: '📋', experience_level: 'Intermediate', salary_entry: '$80k',  salary_mid: '$135k', salary_senior: '$195k', demand: 'High',          demand_trend: 'Stable',  remote_friendly: false, top_companies: ['Flipkart','Swiggy','Paytm','OYO'] },
  { id: 'mobile_developer',     title: 'Mobile App Developer',      icon: '📱', experience_level: 'Intermediate', salary_entry: '$65k',  salary_mid: '$110k', salary_senior: '$155k', demand: 'High',          demand_trend: 'Stable',  remote_friendly: true,  top_companies: ['Zoho','Paytm','PhonePe','CRED'] },
  { id: 'uiux_designer',        title: 'UI/UX Designer',            icon: '🎭', experience_level: 'Beginner',    salary_entry: '$50k',  salary_mid: '$90k',  salary_senior: '$140k', demand: 'High',          demand_trend: 'Rising',  remote_friendly: true,  top_companies: ['Zoho','Freshworks','ShareChat','Dream11'] },
  { id: 'qa_engineer',          title: 'QA / Test Engineer',        icon: '🧪', experience_level: 'Beginner',    salary_entry: '$45k',  salary_mid: '$80k',  salary_senior: '$120k', demand: 'High',          demand_trend: 'Stable',  remote_friendly: true,  top_companies: ['Infosys','Wipro','TCS','Capgemini'] },
  { id: 'web_developer',        title: 'Web Developer',             icon: '🌐', experience_level: 'Beginner',    salary_entry: '$55k',  salary_mid: '$95k',  salary_senior: '$140k', demand: 'High',          demand_trend: 'Stable',  remote_friendly: true,  top_companies: ['TCS','Infosys','Cognizant','Hexaware'] },
  { id: 'business_analyst',     title: 'Business Analyst',          icon: '📈', experience_level: 'Intermediate', salary_entry: '$55k',  salary_mid: '$95k',  salary_senior: '$140k', demand: 'High',          demand_trend: 'Stable',  remote_friendly: false, top_companies: ['Accenture','Deloitte','McKinsey','EY'] },
  { id: 'database_administrator',title:'Database Administrator',    icon: '🗄️', experience_level: 'Intermediate', salary_entry: '$60k',  salary_mid: '$100k', salary_senior: '$140k', demand: 'Stable',        demand_trend: 'Stable',  remote_friendly: false, top_companies: ['Oracle','SAP','IBM','TCS'] },
  { id: 'network_engineer',     title: 'Network Engineer',          icon: '🌐', experience_level: 'Intermediate', salary_entry: '$55k',  salary_mid: '$95k',  salary_senior: '$140k', demand: 'Stable',        demand_trend: 'Stable',  remote_friendly: false, top_companies: ['Cisco','Juniper','Arista Networks'] },
  { id: 'embedded_engineer',    title: 'Embedded Systems Engineer', icon: '🔌', experience_level: 'Advanced',    salary_entry: '$65k',  salary_mid: '$115k', salary_senior: '$165k', demand: 'High',          demand_trend: 'Rising',  remote_friendly: false, top_companies: ['Qualcomm','Intel','Texas Instruments'] },
  { id: 'technical_writer',     title: 'Technical Writer',          icon: '✍️', experience_level: 'Beginner',    salary_entry: '$48k',  salary_mid: '$80k',  salary_senior: '$120k', demand: 'Stable',        demand_trend: 'Stable',  remote_friendly: true,  top_companies: ['Atlassian','Stripe','Twilio','Postman'] },
];

const USD_TO_INR = 83;


// Parse "$90k" → number (USD thousands)
function parseSalary(str) {
  if (!str || str === 'N/A') return 0;
  const match = str.match(/\$?(\d+)k?/i);
  return match ? parseInt(match[1]) : 0;
}

// Format INR with lakh/crore notation
function toINR(usdK) {
  const inr = usdK * USD_TO_INR * 1000;
  if (inr >= 10_000_000) return `₹${(inr / 10_000_000).toFixed(1)}Cr`;
  if (inr >= 100_000)   return `₹${(inr / 100_000).toFixed(1)}L`;
  return `₹${(inr / 1000).toFixed(0)}K`;
}

// Format salary according to selected currency mode
function formatSalary(usdK, mode) {
  if (!usdK) return 'N/A';
  const usdStr = `$${usdK}k`;
  const inrStr = toINR(usdK);
  if (mode === 'USD')  return usdStr;
  if (mode === 'INR')  return inrStr;
  return `${usdStr} (${inrStr})`;
}

function Bar({ value, max, color, delay = 0 }) {
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
    <div ref={ref} style={{ height: 5, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', flex: 1 }}>
      <div style={{
        height: '100%', width: `${w}%`, background: color, borderRadius: 100,
        transition: `width 1s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
        boxShadow: `0 0 6px ${color}55`,
      }} />
    </div>
  );
}

const DEMAND_CONFIG = {
  'Extremely High': { color: 'var(--green)',   icon: '↑↑', label: 'Extremely High' },
  'Very High':      { color: 'var(--green)',   icon: '↑',  label: 'Very High' },
  'High':           { color: 'var(--blue)',    icon: '↗',  label: 'High' },
  'Stable':         { color: 'var(--text-3)',  icon: '→',  label: 'Stable' },
  'Declining':      { color: 'var(--red)',     icon: '↓',  label: 'Declining' },
};

const TREND_CONFIG = {
  'Rising':  { color: 'var(--green)',   icon: '↑' },
  'Stable':  { color: 'var(--text-3)',  icon: '→' },
  'Declining': { color: 'var(--red)',   icon: '↓' },
};

export default function SalaryInsights({ extractedSkills = [], bestFitJobId }) {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort]       = useState('senior');
  const [filter, setFilter]   = useState('All');
  const [selected, setSelected] = useState(null);
  const [currency, setCurrency] = useState('BOTH');  // USD | INR | BOTH

  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000); // 5s timeout

    fetch(`${API_BASE}/salary-insights`, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => {
        if (!cancelled) {
          setSalaryData(d.salary_data?.length ? d.salary_data : STATIC_SALARY_DATA);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSalaryData(STATIC_SALARY_DATA);
          setUsingFallback(true);
          setLoading(false);
        }
      })
      .finally(() => clearTimeout(timer));

    return () => { cancelled = true; controller.abort(); };
  }, []);

  const maxSalary = 230;

  const sorted = [...salaryData]
    .filter(j => {
      if (filter === 'Remote') return j.remote_friendly;
      if (filter === 'All') return true;
      return j.experience_level === filter;
    })
    .sort((a, b) => {
      if (sort === 'senior') return parseSalary(b.salary_senior) - parseSalary(a.salary_senior);
      if (sort === 'entry')  return parseSalary(b.salary_entry) - parseSalary(a.salary_entry);
      if (sort === 'demand') {
        const order = ['Extremely High','Very High','High','Stable','Declining'];
        return order.indexOf(a.demand) - order.indexOf(b.demand);
      }
      return a.title.localeCompare(b.title);
    });

  const selectedJob = selected ? salaryData.find(j => j.id === selected) : null;

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-3)' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(249,115,22,0.2)', borderTop: '3px solid var(--primary)', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
      Loading salary data…
    </div>
  );

  return (
    <div className="animate-fade-in">
      {usingFallback && (
        <div style={{ marginBottom: '1rem', padding: '0.65rem 1rem', borderRadius: 10, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', fontSize: '0.78rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ⚠️ Showing cached salary data — live backend not available. Data is accurate as of 2024.
        </div>
      )}
      <div className="page-header">
        <h2 className="page-title">Salary & Market Insights</h2>
        <p className="page-subtitle">Entry, mid, and senior salary ranges across all 25 tech job roles</p>
      </div>

      {/* Your best fit highlight */}
      {bestFitJobId && (() => {
        const bj = salaryData.find(j => j.id === bestFitJobId);
        if (!bj) return null;
        return (
          <div style={{
            marginBottom: '1.5rem', padding: '1rem 1.25rem',
            background: 'var(--primary-subtle)',
            border: '1px solid rgba(249,115,22,0.25)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
          }}>
            <div style={{ fontSize: '1.5rem' }}>{bj.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.2rem' }}>Your Best-Fit Role</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)' }}>{bj.title}</div>
            </div>
            {[
              { label: 'Entry', value: bj.salary_entry },
              { label: 'Mid',   value: bj.salary_mid },
              { label: 'Senior',value: bj.salary_senior },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)' }}>
                  {formatSalary(parseSalary(s.value), currency)}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            ))}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: DEMAND_CONFIG[bj.demand]?.color || 'var(--text-2)' }}>
                {DEMAND_CONFIG[bj.demand]?.icon} {bj.demand}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-4)' }}>Demand</div>
            </div>
          </div>
        );
      })()}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-4)' }}>Filter:</span>
        {['All', 'Remote', 'Beginner', 'Intermediate', 'Advanced'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(f)}>{f === 'Remote' ? '🏠 Remote' : f}</button>
        ))}

        {/* Currency toggle */}
        <div style={{ display: 'flex', gap: '0.25rem', marginLeft: '0.35rem', padding: '0.2rem', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid var(--border)' }}>
          {['USD', 'INR', 'BOTH'].map(c => (
            <button key={c} onClick={() => setCurrency(c)}
              style={{ padding: '0.2rem 0.55rem', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, transition: 'all 0.15s ease',
                background: currency === c ? 'var(--primary)' : 'transparent',
                color: currency === c ? 'white' : 'var(--text-4)',
              }}>{c === 'USD' ? '$ USD' : c === 'INR' ? '₹ INR' : '$ + ₹'}</button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-4)' }}>Sort:</span>
          {[['senior','Senior $'],['entry','Entry $'],['demand','Demand'],['alpha','A–Z']].map(([val,lbl]) => (
            <button key={val} className={`btn btn-sm ${sort === val ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSort(val)}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* Salary Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
          gap: '0.5rem', padding: '0.65rem 1rem',
          background: 'rgba(255,255,255,0.025)',
          borderBottom: '1px solid var(--border)',
          fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.06em', color: 'var(--text-4)',
        }}>
          <span>Role</span>
          <span>Entry</span>
          <span>Mid-Level</span>
          <span>Senior</span>
          <span>Demand</span>
          <span>Remote</span>
        </div>

        {sorted.map((job, i) => {
          const isSelected = selected === job.id;
          const isBestFit = job.id === bestFitJobId;
          return (
            <div key={job.id}>
              <div
                onClick={() => setSelected(isSelected ? null : job.id)}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
                  gap: '0.5rem', padding: '0.75rem 1rem',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer', transition: 'var(--transition)',
                  background: isSelected ? 'var(--primary-subtle)' : isBestFit ? 'rgba(59,130,246,0.04)' : 'transparent',
                  borderLeft: isBestFit ? '3px solid var(--blue)' : isSelected ? '3px solid var(--primary)' : '3px solid transparent',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isBestFit ? 'rgba(59,130,246,0.04)' : 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem' }}>{job.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-1)' }}>{job.title}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-4)' }}>{job.experience_level}</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>{formatSalary(parseSalary(job.salary_entry), currency)}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--blue)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>{formatSalary(parseSalary(job.salary_mid), currency)}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center' }}>{formatSalary(parseSalary(job.salary_senior), currency)}</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 600,
                    color: DEMAND_CONFIG[job.demand]?.color || 'var(--text-2)',
                  }}>
                    {DEMAND_CONFIG[job.demand]?.icon} {job.demand}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className={`badge ${job.remote_friendly ? 'badge-success' : 'badge-danger'}`}>
                    {job.remote_friendly ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
              </div>

              {/* Expanded detail */}
              {isSelected && job && (
                <div style={{
                  padding: '1rem 1.25rem',
                  background: 'rgba(249,115,22,0.04)',
                  borderBottom: '1px solid var(--border)',
                  animation: 'slideUp 0.3s ease forwards',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {/* Salary bars */}
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.75rem' }}>Salary Ladder</div>
                      {[
                        { label: 'Entry Level', value: parseSalary(job.salary_entry), color: 'var(--green)' },
                        { label: 'Mid-Level',   value: parseSalary(job.salary_mid),   color: 'var(--blue)' },
                        { label: 'Senior',      value: parseSalary(job.salary_senior), color: 'var(--primary)' },
                      ].map((row, ri) => (
                        <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', width: 80, flexShrink: 0 }}>{row.label}</span>
                          <Bar value={row.value} max={maxSalary} color={row.color} delay={ri * 100} />
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: row.color, width: 110, textAlign: 'right', flexShrink: 0 }}>
                            {formatSalary(row.value, currency)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Companies + meta */}
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.75rem' }}>Top Hiring Companies</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
                        {(job.top_companies || []).map(c => (
                          <span key={c} className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{c}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div className="badge badge-orange">
                          {TREND_CONFIG[job.demand_trend]?.icon} {job.demand_trend} trend
                        </div>
                        {job.remote_friendly && <div className="badge badge-success">🏠 Remote OK</div>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'var(--text-4)', textAlign: 'center' }}>
        * Salary data in USD/year. 1 USD ≈ ₹{USD_TO_INR}. INR figures are indicative — use BOTH mode to compare. Click any row for details.
      </div>
    </div>
  );
}
