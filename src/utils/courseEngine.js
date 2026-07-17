/**
 * courseEngine.js — v2
 * ---------------
 * Skill → Course mapping engine.
 * - Skill normalization map (aliases → canonical)
 * - Expanded fuzzy matching
 * - Fallback "learning path" for unmatched skills
 * - Priority tiers, deduplication, impact scoring.
 */

import { COURSE_DB } from './courseData';

// ── Skill Normalization Map ────────────────────────────────────────────────
// Maps broad/vague terms → concrete searchable keywords
const SKILL_ALIASES = {
  // ML / AI
  'machine learning':       ['machine learning', 'ml'],
  'ml':                     ['machine learning', 'ml'],
  'deep learning':          ['deep learning', 'tensorflow', 'pytorch'],
  'neural networks':        ['deep learning', 'neural network'],
  'artificial intelligence':['machine learning', 'deep learning', 'ai'],
  'ai':                     ['machine learning', 'deep learning'],
  'generative ai':          ['llm', 'generative ai'],
  'genai':                  ['llm', 'generative ai'],
  'prompt engineering':     ['llm', 'generative ai', 'prompt'],

  // Vision / NLP
  'computer vision':        ['computer vision', 'opencv', 'cnn'],
  'cv':                     ['computer vision', 'opencv'],
  'nlp':                    ['nlp', 'natural language processing'],
  'natural language processing': ['nlp', 'natural language processing', 'transformer'],
  'transformers':           ['nlp', 'transformer', 'hugging face'],
  'bert':                   ['nlp', 'transformer', 'bert'],
  'llm':                    ['llm', 'generative ai'],

  // Frameworks
  'tensorflow':             ['tensorflow', 'deep learning', 'keras'],
  'pytorch':                ['pytorch', 'deep learning'],
  'keras':                  ['tensorflow', 'keras', 'deep learning'],
  'scikit-learn':           ['machine learning', 'sklearn', 'scikit'],
  'sklearn':                ['machine learning', 'sklearn'],

  // Data Science
  'data science':           ['data science', 'python', 'sql'],
  'data analysis':          ['data science', 'pandas', 'sql'],
  'data analytics':         ['data science', 'analytics', 'sql'],
  'analytics':              ['data science', 'analytics', 'sql'],
  'pandas':                 ['pandas', 'data analysis'],
  'numpy':                  ['pandas', 'data analysis'],

  // Visualization
  'data visualization':     ['visualization', 'tableau', 'power bi', 'matplotlib'],
  'tableau':                ['visualization', 'tableau'],
  'power bi':               ['visualization', 'power bi'],
  'matplotlib':             ['pandas', 'visualization', 'matplotlib'],
  'seaborn':                ['pandas', 'visualization', 'seaborn'],

  // Cloud
  'cloud':                  ['aws', 'gcp', 'azure', 'cloud'],
  'cloud computing':        ['aws', 'gcp', 'azure', 'cloud'],
  'aws':                    ['aws', 'amazon web services', 'cloud'],
  'amazon web services':    ['aws', 'amazon web services'],
  'gcp':                    ['gcp', 'google cloud'],
  'google cloud':           ['gcp', 'google cloud', 'bigquery'],
  'azure':                  ['azure', 'microsoft azure'],
  'bigquery':               ['gcp', 'google cloud', 'bigquery'],

  // DevOps / Infra
  'devops':                 ['ci/cd', 'docker', 'kubernetes', 'devops'],
  'docker':                 ['docker', 'container'],
  'containers':             ['docker', 'container'],
  'kubernetes':             ['kubernetes', 'k8s'],
  'k8s':                    ['kubernetes', 'k8s'],
  'ci/cd':                  ['ci/cd', 'github actions', 'jenkins'],
  'mlops':                  ['mlops', 'ml pipeline'],
  'infrastructure':         ['docker', 'kubernetes', 'devops'],

  // Web Dev
  'react':                  ['react', 'frontend', 'reactjs'],
  'reactjs':                ['react', 'frontend'],
  'javascript':             ['javascript', 'js', 'node'],
  'typescript':             ['javascript', 'typescript'],
  'node':                   ['node', 'nodejs', 'backend api'],
  'nodejs':                 ['node', 'nodejs', 'express'],
  'express':                ['node', 'nodejs', 'express'],
  'frontend':               ['react', 'javascript', 'frontend'],
  'backend':                ['node', 'nodejs', 'backend api'],
  'fullstack':              ['react', 'node', 'javascript'],
  'full stack':             ['react', 'node', 'javascript'],

  // Databases
  'sql':                    ['sql', 'database', 'mysql', 'postgresql'],
  'mysql':                  ['sql', 'mysql', 'database'],
  'postgresql':             ['sql', 'postgresql', 'database'],
  'databases':              ['sql', 'database'],
  'nosql':                  ['sql', 'database'],
  'mongodb':                ['node', 'database'],

  // Python
  'python':                 ['python'],
  'flask':                  ['python'],
  'fastapi':                ['python'],
  'django':                 ['python'],

  // Statistics / Math
  'statistics':             ['statistics', 'probability', 'math'],
  'probability':            ['statistics', 'probability'],
  'linear algebra':         ['statistics', 'linear algebra', 'math'],
  'calculus':               ['statistics', 'calculus', 'math'],
  'mathematics':            ['statistics', 'math'],

  // Tools / Other
  'git':                    ['git', 'github'],
  'github':                 ['git', 'github'],
  'system design':          ['system design', 'scalability'],
  'api':                    ['node', 'backend api'],
  'rest api':               ['node', 'backend api'],
  'agile':                  ['system design'],
  'linux':                  ['devops', 'ci/cd'],
  'spark':                  ['data science', 'analytics'],
  'hadoop':                 ['data science', 'analytics'],
  'r':                      ['statistics', 'data science'],
  'research':               ['machine learning', 'data science'],
};

// Generic fallback learning paths for completely unmatched skills
const FALLBACK_PATHS = {
  default: {
    title: 'Search on Coursera',
    platform: 'Coursera', platformIcon: '🎓',
    duration: 'Self-paced', level: 'Beginner', free: false,
    impact: 'Medium', impactBoost: 6,
    description: 'Browse Coursera\'s catalog to find the best course for this specific skill.',
    getLinkForSkill: (skill) => `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`,
  },
  youtube: {
    title: 'Free Tutorial on YouTube',
    platform: 'freeCodeCamp', platformIcon: '🔥',
    duration: '4-8 hours', level: 'Beginner', free: true,
    impact: 'Medium', impactBoost: 5,
    description: 'freeCodeCamp and other educators offer free in-depth tutorials on most tech skills.',
    getLinkForSkill: (skill) => `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial')}`,
  },
};

/**
 * Normalize string for fuzzy comparison.
 */
function norm(s = '') { return s.toLowerCase().trim(); }

/**
 * expandSkill — resolves aliases into searchable keyword array.
 * Always returns an array of strings to try.
 */
function expandSkill(skill) {
  const key = norm(skill);
  // Direct alias lookup
  if (SKILL_ALIASES[key]) return SKILL_ALIASES[key];
  // Partial alias match (e.g. "deep learning framework" → deep learning)
  for (const [alias, expansions] of Object.entries(SKILL_ALIASES)) {
    if (key.includes(alias) || alias.includes(key)) return expansions;
  }
  // No alias found — return as-is (raw skill)
  return [key];
}

/**
 * getCoursesForSkills
 * -------------------
 * @param {string[]} missingSkills
 * @param {string[]} presentSkills
 * @param {object}   options
 * @returns {Array<CourseEntry & { matchedSkill: string, fallback?: boolean }>}
 */
export function getCoursesForSkills(
  missingSkills = [],
  presentSkills  = [],
  options = {}
) {
  const {
    maxPerSkill   = 2,
    maxTotal      = 12,
    beginnerFirst = true,
    includeFallback = true,
  } = options;

  const seen = new Set(); // dedup by course link
  const results = [];

  for (const skill of missingSkills) {
    if (results.length >= maxTotal) break;

    const expanded = expandSkill(skill);
    let countForSkill = 0;
    let foundAny = false;

    // Build search tokens: expanded aliases + original skill words
    const searchTokens = [...new Set([...expanded, ...norm(skill).split(/\s+/)])];

    const matched = COURSE_DB
      .filter(course => {
        if (seen.has(course.link)) return false;
        const normKeywords    = course.keywords.map(norm);
        const normCourseSkill = norm(course.skill);
        // Match against expanded tokens
        return searchTokens.some(token =>
          normKeywords.some(k => k.includes(token) || token.includes(k)) ||
          normCourseSkill.includes(token) ||
          token.includes(normCourseSkill)
        );
      })
      .sort((a, b) => {
        const impOrder = { High: 0, Medium: 1, Low: 2 };
        const impDiff = (impOrder[a.impact] || 1) - (impOrder[b.impact] || 1);
        if (impDiff !== 0) return impDiff;
        if (beginnerFirst) {
          const lvlOrder = { Beginner: 0, Intermediate: 1, Advanced: 2 };
          return (lvlOrder[a.level] || 1) - (lvlOrder[b.level] || 1);
        }
        return 0;
      });

    for (const course of matched) {
      if (countForSkill >= maxPerSkill) break;
      if (results.length >= maxTotal) break;
      seen.add(course.link);
      results.push({ ...course, matchedSkill: skill });
      countForSkill++;
      foundAny = true;
    }

    // ── Fallback: no course found for this skill ──
    if (!foundAny && includeFallback) {
      const fb = FALLBACK_PATHS.default;
      const fallbackLink = fb.getLinkForSkill(skill);
      if (!seen.has(fallbackLink)) {
        seen.add(fallbackLink);
        results.push({
          skill: skill,
          matchedSkill: skill,
          title: `Learn ${skill.charAt(0).toUpperCase() + skill.slice(1)}`,
          platform: fb.platform,
          platformIcon: fb.platformIcon,
          duration: fb.duration,
          level: fb.level,
          free: fb.free,
          link: fallbackLink,
          impact: fb.impact,
          impactBoost: fb.impactBoost,
          description: `Find the best ${skill} course — curated results on Coursera.`,
          fallback: true,
        });
      }
    }
  }

  return results;
}

/**
 * getTopCoursesForJob
 */
export function getTopCoursesForJob(job, presentSkills = [], max = 6) {
  if (!job) return [];
  const critical = job.missing_critical || [];
  const missing  = job.missing_skills  || [];
  const combined = [...new Set([...critical, ...missing])];
  return getCoursesForSkills(combined, presentSkills, { maxTotal: max, maxPerSkill: 1 });
}

/**
 * getCoursesForSkillName — single skill lookup (Roadmap inline).
 */
export function getCoursesForSkillName(skillName, max = 2) {
  return getCoursesForSkills([skillName], [], { maxTotal: max, maxPerSkill: max, includeFallback: true });
}

/**
 * calculateImpact
 */
export function calculateImpact(course, currentMatch = 65, skillRank = 0) {
  const positionMultiplier = skillRank === 0 ? 1.0 : skillRank === 1 ? 0.85 : 0.7;
  const boost = Math.round(course.impactBoost * positionMultiplier);
  const newMatch = Math.min(currentMatch + boost, 98);
  return { boost, newMatch };
}
