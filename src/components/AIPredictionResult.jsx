import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Info, RefreshCw, ChevronLeft } from 'lucide-react';
import { generateAIFeedback } from '../utils/predictionEngine';

export default function AIPredictionResult({ taskData, riskScore, onReset }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const feedback = generateAIFeedback(riskScore, taskData);

  // Animate the score counting up
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= riskScore) {
        setAnimatedScore(riskScore);
        clearInterval(interval);
      } else {
        setAnimatedScore(current);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [riskScore]);

  // Determine Icon based on risk
  let RiskIcon = Info;
  if (riskScore < 30) RiskIcon = CheckCircle;
  else if (riskScore > 65) RiskIcon = AlertTriangle;

  return (
    <div className="glass-panel animate-slide-up">
      <button 
        className="btn-secondary flex items-center gap-2 mb-4" 
        onClick={onReset}
        style={{ margin: '0 0 2rem 0', display: 'flex' }}
      >
        <ChevronLeft size={16} /> Edit Details
      </button>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="text-gradient">Prediction Complete</h2>
        <p>AI Analysis for "{taskData.taskName}"</p>
      </div>
      
      {/* Circular Progress (CSS driven) */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }} className="animate-slide-up delay-100">
        <div style={{ 
          position: 'relative', 
          width: '180px', 
          height: '180px', 
          borderRadius: '50%',
          background: `conic-gradient(var(${feedback.colorCode}) ${animatedScore}%, var(--glass-border) ${animatedScore}%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 30px var(${feedback.colorCode}40)` // hex 40 for transparency
        }}>
          {/* Inner circle for donut chart effect */}
          <div style={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            background: 'var(--bg-dark)',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '3rem', fontWeight: '700', color: `var(${feedback.colorCode})` }}>
              {animatedScore}%
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Risk Score</span>
          </div>
        </div>
      </div>

      <div className="animate-slide-up delay-200" style={{ 
        background: 'rgba(15, 23, 42, 0.4)', 
        borderRadius: '16px', 
        padding: '1.5rem',
        border: `1px solid var(${feedback.colorCode})`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <RiskIcon color={`var(${feedback.colorCode})`} size={24} />
          <h3 style={{ margin: 0 }}>{feedback.message}</h3>
        </div>
        
        <p style={{ color: 'var(--text-main)', marginBottom: '1.5rem' }}>
          {feedback.body}
        </p>
        
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '1rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            Recommended AI Actions:
          </h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {feedback.actions.map((action, i) => (
              <li key={i} style={{ 
                padding: '0.5rem 0', 
                borderBottom: i !== feedback.actions.length - 1 ? '1px solid var(--glass-border)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>•</span> {action}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
