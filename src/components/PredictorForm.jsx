import React, { useState } from 'react';
import { Activity, Zap, Volume2, Moon } from 'lucide-react';

export default function PredictorForm({ onAnalyze }) {
  const [formData, setFormData] = useState({
    taskName: '',
    complexity: 'Medium',
    energyLevel: 5,
    environment: 'Moderate',
    sleepHours: 7
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionSelect = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.taskName.trim()) {
      alert("Please enter a task name.");
      return;
    }
    onAnalyze(formData);
  };

  return (
    <div className="glass-panel animate-slide-up">
      <h2 className="text-gradient">Analyze Your Focus</h2>
      <p style={{ marginBottom: '2rem' }}>Input your current state to get your distraction prediction.</p>
      
      <form onSubmit={handleSubmit}>
        
        {/* Task Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="taskName">What are you working on?</label>
          <input 
            type="text" 
            id="taskName"
            name="taskName"
            className="form-input" 
            placeholder="e.g. Studying for Finals, Coding new feature..."
            value={formData.taskName}
            onChange={handleChange}
            required
            autoComplete="off"
          />
        </div>

        {/* Complexity Selection */}
        <div className="form-group animate-slide-up delay-100">
          <label className="form-label">Task Complexity <Activity className="inline-icon" size={16}/></label>
          <div className="options-grid">
            {['Low', 'Medium', 'High'].map(level => (
              <div 
                key={level}
                className={`option-card ${formData.complexity === level ? 'selected' : ''}`}
                onClick={() => handleOptionSelect('complexity', level)}
              >
                <span className="font-semibold">{level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Environment Noise */}
        <div className="form-group animate-slide-up delay-200">
          <label className="form-label">Environment <Volume2 className="inline-icon" size={16}/></label>
          <div className="options-grid">
            {['Quiet', 'Moderate', 'Noisy'].map(env => (
              <div 
                key={env}
                className={`option-card ${formData.environment === env ? 'selected' : ''}`}
                onClick={() => handleOptionSelect('environment', env)}
              >
                <span className="font-semibold">{env}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sleep Hours Slider */}
        <div className="form-group animate-slide-up delay-300">
          <label className="form-label flex justify-between">
            <span>Hours of Sleep Last Night <Moon className="inline-icon" size={16}/></span>
            <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>{formData.sleepHours}h</span>
          </label>
          <input 
            type="range" 
            name="sleepHours"
            min="2" max="12" step="0.5"
            value={formData.sleepHours} 
            onChange={handleChange}
            className="form-range" 
          />
        </div>

        {/* Energy Slider */}
        <div className="form-group animate-slide-up delay-300">
          <label className="form-label flex justify-between">
            <span>Current Energy Level <Zap className="inline-icon" size={16}/></span>
            <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>{formData.energyLevel}/10</span>
          </label>
          <input 
            type="range" 
            name="energyLevel"
            min="1" max="10" 
            value={formData.energyLevel} 
            onChange={handleChange}
            className="form-range" 
          />
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem'}}>
            <span>Exhausted</span>
            <span>Hyper</span>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{marginTop: '2rem'}}>
          <Zap size={20} /> Predict Distraction Risk
        </button>
      </form>
    </div>
  );
}
