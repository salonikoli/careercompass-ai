/**
 * UploadResumeSection.jsx
 * CareerCompass AI — Premium Drag-and-drop Upload Component
 */
import React, { useState, useRef, useCallback } from 'react';

export default function UploadResumeSection({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    setError('');
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported. Please select a valid .pdf file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10 MB limit.');
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile || isLoading) return;
    setIsLoading(true);
    try {
      await onUpload(selectedFile);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSize = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <section id="upload" style={{
      padding: '100px clamp(1rem, 5vw, 4rem)',
      background: 'linear-gradient(180deg, #020c16 0%, #061220 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background radial highlight */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw', height: '60vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1
      }} />

      <div style={{ maxWidth: '880px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(20,184,166,0.08)',
            border: '1px solid rgba(20,184,166,0.2)',
            fontSize: '0.8rem', fontWeight: 600, color: '#2dd4bf',
            letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.25rem'
          }}>
            ⚡ Try It Now — 100% Free
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800, color: '#f0fdfa',
            letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem'
          }}>
            Drop Your Resume & <br />
            <span style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', display: 'inline-block'
            }}>
              Discover Your Career Gaps
            </span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '540px', margin: '0 auto', lineHeight: 1.6 }}>
            Upload your PDF format resume. Our privacy-safe AI reviews it instantly in under 5 seconds.
          </p>
        </div>

        {/* Upload Bento Card */}
        <div style={{
          background: 'rgba(6, 18, 32, 0.75)',
          border: '1px solid rgba(20,184,166,0.15)',
          borderRadius: '28px',
          padding: 'clamp(1.5rem, 5vw, 3rem)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.03)'
        }}>
          
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !selectedFile && fileInputRef.current?.click()}
            style={{
              border: '2px dashed rgba(20, 184, 166, 0.25)',
              borderColor: isDragging ? '#14b8a6' : selectedFile ? '#22c55e' : 'rgba(20, 184, 166, 0.25)',
              borderRadius: '20px',
              padding: '80px 20px',
              textAlign: 'center',
              cursor: selectedFile ? 'default' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              background: isDragging
                ? 'rgba(20, 184, 166, 0.08)'
                : selectedFile
                ? 'rgba(34, 197, 94, 0.04)'
                : 'rgba(20, 184, 166, 0.02)',
              boxShadow: isDragging ? '0 0 24px rgba(20, 184, 166, 0.15)' : 'none'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={e => handleFile(e.target.files[0])}
              style={{ display: 'none' }}
              id="resumeFileInput"
            />

            {selectedFile ? (
              <div style={{ animation: 'fadeInScale 0.35s ease forwards' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>📄</div>
                <h4 style={{
                  fontWeight: 700, fontSize: '1.15rem',
                  color: '#f0fdfa', marginBottom: '0.5rem',
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}>
                  {selectedFile.name}
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Size: {formatSize(selectedFile.size)} · Ready to Scan
                </p>
                <button
                  onClick={e => { e.stopPropagation(); setSelectedFile(null); setError(''); }}
                  style={{
                    padding: '10px 24px', borderRadius: '100px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#ccfbf1', fontSize: '0.85rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#ef4444'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#ccfbf1'; }}
                >
                  Change File
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  width: '80px', height: '80px', margin: '0 auto 1.5rem',
                  borderRadius: '20px',
                  background: isDragging ? 'rgba(20, 184, 166, 0.15)' : 'rgba(20, 184, 166, 0.08)',
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                  display: 'flex', alignItems: 'center', justifyCenter: 'center',
                  fontSize: '2.2rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  transform: isDragging ? 'scale(1.15) rotate(5deg)' : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}>
                  🧭
                </div>
                <h4 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700, fontSize: '1.2rem',
                  color: isDragging ? '#2dd4bf' : '#f0fdfa',
                  marginBottom: '0.5rem'
                }}>
                  {isDragging ? 'Drop it here!' : 'Select PDF Resume'}
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                  Drag and drop your file or <span style={{ color: '#14b8a6', fontWeight: 600 }}>browse locally</span>
                </p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  fontSize: '0.75rem', color: '#475569',
                  padding: '6px 16px', borderRadius: '100px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}>
                  🔒 PDF only (Max 10MB)
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginTop: '1.5rem', padding: '12px 18px', borderRadius: '12px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              color: '#f87171', fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Analyze Button */}
          {selectedFile && (
            <button
              id="analyze-resume-btn"
              onClick={handleAnalyze}
              disabled={isLoading}
              style={{
                width: '100%', marginTop: '1.5rem',
                padding: '16px', borderRadius: '100px', border: 'none',
                background: isLoading
                  ? 'rgba(20, 184, 166, 0.4)'
                  : 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                color: '#fff',
                fontSize: '1.05rem', fontWeight: 700,
                cursor: isLoading ? 'wait' : 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: isLoading ? 'none' : '0 8px 30px rgba(20, 184, 166, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(20, 184, 166, 0.45)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = isLoading ? 'none' : '0 8px 30px rgba(20, 184, 166, 0.3)'; }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    animation: 'spin 0.7s linear infinite'
                  }} />
                  Analyzing resume data...
                </>
              ) : 'Scan Resume Now'}
            </button>
          )}

          {/* Feature Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem', marginTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '2rem'
          }}>
            {[
              { icon: '📊', title: 'ATS Compatibility Score' },
              { icon: '🎯', title: 'Target Job Compatibility' },
              { icon: '🔬', title: 'Detailed Skill Gaps' },
              { icon: '🗺️', title: 'Course Roadmaps' }
            ].map(item => (
              <div key={item.title} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                fontSize: '0.85rem', color: '#94a3b8'
              }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                {item.title}
              </div>
            ))}
          </div>

        </div>

        {/* Trust disclaimer */}
        <div style={{
          textAlign: 'center', marginTop: '1.5rem',
          fontSize: '0.8rem', color: '#475569'
        }}>
          🔒 GDPR compliant. Your file is scanned dynamically and never persisted on any database.
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}
