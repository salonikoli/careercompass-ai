/**
 * UploadSection.jsx
 * -----------------
 * Drag-and-drop PDF resume upload zone with animated border.
 * Shows file name preview and triggers analysis on selection.
 */

import React, { useState, useRef, useCallback } from 'react';

export default function UploadSection({ onUpload, isLoading }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    setError('');
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported. Please select a .pdf file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Please upload a PDF under 10 MB.');
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleAnalyze = () => {
    if (selectedFile) onUpload(selectedFile);
  };

  const formatSize = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem' }}>

      {/* Hero heading */}
      <div className="text-center animate-slide-up" style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1rem', borderRadius: '100px', marginBottom: '1.5rem',
          background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)',
          fontSize: '0.85rem', color: 'var(--primary-light)',
        }}>
          🤖 AI-Driven Skill-to-Employment Mapping
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem', color: 'var(--text-main)' }}>
          Map Your Skills to{' '}
          <span className="text-gradient-primary">Real Employment</span>
        </h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '480px', margin: '0 auto' }}>
          Upload your resume to get instant AI-powered skill analysis, company-aligned job matches, career roadmap, and JD comparison.
        </p>
      </div>

      {/* Stats row */}
      <div className="animate-slide-up delay-100" style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem', marginBottom: '2rem',
      }}>
        {[
          { icon: '🏢', value: '15+', label: 'Job Roles' },
          { icon: '📚', value: '78+', label: 'Courses Mapped' },
          { icon: '⚡', value: '<5s', label: 'Analysis Time' },
        ].map((s, i) => (
          <div key={i} className="glass-card-flat" style={{ padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary-light)' }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Drop Zone */}
      <div
        className="animate-slide-up delay-200"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? 'var(--primary)' : selectedFile ? 'var(--success)' : 'var(--glass-border)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          cursor: selectedFile ? 'default' : 'pointer',
          transition: 'all 0.3s ease',
          background: isDragging
            ? 'rgba(99, 102, 241, 0.08)'
            : selectedFile
            ? 'rgba(16, 185, 129, 0.06)'
            : 'rgba(15, 23, 45, 0.4)',
          backdropFilter: 'blur(12px)',
          boxShadow: isDragging ? '0 0 0 4px var(--primary-glow)' : 'none',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleInputChange}
          style={{ display: 'none' }}
          id="resumeFileInput"
        />

        {selectedFile ? (
          /* File selected state */
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              {selectedFile.name}
            </div>
            <div style={{ color: 'var(--text-sub)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {formatSize(selectedFile.size)} · PDF Document
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setError(''); }}
              >
                🔄 Change File
              </button>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div>
            <div style={{
              width: '70px', height: '70px', margin: '0 auto 1.5rem',
              borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              transition: 'transform 0.3s ease',
              transform: isDragging ? 'scale(1.1)' : 'scale(1)',
            }}>
              📄
            </div>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              {isDragging ? 'Drop your resume here!' : 'Drag & drop your resume'}
            </div>
            <div style={{ color: 'var(--text-sub)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              or <span style={{ color: 'var(--primary-light)' }}>click to browse</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Supports PDF · Max 10 MB
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
          background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171', fontSize: '0.9rem',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Analyze Button */}
      {selectedFile && (
        <button
          className="btn btn-primary animate-scale-in"
          onClick={handleAnalyze}
          disabled={isLoading}
          style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.05rem' }}
        >
          {isLoading ? (
            <>
              <span style={{
                width: '18px', height: '18px', borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white',
                animation: 'spin 0.8s linear infinite', display: 'inline-block',
              }} />
              Analyzing Resume...
            </>
          ) : (
            <>🚀 Analyze My Career</>
          )}
        </button>
      )}

      {/* Feature list */}
      <div className="animate-slide-up delay-300" style={{ marginTop: '2.5rem' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem',
        }}>
          {[
            { icon: '🧠', text: 'AI Skill Extraction' },
            { icon: '🏢', text: 'Company-Aligned Job Matching' },
            { icon: '🎯', text: 'Skill Gap Analysis' },
            { icon: '📋', text: 'JD vs Resume Comparison' },
            { icon: '🗺️', text: 'Career Roadmap' },
            { icon: '📚', text: 'Course Recommendations' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
              fontSize: '0.88rem', color: 'var(--text-sub)',
            }}>
              <span style={{ fontSize: '1.1rem' }}>{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
