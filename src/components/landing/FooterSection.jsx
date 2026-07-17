/**
 * FooterSection.jsx
 * CareerCompass AI — Redesigned Premium Footer
 */
import React from 'react';

const NAV_LINKS = [
  { label: 'Home',         href: '#hero' },
  { label: 'About',        href: '#about' },
  { label: 'Features',     href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Services',     href: '#services' }
];

export default function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: '#010810',
      borderTop: '1px solid rgba(20, 184, 166, 0.1)',
      padding: '80px clamp(1rem, 5vw, 4rem) 40px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr',
          gap: '4rem',
          marginBottom: '4rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          paddingBottom: '4rem'
        }} className="footer-layout">
          
          {/* Column 1: Brand details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem',
                boxShadow: '0 4px 20px rgba(20,184,166,0.3)'
              }}>🧭</div>
              <div>
                <h4 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800, fontSize: '1.15rem', color: '#f0fdfa',
                  lineHeight: 1.1
                }}>CareerCompass AI</h4>
                <span style={{ fontSize: '0.7rem', color: '#14b8a6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Pathway Locator</span>
              </div>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, maxWidth: '340px' }}>
              Secure and instant resume optimization platform analyzing tech skill alignments using advanced natural language processing.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h5 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem'
            }}>Navigation</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {NAV_LINKS.slice(0, 3).map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  style={{
                    fontSize: '0.9rem', color: '#64748b',
                    textDecoration: 'none', transition: 'color 0.2s ease',
                    width: 'fit-content'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#2dd4bf'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Resources Links */}
          <div>
            <h5 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem'
            }}>Platform</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {NAV_LINKS.slice(3).map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  style={{
                    fontSize: '0.9rem', color: '#64748b',
                    textDecoration: 'none', transition: 'color 0.2s ease',
                    width: 'fit-content'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#2dd4bf'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1.5rem'
        }} className="footer-bottom">
          
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            © {year} CareerCompass AI · All rights reserved
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              padding: '6px 16px', borderRadius: '100px',
              background: 'rgba(20, 184, 166, 0.05)',
              border: '1px solid rgba(20, 184, 166, 0.15)',
              color: '#2dd4bf', fontSize: '0.75rem', fontWeight: 600
            }}>
              🤖 Powered by Groq AI
            </span>
            <span style={{
              padding: '6px 16px', borderRadius: '100px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              color: '#64748b', fontSize: '0.75rem', fontWeight: 600
            }}>
              Free to Use
            </span>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-layout {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
        }
      `}</style>
    </footer>
  );
}
