/**
 * roleIntelligence.js
 * -------------------
 * Shared role-detection + skill-weighting engine used by
 * JDMatcher and SkillBenchmark.
 */

// ── Role Benchmark Database ────────────────────────────────────────────────
export const ROLE_BENCHMARKS = {
  'Data Scientist': {
    icon: '📊',
    core:      ['python', 'machine learning', 'sql', 'statistics', 'pandas', 'scikit-learn', 'data analysis'],
    secondary: ['deep learning', 'tensorflow', 'pytorch', 'numpy', 'visualization', 'tableau', 'r', 'aws', 'spark'],
    optional:  ['docker', 'git', 'communication', 'agile', 'power bi', 'excel'],
    jdPatterns: ['data scientist', 'data science', 'ml engineer', 'machine learning', 'statistical model'],
  },
  'ML Engineer': {
    icon: '🤖',
    core:      ['python', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'mlops', 'docker'],
    secondary: ['kubernetes', 'aws', 'gcp', 'sql', 'statistics', 'scikit-learn', 'api', 'git'],
    optional:  ['spark', 'kafka', 'airflow', 'linux', 'ci/cd'],
    jdPatterns: ['ml engineer', 'machine learning engineer', 'ai engineer', 'deep learning engineer', 'model deployment'],
  },
  'AI Engineer': {
    icon: '🧠',
    core:      ['python', 'deep learning', 'nlp', 'tensorflow', 'pytorch', 'llm', 'transformers'],
    secondary: ['computer vision', 'hugging face', 'langchain', 'aws', 'docker', 'api', 'sql'],
    optional:  ['kubernetes', 'ci/cd', 'git', 'spark', 'mlops'],
    jdPatterns: ['ai engineer', 'artificial intelligence', 'generative ai', 'llm engineer', 'nlp engineer'],
  },
  'Data Analyst': {
    icon: '📈',
    core:      ['sql', 'python', 'excel', 'data analysis', 'statistics', 'tableau', 'power bi'],
    secondary: ['pandas', 'visualization', 'r', 'machine learning', 'numpy', 'google analytics'],
    optional:  ['git', 'communication', 'agile', 'spark', 'aws'],
    jdPatterns: ['data analyst', 'business analyst', 'analytics', 'reporting', 'bi analyst', 'data reporting'],
  },
  'Data Engineer': {
    icon: '⚙️',
    core:      ['python', 'sql', 'spark', 'hadoop', 'aws', 'data pipelines', 'kafka', 'airflow'],
    secondary: ['docker', 'kubernetes', 'gcp', 'azure', 'scala', 'postgresql', 'git', 'linux'],
    optional:  ['machine learning', 'terraform', 'ci/cd', 'dbt'],
    jdPatterns: ['data engineer', 'etl', 'pipeline', 'data infrastructure', 'data platform'],
  },
  'Web Developer': {
    icon: '🌐',
    core:      ['javascript', 'html', 'css', 'react', 'nodejs', 'git', 'rest api'],
    secondary: ['typescript', 'nextjs', 'mongodb', 'postgresql', 'docker', 'tailwind', 'graphql'],
    optional:  ['aws', 'redis', 'ci/cd', 'testing', 'agile'],
    jdPatterns: ['web developer', 'frontend', 'full stack', 'fullstack', 'react developer', 'javascript developer'],
  },
  'Backend Developer': {
    icon: '🧩',
    core:      ['python', 'nodejs', 'rest api', 'sql', 'docker', 'git', 'system design'],
    secondary: ['kubernetes', 'aws', 'redis', 'postgresql', 'mongodb', 'ci/cd', 'graphql', 'microservices'],
    optional:  ['kafka', 'terraform', 'linux', 'typescript', 'testing'],
    jdPatterns: ['backend developer', 'backend engineer', 'api developer', 'server-side', 'microservices'],
  },
  'Cloud Engineer': {
    icon: '☁️',
    core:      ['aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform', 'linux', 'ci/cd'],
    secondary: ['python', 'ansible', 'devops', 'monitoring', 'networking', 'security', 'git'],
    optional:  ['go', 'prometheus', 'grafana', 'helm', 'istio'],
    jdPatterns: ['cloud engineer', 'devops', 'infrastructure', 'site reliability', 'sre', 'platform engineer'],
  },
  'Software Engineer': {
    icon: '💻',
    core:      ['python', 'javascript', 'java', 'data structures', 'algorithms', 'git', 'system design'],
    secondary: ['sql', 'docker', 'rest api', 'testing', 'agile', 'linux', 'ci/cd'],
    optional:  ['aws', 'kubernetes', 'typescript', 'golang', 'security'],
    jdPatterns: ['software engineer', 'software developer', 'swe', 'programmer', 'engineer'],
  },
};

// ── Experience level detection ─────────────────────────────────────────────
const SENIOR_PATTERNS  = ['senior', 'lead', 'principal', 'staff', 'head of', 'director', '5+ years', '7+ years', '8+ years'];
const MID_PATTERNS     = ['mid', 'intermediate', 'experienced', '3+ years', '4+ years', '2-4 years', '3-5 years'];
const JUNIOR_PATTERNS  = ['junior', 'entry', 'early career', '0-2 years', '1-2 years', 'graduate', 'intern', 'trainee', 'fresher'];

export function detectExperienceLevel(jdText) {
  const t = jdText.toLowerCase();
  if (SENIOR_PATTERNS.some(p => t.includes(p)))  return 'Senior';
  if (MID_PATTERNS.some(p => t.includes(p)))      return 'Mid-level';
  if (JUNIOR_PATTERNS.some(p => t.includes(p)))   return 'Junior';
  return 'Intermediate'; // default
}

// ── Role detection from JD text ────────────────────────────────────────────
export function detectRole(jdText) {
  const t = jdText.toLowerCase();
  // Check in a specific order (most specific first)
  const ORDER = ['ML Engineer', 'AI Engineer', 'Data Scientist', 'Data Analyst',
                 'Data Engineer', 'Backend Developer', 'Cloud Engineer', 'Web Developer', 'Software Engineer'];
  for (const role of ORDER) {
    const bench = ROLE_BENCHMARKS[role];
    if (bench.jdPatterns.some(p => t.includes(p))) return role;
  }
  return null; // unknown role
}

// ── Skill classification for a detected role ───────────────────────────────
export function classifySkill(skill, roleName) {
  const bench = ROLE_BENCHMARKS[roleName];
  if (!bench) return { tier: 'optional', weight: 0.2 };
  const s = skill.toLowerCase();
  if (bench.core.some(c => s.includes(c) || c.includes(s)))      return { tier: 'core',      weight: 1.0 };
  if (bench.secondary.some(c => s.includes(c) || c.includes(s))) return { tier: 'secondary', weight: 0.5 };
  return                                                                  { tier: 'optional',  weight: 0.2 };
}

// ── Weighted JD match score ────────────────────────────────────────────────
/**
 * computeWeightedMatch
 * @param {string[]} jdSkills      — all skills extracted from JD
 * @param {string[]} resumeSkills  — user's skills
 * @param {string}   roleName      — detected role name (or null)
 * @returns {{ overall, coreMatch, secondaryMatch, coreSkills, missingCore, missingSecondary }}
 */
export function computeWeightedMatch(jdSkills, resumeSkills, roleName) {
  const resumeSet = new Set(resumeSkills.map(s => s.toLowerCase()));

  let totalWeight = 0;
  let earnedWeight = 0;
  const missingCore      = [];
  const missingSecondary = [];
  const matchedCore      = [];
  const matchedSecondary = [];

  for (const skill of jdSkills) {
    const { tier, weight } = classifySkill(skill, roleName || 'Software Engineer');
    totalWeight += weight;

    const norm = skill.toLowerCase();
    const present = [...resumeSet].some(r => r.includes(norm) || norm.includes(r));
    if (present) {
      earnedWeight += weight;
      if (tier === 'core')      matchedCore.push(skill);
      if (tier === 'secondary') matchedSecondary.push(skill);
    } else {
      if (tier === 'core')      missingCore.push(skill);
      if (tier === 'secondary') missingSecondary.push(skill);
    }
  }

  // Separate core-only stats
  const coreSkills   = jdSkills.filter(s => classifySkill(s, roleName || 'Software Engineer').tier === 'core');
  const coreMatched  = coreSkills.filter(s => {
    const n = s.toLowerCase();
    return [...resumeSet].some(r => r.includes(n) || n.includes(r));
  });

  const secSkills    = jdSkills.filter(s => classifySkill(s, roleName || 'Software Engineer').tier === 'secondary');
  const secMatched   = secSkills.filter(s => {
    const n = s.toLowerCase();
    return [...resumeSet].some(r => r.includes(n) || n.includes(r));
  });

  return {
    overall:         totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0,
    coreMatch:       coreSkills.length > 0 ? Math.round((coreMatched.length / coreSkills.length) * 100) : 0,
    secondaryMatch:  secSkills.length  > 0 ? Math.round((secMatched.length  / secSkills.length)  * 100) : 0,
    coreSkills,
    missingCore,
    missingSecondary,
    matchedCore,
    matchedSecondary,
  };
}

// ── Role benchmark comparison (for SkillBenchmark component) ──────────────
/**
 * benchmarkAgainstRole
 * @param {string[]} userSkills
 * @param {string}   roleName
 * @returns {{ coreMatch, secondaryMatch, missingCore, missingSecondary, strongSkills, bench }}
 */
export function benchmarkAgainstRole(userSkills, roleName) {
  const bench = ROLE_BENCHMARKS[roleName];
  if (!bench) return null;

  const userSet = new Set(userSkills.map(s => s.toLowerCase()));

  const matches = (skill) => [...userSet].some(u => u.includes(skill) || skill.includes(u));

  const coreMatched      = bench.core.filter(matches);
  const secondaryMatched = bench.secondary.filter(matches);
  const missingCore      = bench.core.filter(s => !matches(s));
  const missingSecondary = bench.secondary.filter(s => !matches(s));
  const strongSkills     = [...coreMatched, ...secondaryMatched];

  const coreMatch      = Math.round((coreMatched.length      / bench.core.length)      * 100);
  const secondaryMatch = Math.round((secondaryMatched.length / bench.secondary.length) * 100);

  return { coreMatch, secondaryMatch, missingCore, missingSecondary, strongSkills, bench, coreMatched, secondaryMatched };
}
