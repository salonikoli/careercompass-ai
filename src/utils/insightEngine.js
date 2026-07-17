/**
 * insightEngine.js
 * ----------------
 * Unified insight generator that combines:
 * - Job match %
 * - Missing skills
 * - ATS score
 * - Skill benchmark
 *
 * Produces structured insights consumed by CopilotPanel and Dashboard hero.
 */

// ── Skill impact weights ────────────────────────────────────────────────────
const SKILL_IMPACTS = {
  'deep learning':   8, 'machine learning': 7, 'aws': 6, 'docker': 5,
  'kubernetes':      5, 'tensorflow':       7, 'pytorch': 7, 'sql': 5,
  'python':          8, 'react':            6, 'nodejs': 5, 'typescript': 4,
  'spark':           5, 'mlops':            6, 'nlp': 6,   'statistics': 5,
  'system design':   6, 'algorithms':       5, 'ci/cd': 4, 'redis': 3,
};

function skillImpact(skill) {
  const s = skill.toLowerCase();
  for (const [key, val] of Object.entries(SKILL_IMPACTS)) {
    if (s.includes(key) || key.includes(s)) return val;
  }
  return 3; // default small impact
}

/**
 * generateCareerInsight
 * ---------------------
 * @param {object} params
 * @returns {{
 *   headline: string,
 *   subline: string,
 *   readiness: number,
 *   potential: number,
 *   topRole: string,
 *   nextSteps: Array<{label, impact, type}>,
 *   urgentActions: string[],
 *   actions: Array<{label, tab, icon}>,
 * }}
 */
export function generateCareerInsight({
  readiness     = 0,
  topRole       = 'your target role',
  topCompany    = null,
  missingSkills = [],
  atsScore      = null,
  matchScore    = 0,
  skills        = [],
}) {
  // Rank missing skills by impact
  const rankedMissing = [...missingSkills]
    .map(s => ({ skill: s, impact: skillImpact(s) }))
    .sort((a, b) => b.impact - a.impact);

  const top3 = rankedMissing.slice(0, 3);
  const totalBoost = top3.reduce((sum, s) => sum + s.impact, 0);
  const potential  = Math.min(readiness + Math.round(totalBoost * 0.6), 97);

  // Headline
  const headline   = topCompany
    ? `You are ${readiness}% ready for ${topRole} at ${topCompany}`
    : `You are ${readiness}% ready for ${topRole}`;

  // Subline
  const subline = top3.length > 0
    ? `Learn ${top3.slice(0,2).map(s => s.skill).join(' & ')} to reach ${potential}%`
    : readiness >= 80
    ? 'Excellent profile! Focus on projects and networking'
    : 'Keep building — you\'re on the right track!';

  // Next steps
  const nextSteps = [
    ...top3.map(s => ({
      label:  `Learn ${s.skill} (+${Math.round(s.impact * 0.6)}% readiness)`,
      impact: s.impact,
      type:   'skill',
      skill:  s.skill,
    })),
    atsScore !== null && atsScore < 70 && {
      label:  `Improve ATS score from ${atsScore}% (add missing keywords)`,
      impact: 5,
      type:   'resume',
    },
    readiness < 60 && {
      label:  'Build a portfolio project with your current stack',
      impact: 4,
      type:   'project',
    },
    readiness >= 60 && {
      label:  'Practice 3 mock interviews this week',
      impact: 3,
      type:   'interview',
    },
  ].filter(Boolean).slice(0, 5);

  // Urgent action prompts
  const urgentActions = [];
  if (atsScore !== null && atsScore < 60) urgentActions.push('Your ATS score is low — improve your resume now');
  if (missingSkills.length > 4)           urgentActions.push('You have significant skill gaps for this role');
  if (readiness < 50)                     urgentActions.push('Focus on core skills before applying');

  // CTA buttons for copilot panel
  const actions = [
    { label: 'View Roadmap',    tab: 'roadmap',   icon: '🗺' },
    { label: 'Start Learning',  tab: 'courses',   icon: '📚' },
    { label: 'View Jobs',       tab: 'jobs',      icon: '📊' },
    { label: 'Improve Resume',  tab: 'audit',     icon: '🧠' },
    { label: 'Practice Interview', tab: 'interview', icon: '🎤' },
  ];

  return { headline, subline, readiness, potential, topRole, nextSteps, urgentActions, actions, top3 };
}

/**
 * generateAutoSuggestion
 * ----------------------
 * Generates a smart auto-suggestion based on user's weakest area.
 */
export function generateAutoSuggestion({ readiness, atsScore, missingSkills, matchScore }) {
  if (atsScore !== null && atsScore < 60) {
    return { message: 'Your ATS score is low (${atsScore}%). Improve your resume?', tab: 'ats', cta: '📝 Fix Resume' };
  }
  if (matchScore < 50) {
    return { message: 'You match only ${matchScore}% for your target role. See your roadmap?', tab: 'roadmap', cta: '🗺 See Roadmap' };
  }
  if (missingSkills.length > 2) {
    return { message: 'You\'re missing ${missingSkills.length} key skills. Start learning?', tab: 'courses', cta: '📚 Start Learning' };
  }
  return null;
}
