/**
 * CopilotContext.jsx
 * ------------------
 * Global AI Copilot state. Wraps the app to share:
 *  - userProfile (skills, readiness, top role, missing skills)
 *  - currentIntent + lastAction + conversationMemory
 *  - detectIntent(), triggerAction(), generateInsight()
 *
 * Navigation is handled by calling onNavigate(tabId) which is
 * registered from Dashboard.
 */

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

// ── Intent detection keywords ───────────────────────────────────────────────
const INTENT_MAP = [
  { intent: 'skill_gap',    tab: 'roadmap',   patterns: ['skill gap','missing skill','what to learn','learn next','improve skill','weak area','skill bench','benchmark'] },
  { intent: 'job_match',    tab: 'jobs',      patterns: ['job match','best job','job fit','which job','top role','job mapping','my matches'] },
  { intent: 'resume_help',  tab: 'audit',     patterns: ['resume','cv','rewrite','audit','fix my resume','improve resume','resume suggestion'] },
  { intent: 'ats',          tab: 'ats',       patterns: ['ats','applicant tracking','ats score','ats analyzer','keyword match'] },
  { intent: 'salary',       tab: 'salary',    patterns: ['salary','pay','compensation','earning','income','lpa','lakh','package','ctc'] },
  { intent: 'interview',    tab: 'interview', patterns: ['interview','question','practice','mock','prep','behavioral','technical round'] },
  { intent: 'courses',      tab: 'courses',   patterns: ['course','learn','tutorial','study','udemy','coursera','learning path'] },
  { intent: 'linkedin',     tab: 'linkedin',  patterns: ['linkedin','profile','optimize profile','headline','summary','about section'] },
  { intent: 'jd_match',     tab: 'jd',        patterns: ['job description','jd','paste jd','compare jd','match jd','specific job'] },
  { intent: 'roadmap',      tab: 'roadmap',   patterns: ['roadmap','career path','career plan','steps','milestones','90 day','plan'] },
  { intent: 'readiness',    tab: 'overview',  patterns: ['readiness','ready','career ready','how ready','percentage','score','how am i doing'] },
];

const CopilotContext = createContext(null);

export function CopilotProvider({ children }) {
  const [userProfile,    setUserProfile]    = useState(null);
  const [currentIntent,  setCurrentIntent]  = useState(null);
  const [lastAction,     setLastAction]     = useState(null);
  const [copilotOpen,    setCopilotOpen]    = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null); // message to inject into copilot

  // Navigation callback registered by Dashboard
  const navigateRef = useRef(null);

  const registerNavigate = useCallback((fn) => {
    navigateRef.current = fn;
  }, []);

  /** Set user's resume data into profile */
  const setProfile = useCallback((analysisData) => {
    if (!analysisData) return;
    setUserProfile({
      skills:        analysisData.extracted_skills || [],
      readiness:     analysisData.career_readiness_score || 0,
      topRole:       analysisData.best_fit_job || '',
      topRoleScore:  analysisData.best_fit_job_score || 0,
      missingSkills: analysisData.top_3_matches?.[0]?.missing_skills || [],
      topJob:        analysisData.top_3_matches?.[0] || null,
      atsScore:      analysisData.resume_audit?.ats_score || null,
    });
  }, []);

  /** Detect intent from natural language query */
  const detectIntent = useCallback((query) => {
    const q = query.toLowerCase();
    for (const { intent, tab, patterns } of INTENT_MAP) {
      if (patterns.some(p => q.includes(p))) {
        return { intent, tab };
      }
    }
    return null;
  }, []);

  /** Navigate the dashboard to a tab */
  const triggerAction = useCallback((tabId, label = '') => {
    if (navigateRef.current) {
      navigateRef.current(tabId);
      setLastAction({ tab: tabId, label, time: Date.now() });
    }
  }, []);

  /** Open the copilot panel with an optional preset message */
  const openCopilot = useCallback((presetMessage = null) => {
    setCopilotOpen(true);
    if (presetMessage) setPendingMessage(presetMessage);
  }, []);

  const closeCopilot = useCallback(() => {
    setCopilotOpen(false);
    setPendingMessage(null);
  }, []);

  /** Generate a unified career insight string from userProfile */
  const generateInsight = useCallback(() => {
    if (!userProfile) return 'Upload your resume to get personalized insights.';
    const { readiness, topRole, topRoleScore, missingSkills } = userProfile;
    const top2 = missingSkills.slice(0, 2);
    const potentialBoost = top2.length * 6 + 4;
    const potential = Math.min(readiness + potentialBoost, 97);
    if (top2.length > 0) {
      return `You are ${readiness}% ready for ${topRole}. Learn ${top2.join(' and ')} to reach ${potential}%.`;
    }
    return `You are ${readiness}% ready for ${topRole}. Keep building your portfolio to stand out!`;
  }, [userProfile]);

  return (
    <CopilotContext.Provider value={{
      userProfile, setProfile,
      currentIntent, setCurrentIntent,
      lastAction,
      copilotOpen, setCopilotOpen, pendingMessage, setPendingMessage,
      openCopilot, closeCopilot,
      detectIntent, triggerAction, generateInsight,
      registerNavigate,
    }}>
      {children}
    </CopilotContext.Provider>
  );
}

// Safe no-op default — prevents crashes when used outside provider
const SAFE_DEFAULT = {
  userProfile: null,
  setProfile: () => {},
  currentIntent: null,
  setCurrentIntent: () => {},
  lastAction: null,
  copilotOpen: false,
  setCopilotOpen: () => {},
  pendingMessage: null,
  setPendingMessage: () => {},
  openCopilot: () => {},
  closeCopilot: () => {},
  detectIntent: () => null,
  triggerAction: () => {},
  generateInsight: () => '',
  registerNavigate: () => {},
};

export function useCopilot() {
  const ctx = useContext(CopilotContext);
  return ctx || SAFE_DEFAULT;  // never throws — safe outside provider
}
