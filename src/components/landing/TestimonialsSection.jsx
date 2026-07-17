/**
 * TestimonialsSection.jsx
 * Student testimonial cards with avatar initials and star ratings
 */
import React, { useRef, useState, useEffect } from 'react';

const TESTIMONIALS = [
  {
    name: 'Arjun Sharma',
    role: 'Placed at TCS Digital',
    college: 'NIT Trichy, CSE 2024',
    text: 'CareerCompass AI was a game-changer for my job search. The ATS analyzer helped me rewrite my resume from scratch. I went from 0 callbacks to 5 interviews in 2 weeks. The skill gap detection was incredibly accurate.',
    stars: 5,
    color: '#6366f1',
    initials: 'AS',
    tags: ['Resume Analysis', 'ATS Score'],
  },
  {
    name: 'Priya Nair',
    role: 'Data Science Intern at Flipkart',
    college: 'BITS Pilani, 2025',
    text: 'The learning roadmap feature is what set this apart for me. It told me exactly which Kaggle courses to take, which certifications matter, and in what order. I got my internship offer 3 months after following the roadmap.',
    stars: 5,
    color: '#8b5cf6',
    initials: 'PN',
    tags: ['Learning Roadmap', 'Internship Match'],
  },
  {
    name: 'Rahul Mehta',
    role: 'Software Engineer at Razorpay',
    college: 'IIT Bombay, 2024',
    text: 'The interview prep tool with Groq AI is insane — it generated actual interview questions from the companies I was targeting. The STAR framework guide helped me ace my behavioral rounds completely.',
    stars: 5,
    color: '#06b6d4',
    initials: 'RM',
    tags: ['Interview Prep', 'Groq AI'],
  },
  {
    name: 'Kavitha Reddy',
    role: 'ML Intern at Amazon',
    college: 'VIT Vellore, AI/ML 2025',
    text: 'I uploaded my resume and within 5 seconds knew exactly why I wasn\'t getting calls. The skill gap analysis showed I was missing Docker and Kubernetes. I upskilled in 3 weeks and landed an Amazon internship. Absolutely brilliant tool.',
    stars: 5,
    color: '#22c55e',
    initials: 'KR',
    tags: ['Skill Gap', 'Career Match'],
  },
  {
    name: 'Vikram Singh',
    role: 'Fresher → SDE at Wipro',
    college: 'SRM University, 2024',
    text: 'As a fresher with no connections, this platform was my mentor. The salary insights helped me negotiate confidently. I knew my market value before walking into the offer discussion. Negotiated 15% above initial offer!',
    stars: 5,
    color: '#f59e0b',
    initials: 'VS',
    tags: ['Salary Insights', 'Job Match'],
  },
  {
    name: 'Ananya Krishnan',
    role: 'Product Analyst at Swiggy',
    college: 'PSG Tech, 2025',
    text: 'The LinkedIn optimizer is something I didn\'t know I needed. It transformed my generic profile into one that gets recruiter messages weekly. Combined with resume analysis — this is the most complete career tool I\'ve used.',
    stars: 5,
    color: '#ec4899',
    initials: 'AK',
    tags: ['LinkedIn Optimizer', 'Profile Boost'],
  },
];

function StarRating({ stars }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < stars ? '#f59e0b' : '#1e293b', fontSize: '0.9rem' }}>★</span>
      ))}
    </div>
  );
}

function TestimonialCard({ t, index, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '1.75rem',
        background: hovered
          ? `linear-gradient(135deg, ${t.color}12, rgba(15,23,42,0.95))`
          : 'rgba(15,23,42,0.8)',
        border: `1px solid ${hovered ? t.color + '45' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '18px',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hovered ? `0 16px 36px ${t.color}18` : '0 4px 12px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(16px)',
        cursor: 'default',
        display: 'flex', flexDirection: 'column', gap: '1.1rem',
        opacity: visible ? 1 : 0,
        animation: visible ? `fadeSlideUp 0.5s ease ${index * 0.08}s both` : 'none',
      }}
    >
      {/* Quote mark */}
      <div style={{
        fontSize: '3rem', color: t.color + '40',
        fontFamily: 'Georgia, serif', lineHeight: 0.5,
        height: '1.5rem',
      }}>❝</div>

      {/* Text */}
      <p style={{
        fontSize: '0.88rem', color: '#94a3b8',
        lineHeight: 1.7, margin: 0, flex: 1,
      }}>{t.text}</p>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {t.tags.map(tag => (
          <span key={tag} style={{
            padding: '3px 9px', borderRadius: '100px',
            background: `${t.color}15`, color: t.color,
            fontSize: '0.68rem', fontWeight: 700,
            border: `1px solid ${t.color}30`,
          }}>{tag}</span>
        ))}
      </div>

      {/* Author */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Avatar */}
        <div style={{
          width: '42px', height: '42px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${t.color}, ${t.color}80)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem', fontWeight: 800, color: '#fff',
          fontFamily: "'Space Grotesk', sans-serif",
          flexShrink: 0,
          boxShadow: `0 4px 12px ${t.color}40`,
        }}>
          {t.initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.88rem' }}>{t.name}</div>
          <div style={{ fontSize: '0.75rem', color: t.color, fontWeight: 600 }}>{t.role}</div>
          <div style={{ fontSize: '0.72rem', color: '#475569' }}>{t.college}</div>
        </div>
        <StarRating stars={t.stars} />
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="testimonials" style={{
      padding: 'clamp(5rem, 9vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
      background: 'linear-gradient(180deg, #060d1f 0%, #030712 100%)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', borderRadius: '100px',
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
            fontSize: '0.75rem', fontWeight: 700, color: '#fcd34d',
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.25rem',
          }}>
            ⭐ Success Stories
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2rem, 4.5vw, 3rem)',
            fontWeight: 800, color: '#f8fafc',
            letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1rem',
          }}>
            Students Who{' '}
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Transformed</span>
            {' '}Their Careers
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto' }}>
            Real stories from students and freshers who landed their dream roles
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.25rem',
        }}>
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} visible={visible} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
