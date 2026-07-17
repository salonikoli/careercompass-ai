/**
 * api.js — v7
 * API helper functions for communicating with the FastAPI backend.
 * Uses centralized API_BASE from config.js — never hardcode localhost.
 *
 * In local dev: requests go through Vite proxy /api/* → http://localhost:8000
 * In production: requests go directly to VITE_API_URL (deployed Render backend)
 */

import { API_BASE } from './config';

/**
 * Upload a PDF resume and receive full career analysis.
 */
export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `Server error: ${response.status}`);
  }
  return response.json();
}

/**
 * Send a message to the career chatbot (Groq AI).
 */
export async function sendChatMessage(message, conversationHistory = [], context = null) {
  const response = await fetch(`${API_BASE}/ai-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversation_history: conversationHistory, context }),
  });
  if (!response.ok) throw new Error(`Chat error: ${response.status}`);
  const data = await response.json();
  return data.response;
}

/**
 * Health check — ping backend.
 */
export async function checkHealth() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000); // 4s timeout
    const response = await fetch(`${API_BASE}/health`, { signal: controller.signal });
    clearTimeout(timer);
    return response.ok;
  } catch { return false; }
}

/**
 * Match a pasted job description against the user's resume skills.
 */
export async function matchJD(jdText, resumeSkills) {
  const response = await fetch(`${API_BASE}/match-jd`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jd_text: jdText, resume_skills: resumeSkills }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `Server error: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetch interview prep questions for a job role.
 */
export async function getInterviewQuestions(jobId, jobTitle, extractedSkills = [], missingSkills = [], generateAI = false) {
  const response = await fetch(`${API_BASE}/interview-prep`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      job_id: jobId,
      job_title: jobTitle,
      extracted_skills: extractedSkills,
      missing_skills: missingSkills,
      generate_ai: generateAI,
    }),
  });
  if (!response.ok) throw new Error(`Interview prep error: ${response.status}`);
  return response.json();
}

/**
 * Fetch salary & market insights for all roles.
 */
export async function getSalaryInsights() {
  const response = await fetch(`${API_BASE}/salary-insights`);
  if (!response.ok) throw new Error(`Salary insights error: ${response.status}`);
  return response.json();
}

/**
 * Optimize LinkedIn profile via backend Groq analysis.
 */
export async function optimizeLinkedIn(url, resumeSkills, jobRole) {
  const response = await fetch(`${API_BASE}/linkedin-optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, resume_skills: resumeSkills, job_role: jobRole }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'LinkedIn optimize failed' }));
    throw new Error(err.detail || `LinkedIn optimize error: ${response.status}`);
  }
  return response.json();
}
