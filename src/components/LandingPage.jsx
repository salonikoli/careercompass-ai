/**
 * LandingPage.jsx
 * CareerCompass AI — Redesigned landing hub with floating glass capsule navbar
 */
import React, { useState, useEffect } from 'react';
import HeroSection              from './landing/HeroSection';
import UploadResumeSection      from './landing/UploadResumeSection';
import AboutSection             from './landing/AboutSection';
import FeaturesSection          from './landing/FeaturesSection';
import HowItWorksSection        from './landing/HowItWorksSection';
import DashboardPreviewSection  from './landing/DashboardPreviewSection';
import ServicesSection          from './landing/ServicesSection';
import FooterSection            from './landing/FooterSection';

const NAV_ITEMS = [
  { label: 'Upload',       href: '#upload' },
  { label: 'About',        href: '#about' },
  { label: 'Features',     href: '#features' },
  { label: 'Roadmap',      href: '#how-it-works' },
  { label: 'Services',     href: '#services' }
];

function FloatingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToUpload = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{
      position: 'fixed',
      top: scrolled ? '20px' : '0px',
      left: 0, right: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      padding: '0 clamp(1rem, 5vw, 4rem)',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <nav style={{
        width: '100%',
        maxWidth: scrolled ? '1000px' : '1280px',
        height: '64px',
        background: scrolled ? 'rgba(6, 18, 32, 0.85)' : 'rgba(2, 12, 22, 0.4)',
        border: scrolled ? '1px solid rgba(20, 184, 166, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: scrolled ? '100px' : '0 0 24px 24px',
        backdropFilter: 'blur(20px)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: scrolled ? '0 20px 40px rgba(0, 0, 0, 0.5)' : 'none'
      }}>
        {/* Brand Logo */}
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(20,184,166,0.3)'
          }}>🧭</div>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: '0.95rem',
            color: '#f0fdfa', letterSpacing: '-0.02em'
          }}>CareerCompass AI</span>
        </a>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="desktop-links">
          {NAV_ITEMS.map(item => (
            <a
              key={item.label}
              href={item.href}
              style={{
                padding: '6px 14px', borderRadius: '100px',
                fontSize: '0.82rem', fontWeight: 600,
                color: '#94a3b8', textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#2dd4bf';
                e.currentTarget.style.background = 'rgba(20,184,166,0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="desktop-cta">
          <button
            onClick={scrollToUpload}
            style={{
              padding: '8px 20px', borderRadius: '100px', border: 'none',
              background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
              color: '#fff', fontSize: '0.8rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxShadow: '0 4px 15px rgba(20,184,166,0.25)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(20,184,166,0.35)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(20,184,166,0.25)';
            }}
          >
            Scan Resume
          </button>
        </div>

        {/* Hamburger Mobile */}
        <button
          className="mobile-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none', width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)',
            color: '#14b8a6', fontSize: '1rem', cursor: 'pointer',
            alignItems: 'center', justifyContent: 'center'
          }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '75px', left: '16px', right: '16px',
          background: 'rgba(6, 18, 32, 0.96)',
          border: '1px solid rgba(20, 184, 166, 0.2)',
          borderRadius: '24px',
          padding: '20px',
          display: 'flex', flexDirection: 'column', gap: '8px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          animation: 'fadeInScale 0.25s ease forwards'
        }}>
          {NAV_ITEMS.map(item => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: '12px 16px', borderRadius: '100px',
                fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8',
                textDecoration: 'none', display: 'block'
              }}
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={scrollToUpload}
            style={{
              padding: '12px', borderRadius: '100px', border: 'none',
              background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
              color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Scan Resume
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 860px) {
          .desktop-links { display: none !important; }
          .desktop-cta { display: none !important; }
          .mobile-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

export default function LandingPage({ onUpload, onDemo, error }) {
  return (
    <div style={{ background: '#020c16', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Floating capsule navigation */}
      <FloatingNavbar />

      {/* Hero */}
      <HeroSection
        onGetStarted={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
        onAnalyzeResume={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
        onExploreCareers={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* Drag & drop upload section */}
      <UploadResumeSection onUpload={onUpload} />
      
      <AboutSection />
      
      <FeaturesSection />
      
      <HowItWorksSection />
      
      <DashboardPreviewSection />
      
      <ServicesSection />
      
      <FooterSection />

      {error && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          padding: '16px 24px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px', color: '#fca5a5',
          fontSize: '0.9rem', fontWeight: 600,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          maxWidth: '380px'
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
