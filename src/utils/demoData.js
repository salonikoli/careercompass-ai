/**
 * demoData.js
 * -----------
 * Full demo payload that matches the exact shape the backend returns.
 * Used when user clicks "✨ View Demo Dashboard" on the landing page.
 */

export const DEMO_DATA = {
  career_readiness_score: 82,
  best_fit_job: "Senior Machine Learning Engineer",
  best_fit_job_score: 88,

  extracted_skills: [
    "Python", "PyTorch", "TensorFlow", "SQL", "Docker",
    "AWS", "Machine Learning", "Data Engineering", "Git", "Bash"
  ],

  job_matches: [
    {
      id: "sr-ml-eng",
      icon: "🤖",
      title: "Senior Machine Learning Engineer",
      company_name: "Google DeepMind",
      match_percentage: 88,
      experience_level: "Senior",
      matched_skills: ["Python", "PyTorch", "TensorFlow", "Docker", "AWS", "Git"],
      missing_skills: ["Kubernetes", "MLOps Lifecycle", "Spark"],
      missing_critical: ["Kubernetes", "MLOps Lifecycle"],
      missing_secondary: ["Spark", "Model Monitoring"],
      recommended_courses: [],
      time_estimate: "8–12 weeks",
      candidate_comparison: "Top 20% of applicants",
      impact_insight: "Adding Kubernetes and MLOps experience can push your match to 96% and unlock $30k+ salary band.",
      salary_range: "$160k - $220k"
    },
    {
      id: "data-sci",
      icon: "📊",
      title: "Data Scientist",
      company_name: "Meta AI",
      match_percentage: 74,
      experience_level: "Intermediate",
      matched_skills: ["Python", "SQL", "Machine Learning", "TensorFlow"],
      missing_skills: ["Tableau", "A/B Testing", "Statistics", "R"],
      missing_critical: ["A/B Testing", "Statistics"],
      missing_secondary: ["Tableau", "R"],
      recommended_courses: [],
      time_estimate: "6–8 weeks",
      candidate_comparison: "Top 35% of applicants",
      impact_insight: "Strong A/B Testing and Statistics knowledge is the #1 differentiator for Data Scientist roles at top companies.",
      salary_range: "$110k - $150k"
    },
    {
      id: "ai-eng",
      icon: "🧠",
      title: "AI Solutions Engineer",
      company_name: "Microsoft Azure",
      match_percentage: 84,
      experience_level: "Senior",
      matched_skills: ["Python", "TensorFlow", "AWS", "Docker", "Machine Learning"],
      missing_skills: ["LLM Fine-tuning", "Vector DBs", "LangChain"],
      missing_critical: ["LLM Fine-tuning", "Vector DBs"],
      missing_secondary: ["LangChain", "RAG Pipelines"],
      recommended_courses: [],
      time_estimate: "4–6 weeks",
      candidate_comparison: "Top 25% of applicants",
      impact_insight: "LLM Fine-tuning is the fastest growing skill in AI engineering. Learning it now puts you 18 months ahead.",
      salary_range: "$140k - $190k"
    },
    {
      id: "ml-ops",
      icon: "⚙️",
      title: "MLOps Engineer",
      company_name: "Stripe",
      match_percentage: 71,
      experience_level: "Intermediate",
      matched_skills: ["Python", "Docker", "AWS", "Git"],
      missing_skills: ["Kubernetes", "Terraform", "MLflow", "CI/CD", "Monitoring"],
      missing_critical: ["Kubernetes", "MLflow"],
      missing_secondary: ["Terraform", "CI/CD"],
      recommended_courses: [],
      time_estimate: "10–14 weeks",
      candidate_comparison: "Average applicant pool",
      impact_insight: "MLOps roles are 3× higher paying than standard engineering roles. Infrastructure + ML is a rare combo.",
      salary_range: "$130k - $180k"
    }
  ],

  top_3_matches: [
    {
      id: "sr-ml-eng",
      icon: "🤖",
      title: "Senior Machine Learning Engineer",
      company_name: "Google DeepMind",
      match_percentage: 88,
      experience_level: "Senior",
      matched_skills: ["Python", "PyTorch", "TensorFlow", "Docker", "AWS", "Git"],
      missing_skills: ["Kubernetes", "MLOps Lifecycle", "Spark"],
      missing_critical: ["Kubernetes", "MLOps Lifecycle"],
      salary_range: "$160k - $220k"
    },
    {
      id: "data-sci",
      icon: "📊",
      title: "Data Scientist",
      company_name: "Meta AI",
      match_percentage: 74,
      experience_level: "Intermediate",
      matched_skills: ["Python", "SQL", "Machine Learning", "TensorFlow"],
      missing_skills: ["Tableau", "A/B Testing", "Statistics", "R"],
      missing_critical: ["A/B Testing", "Statistics"],
      salary_range: "$110k - $150k"
    },
    {
      id: "ai-eng",
      icon: "🧠",
      title: "AI Solutions Engineer",
      company_name: "Microsoft Azure",
      match_percentage: 84,
      experience_level: "Senior",
      matched_skills: ["Python", "TensorFlow", "AWS", "Docker", "Machine Learning"],
      missing_skills: ["LLM Fine-tuning", "Vector DBs", "LangChain"],
      missing_critical: ["LLM Fine-tuning", "Vector DBs"],
      salary_range: "$140k - $190k"
    }
  ],

  insights: [
    {
      id: "ins-1",
      icon: "cloud",
      title: "MLOps Gap Detected",
      description: "Adding Kubernetes and MLOps to your skills will unlock senior ML engineering roles and increase your salary potential by $20k+.",
      boost: 8,
      focus_skills: ["Kubernetes", "MLflow", "LLM Fine-tuning"]
    },
    {
      id: "ins-2",
      icon: "chart",
      title: "Strong Core ML Foundation",
      description: "Your PyTorch and TensorFlow skills are exactly what top tech companies are looking for.",
      boost: 0,
      focus_skills: []
    }
  ],

  roadmap: [
    { step: 1, skill: "Kubernetes",      is_core: true,  completed: false, category: "DevOps" },
    { step: 2, skill: "MLflow",          is_core: true,  completed: false, category: "MLOps" },
    { step: 3, skill: "LLM Fine-tuning", is_core: true,  completed: false, category: "AI/ML" },
    { step: 4, skill: "A/B Testing",     is_core: false, completed: false, category: "Analytics" },
    { step: 5, skill: "Spark",           is_core: false, completed: false, category: "Data Eng" },
    { step: 6, skill: "Terraform",       is_core: false, completed: false, category: "DevOps" },
    { step: 7, skill: "Vector DBs",      is_core: true,  completed: false, category: "AI/ML" }
  ],

  roadmap_job: "Senior Machine Learning Engineer",

  resume_audit: {
    ats_score: 74,
    structure_score: 85,
    keyword_score: 70,
    impact_score: 65,
    readability: 80,
    missing_keywords: ["Cloud Infrastructure", "System Design", "Scalability"],
    formatting_issues: ["Use standard fonts", "Bullets are too long"]
  },

  resume_suggestions: [
    {
      section: "Experience",
      suggestion: "Quantify your ML model performance (e.g., 'increased accuracy by 5% over baseline').",
      impact: "High"
    },
    {
      section: "Skills",
      suggestion: "Group technical skills into clearly defined categories (e.g., 'Languages', 'Frameworks', 'Tools').",
      impact: "Medium"
    }
  ]
};
