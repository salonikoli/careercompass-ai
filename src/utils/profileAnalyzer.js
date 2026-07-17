/**
 * profileAnalyzer.js
 * ------------------
 * Dynamic profile scoring engine for the LinkedIn Optimizer.
 * No external API calls — fully client-side computed from resume data.
 */

// ── Keyword banks ──────────────────────────────────────────────────────────
const CERT_KEYWORDS    = ['aws', 'azure', 'gcp', 'google', 'coursera', 'udemy', 'hackerrank', 'ibm', 'meta', 'microsoft', 'certified', 'certification', 'credential', 'bootcamp'];
const PROJECT_KEYWORDS = ['project', 'built', 'developed', 'created', 'deployed', 'implemented', 'designed', 'github', 'portfolio', 'kaggle', 'hackathon', 'open source'];
const GITHUB_KEYWORDS  = ['github', 'gitlab', 'bitbucket'];
const STRONG_SKILLS    = ['python', 'javascript', 'sql', 'machine learning', 'react', 'node', 'java', 'typescript', 'docker', 'kubernetes', 'tensorflow', 'pytorch'];

/**
 * Normalize text to lowercase for keyword matching.
 */
function norm(text = '') { return text.toLowerCase(); }

/**
 * Check if any of the keywords exist in a string.
 */
function hasAny(text, keywords) {
  const t = norm(text);
  return keywords.some(k => t.includes(k));
}

// ── Individual Scorers ─────────────────────────────────────────────────────

function scoreSkills(skills = []) {
  const s = skills.length;
  if (s >= 15) return { score: 20, note: `${s} skills detected — excellent depth.` };
  if (s >= 10) return { score: 16, note: `${s} skills detected — good foundation.` };
  if (s >= 6)  return { score: 11, note: `${s} skills detected — consider adding more.` };
  if (s >= 3)  return { score: 6,  note: `${s} skills detected — profile needs more skills.` };
  return          { score: 0,  note: 'Very few skills detected.' };
}

function scoreProjects(skills = [], hasLinkedIn = false) {
  // Infer project presence from skill count + common project-related skills
  const projectSignals = skills.filter(s => hasAny(s, ['github', 'portfolio', 'kaggle']));
  const techDepth = skills.length;

  if (projectSignals.length > 0 || techDepth >= 12) return { score: 20, note: 'Strong project signals detected in your profile.' };
  if (techDepth >= 8)  return { score: 14, note: 'Good skills breadth — add 1-2 featured projects to maximize impact.' };
  if (techDepth >= 5)  return { score: 8,  note: 'Add project links (GitHub/Kaggle) to significantly boost visibility.' };
  return                      { score: 4,  note: 'Projects are missing — this is the fastest way to improve your profile.' };
}

function scoreExperience(skills = [], bestFitScore = 0) {
  // Proxy: match score signals experience alignment
  if (bestFitScore >= 70) return { score: 20, note: 'Your experience aligns well with your target roles.' };
  if (bestFitScore >= 50) return { score: 15, note: 'Moderate experience alignment — highlight more relevant wins.' };
  if (bestFitScore >= 35) return { score: 10, note: 'Strengthen experience section with measurable outcomes.' };
  return                         { score: 5,  note: 'Experience section needs quantified achievements and role-specific keywords.' };
}

function scoreCertifications(skills = []) {
  const certSkills = skills.filter(s => hasAny(s, CERT_KEYWORDS));
  if (certSkills.length >= 3) return { score: 15, note: `${certSkills.length} certifications detected — great credibility signal.` };
  if (certSkills.length >= 1) return { score: 9,  note: `${certSkills.length} certification(s) found — add more for recruiter trust.` };
  return                              { score: 0,  note: 'No certifications detected. Add AWS, Google, or Coursera certs.' };
}

function scoreOnlinePresence(skills = [], hasLinkedIn = false) {
  const hasGitHub = skills.some(s => hasAny(s, GITHUB_KEYWORDS));
  let s = 0;
  const notes = [];
  if (hasLinkedIn) { s += 8; notes.push('LinkedIn URL provided.'); }
  if (hasGitHub)   { s += 7; notes.push('GitHub presence detected.'); }
  if (s === 0) notes.push('Add GitHub and ensure LinkedIn URL is filled in.');
  return { score: Math.min(s, 15), note: notes.join(' ') || 'No online presence detected.' };
}

function scoreHeadlineAbout(role = '', skills = []) {
  let s = 0;
  if (role)           { s += 5; }
  if (skills.length >= 5) { s += 5; }
  const note = s >= 8
    ? 'Good headline and About section signals.'
    : s >= 4
    ? 'Add role-specific keywords to your headline.'
    : 'Your headline and About section are missing key signals.';
  return { score: s, note };
}

// ── Main Compute Function ──────────────────────────────────────────────────

/**
 * computeProfileScore
 * @param {object} resumeData - { extracted_skills, best_fit_job, best_fit_job_score, top_3_matches, career_readiness_score }
 * @param {string} linkedInUrl - optional LinkedIn URL string
 * @returns {{ score, breakdown, missingItems, checklist, suggestions }}
 */
export function computeProfileScore(resumeData = {}, linkedInUrl = '') {
  const {
    extracted_skills    = [],
    best_fit_job        = '',
    best_fit_job_score  = 0,
    top_3_matches       = [],
    career_readiness_score = 0,
  } = resumeData;

  const hasLinkedIn = linkedInUrl.trim().length > 0;

  const skillsResult    = scoreSkills(extracted_skills);
  const projectsResult  = scoreProjects(extracted_skills, hasLinkedIn);
  const expResult       = scoreExperience(extracted_skills, best_fit_job_score);
  const certResult      = scoreCertifications(extracted_skills);
  const onlineResult    = scoreOnlinePresence(extracted_skills, hasLinkedIn);
  const headlineResult  = scoreHeadlineAbout(best_fit_job, extracted_skills);

  const breakdown = {
    skills:    { max: 20, score: skillsResult.score,   note: skillsResult.note,   label: 'Skills Depth' },
    projects:  { max: 20, score: projectsResult.score, note: projectsResult.note, label: 'Projects & Portfolio' },
    experience:{ max: 20, score: expResult.score,      note: expResult.note,      label: 'Experience Alignment' },
    certs:     { max: 15, score: certResult.score,     note: certResult.note,     label: 'Certifications' },
    online:    { max: 15, score: onlineResult.score,   note: onlineResult.note,   label: 'Online Presence' },
    headline:  { max: 10, score: headlineResult.score, note: headlineResult.note, label: 'Headline & About' },
  };

  const score = Object.values(breakdown).reduce((acc, b) => acc + b.score, 0);

  // ── Dynamic Checklist ──────────────────────────────────────────────────
  const hasCerts      = certResult.score > 0;
  const hasProjects   = projectsResult.score >= 14;
  const hasGitHub     = extracted_skills.some(s => hasAny(s, GITHUB_KEYWORDS));
  const hasRoleSkills = extracted_skills.length >= 8;

  const checklist = [
    {
      id: 'photo',
      label: 'Professional Photo',
      status: hasLinkedIn ? 'done' : 'warn',
      tips: 'Headshot with neutral background. 70% face fill.',
      impact: 'Medium',
    },
    {
      id: 'headline',
      label: 'Optimized Headline',
      status: best_fit_job && extracted_skills.length >= 3 ? 'done' : 'missing',
      tips: `Formula: ${best_fit_job || 'Your Role'} | Skill | Skill | Open to Opportunities`,
      impact: 'High',
    },
    {
      id: 'about',
      label: '300+ Word About Section',
      status: extracted_skills.length >= 6 ? 'warn' : 'missing',
      tips: 'Use the AI template below. Aim for 250-300 words with keywords.',
      impact: 'High',
    },
    {
      id: 'skills',
      label: 'Top 5 Pinned Skills',
      status: hasRoleSkills ? 'done' : 'warn',
      tips: 'Pin skills most relevant to your target role at the top.',
      impact: 'High',
    },
    {
      id: 'projects',
      label: 'Featured Projects',
      status: hasProjects ? 'done' : 'missing',
      tips: 'Add GitHub repo links or Kaggle notebooks as featured items.',
      impact: 'High',
    },
    {
      id: 'github',
      label: 'GitHub / Portfolio Link',
      status: hasGitHub ? 'done' : 'missing',
      tips: 'Add your GitHub profile URL in the Contact section.',
      impact: 'Medium',
    },
    {
      id: 'certs',
      label: 'Certifications',
      status: hasCerts ? 'done' : 'warn',
      tips: 'Add AWS, Google, Coursera, or HackerRank certifications.',
      impact: 'Medium',
    },
    {
      id: 'edu',
      label: 'Complete Education History',
      status: 'warn',
      tips: 'Include degree, institution, year, and relevant coursework.',
      impact: 'Low',
    },
    {
      id: 'banner',
      label: 'Custom Banner / Background',
      status: hasLinkedIn ? 'warn' : 'missing',
      tips: 'Add a professional banner related to your tech domain.',
      impact: 'Low',
    },
    {
      id: 'recs',
      label: '3+ Recommendations',
      status: 'missing',
      tips: 'Request recommendations from professors, managers, or peers.',
      impact: 'Medium',
    },
  ];

  // ── Missing Items ──────────────────────────────────────────────────────
  const missingItems = checklist.filter(c => c.status !== 'done').map(c => c.label);

  // ── Smart Suggestions ──────────────────────────────────────────────────
  const topJob          = top_3_matches[0];
  const missingCritical = topJob?.missing_critical || [];
  const topMissing      = missingCritical.slice(0, 3);

  const suggestions = [];

  if (!hasProjects)
    suggestions.push({ text: `Add 1 ${best_fit_job || 'technical'} project to your Featured section`, impact: 'High', boost: 10 });

  if (topMissing.length > 0)
    suggestions.push({ text: `Learn ${topMissing[0]} and list it under Skills`, impact: 'High', boost: 8 });

  if (!hasCerts)
    suggestions.push({ text: 'Complete 1 AWS or Google Cloud certification', impact: 'High', boost: 7 });

  if (!hasGitHub)
    suggestions.push({ text: 'Add your GitHub profile URL to Contact Info', impact: 'Medium', boost: 6 });

  if (!hasLinkedIn)
    suggestions.push({ text: 'Ensure your LinkedIn URL is customized (linkedin.com/in/yourname)', impact: 'Medium', boost: 5 });

  if (extracted_skills.length < 10)
    suggestions.push({ text: `Add ${10 - extracted_skills.length} more relevant skills to reach 10+ listed skills`, impact: 'Medium', boost: 4 });

  suggestions.push({ text: 'Request 3 recommendations from colleagues or professors', impact: 'Low', boost: 3 });

  // ── Next Steps (Top 3 High-Impact) ────────────────────────────────────
  const allGaps = [
    ...topMissing.map(s => ({ label: `Learn ${s}`, type: 'skill', impact: 'High', boost: 8 })),
    ...(!hasProjects ? [{ label: `Build 1 ${best_fit_job || 'technical'} project`, type: 'project', impact: 'High', boost: 10 }] : []),
    ...(!hasCerts    ? [{ label: 'Add AWS or Google certification', type: 'cert', impact: 'High', boost: 7 }] : []),
    ...(!hasGitHub   ? [{ label: 'Add GitHub to your LinkedIn profile', type: 'online', impact: 'Medium', boost: 5 }] : []),
  ];

  const nextSteps  = allGaps.slice(0, 3);
  const boostTotal = nextSteps.reduce((a, s) => a + s.boost, 0);
  const estimatedReadiness = Math.min(career_readiness_score + boostTotal, 98);

  return { score, breakdown, missingItems, checklist, suggestions, nextSteps, estimatedReadiness };
}
