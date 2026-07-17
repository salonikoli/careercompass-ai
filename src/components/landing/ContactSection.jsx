/**
 * ContactSection.jsx
 * CareerCompass AI — Redesigned Premium Contact & Feedback Component
 */
import React, { useState, useRef, useEffect } from 'react';

export default function ContactSection({ onGetStarted }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const INPUT_STYLE = {
    width: '100%', padding: '14px 18px',
    background: 'rgba(20, 184, 166, 0.03)',
    border: '1px solid rgba(20, 184, 166, 0.15)',
    borderRadius: '12px', color: '#f0fdfa',
    fontSize: '0.9rem', fontFamily: "'Inter', sans-serif",
    outline: 'none', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    boxSizing: 'border-box'
  };

  return (
    <section ref={ref} id="contact" style={{
      padding: '100px clamp(1rem, 5vw, 4rem)',
      background: 'linear-gradient(180deg, #020c16 0%, #061220 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.3), transparent)'
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Split Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }} className="contact-grid">
          
          {/* LEFT: Premium CTA Text Box */}
          <div style={{ textAlign: 'left' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '100px',
              background: 'rgba(20, 184, 166, 0.08)', border: '1px solid rgba(20, 184, 166, 0.25)',
              fontSize: '0.8rem', fontWeight: 600, color: '#2dd4bf',
              letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem'
            }}>
              📬 Get In Touch
            </div>

            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 800, color: '#f0fdfa',
              letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.5rem'
            }}>
              Ready to Upgrade <br />
              <span style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', display: 'inline-block'
              }}>
                Your Career Path?
              </span>
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '500px' }}>
              Have questions, custom pathway requests, or feedback about CareerCompass AI? Send us a message, or launch your free scan right away.
            </p>

            <button
              onClick={onGetStarted}
              style={{
                padding: '16px 36px', borderRadius: '100px', border: 'none',
                background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                color: '#fff', fontSize: '1rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: '0 8px 30px rgba(20, 184, 166, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                display: 'inline-flex', alignItems: 'center', gap: '8px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(20, 184, 166, 0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(20, 184, 166, 0.3)';
              }}
            >
              Start Free Assessment Now <span>→</span>
            </button>
          </div>

          {/* RIGHT: Frosted Contact Form */}
          <div style={{
            background: 'rgba(6, 18, 32, 0.75)',
            border: '1px solid rgba(20, 184, 166, 0.15)',
            borderRadius: '28px',
            padding: '2rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.03)'
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', animation: 'fadeInScale 0.35s ease forwards' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>✅</div>
                <h4 style={{ color: '#2dd4bf', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Message Transmitted</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>Thank you for reaching out. We will review your query and get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={INPUT_STYLE}
                    onFocus={e => { e.target.style.borderColor = '#14b8a6'; e.target.style.background = 'rgba(20, 184, 166, 0.06)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(20, 184, 166, 0.15)'; e.target.style.background = 'rgba(20, 184, 166, 0.03)'; }}
                  />
                </div>
                
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    style={INPUT_STYLE}
                    onFocus={e => { e.target.style.borderColor = '#14b8a6'; e.target.style.background = 'rgba(20, 184, 166, 0.06)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(20, 184, 166, 0.15)'; e.target.style.background = 'rgba(20, 184, 166, 0.03)'; }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Message</label>
                  <textarea
                    required
                    placeholder="Type your message here..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    rows={4}
                    style={{ ...INPUT_STYLE, resize: 'none', minHeight: '120px' }}
                    onFocus={e => { e.target.style.borderColor = '#14b8a6'; e.target.style.background = 'rgba(20, 184, 166, 0.06)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(20, 184, 166, 0.15)'; e.target.style.background = 'rgba(20, 184, 166, 0.03)'; }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '14px',
                    background: loading ? 'rgba(20, 184, 166, 0.4)' : 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                    border: 'none', borderRadius: '100px',
                    color: '#fff', fontSize: '0.95rem', fontWeight: 700,
                    cursor: loading ? 'wait' : 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 24px rgba(20, 184, 166, 0.35)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {loading ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
      
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 4rem !important;
          }
        }
      `}</style>
    </section>
  );
}
