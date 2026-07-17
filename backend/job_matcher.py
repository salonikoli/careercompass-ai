"""
job_matcher.py
--------------
Compares extracted skills against job role requirements.
Uses WEIGHTED matching based on core competencies:
  - Core skills  (from core_skills field) → weight: 70%
  - Other skills (remaining required)      → weight: 30%
  weighted_score = 0.7 × (core_matched/core_total) + 0.3 × (other_matched/other_total)

Also computes:
  - Missing skills split (critical vs secondary)
  - Recommended courses
  - Career readiness score (0-100)
  - Smart insights (via insights_engine)
  - Career roadmap (via insights_engine)
  - Resume suggestions (via insights_engine)
"""

import json
import os
from typing import List, Dict, Any

from insights_engine import (
    generate_insights,
    build_roadmap,
    generate_resume_suggestions,
)

# ---------------------------------------------------------------------------
# Load datasets once at import time
# ---------------------------------------------------------------------------
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

with open(os.path.join(DATA_DIR, "jobs.json"), encoding="utf-8") as f:
    JOBS: List[Dict] = json.load(f)

with open(os.path.join(DATA_DIR, "courses.json"), encoding="utf-8") as f:
    COURSES: Dict[str, Dict] = json.load(f)


# ---------------------------------------------------------------------------
# Core matching helpers
# ---------------------------------------------------------------------------

# Core / secondary weight constants
CORE_WEIGHT  = 0.70   # Core competency skills count 70%
OTHER_WEIGHT = 0.30   # Secondary skills count 30%


def calculate_match(
    extracted_skills: List[str],
    required_skills: List[str],
    core_skills: List[str] = None,
) -> float:
    """
    Weighted match percentage based on core competencies.

    Formula:
      core_score  = (core_matched  / core_total)  if core_total  > 0 else 1.0
      other_score = (other_matched / other_total) if other_total > 0 else 1.0
      weighted    = CORE_WEIGHT * core_score + OTHER_WEIGHT * other_score

    Falls back to simple (matched/total) when core_skills is empty.
    Rounded to 1 decimal place.
    """
    if not required_skills:
        return 0.0

    extracted_lower = set(s.lower() for s in extracted_skills)
    core_lower      = set(s.lower() for s in (core_skills or []))

    if core_lower:
        # Split required skills into core and secondary
        core_required  = [s for s in required_skills if s.lower() in core_lower]
        other_required = [s for s in required_skills if s.lower() not in core_lower]

        core_matched  = sum(1 for s in core_required  if s.lower() in extracted_lower)
        other_matched = sum(1 for s in other_required if s.lower() in extracted_lower)

        core_score  = core_matched  / len(core_required)  if core_required  else 1.0
        other_score = other_matched / len(other_required) if other_required else 1.0

        weighted = CORE_WEIGHT * core_score + OTHER_WEIGHT * other_score
        return round(weighted * 100, 1)
    else:
        # Simple fallback if no core_skills defined
        matched = sum(1 for s in required_skills if s.lower() in extracted_lower)
        return round((matched / len(required_skills)) * 100, 1)


def get_missing_skills(extracted_skills: List[str], required_skills: List[str]) -> List[str]:
    """Return required skills NOT present in extracted skills (ordered by importance)."""
    extracted_lower = set(s.lower() for s in extracted_skills)
    return [skill for skill in required_skills if skill.lower() not in extracted_lower]


def get_courses_for_skills(missing_skills: List[str]) -> List[Dict]:
    """Return course recommendations for a list of missing skills (max 5)."""
    recommendations = []
    seen_urls = set()
    for skill in missing_skills:
        course = COURSES.get(skill.lower())
        if course and course["url"] not in seen_urls:
            recommendations.append({"skill": skill, **course})
            seen_urls.add(course["url"])
    return recommendations[:5]


# ---------------------------------------------------------------------------
# Career readiness score
# ---------------------------------------------------------------------------

def calculate_career_readiness_score(extracted_skills: List[str], job_matches: List[Dict]) -> int:
    """
    Composite score (0-100):
      40pts — Skill breadth (capped at 20 skills)
      40pts — Average match % across top 3 jobs
      20pts — Skill category diversity (5 categories)
    """
    skill_breadth = min(len(extracted_skills) / 20, 1.0) * 40

    top_3 = sorted(job_matches, key=lambda x: x["match_percentage"], reverse=True)[:3]
    avg_match = sum(j["match_percentage"] for j in top_3) / len(top_3) if top_3 else 0
    match_score = (avg_match / 100) * 40

    categories = {
        "programming": ["python", "java", "javascript", "typescript", "c++", "r", "scala"],
        "web":         ["html", "css", "react", "angular", "nodejs", "rest api"],
        "ml_ai":       ["machine learning", "deep learning", "nlp", "tensorflow", "pytorch", "scikit-learn"],
        "data":        ["sql", "pandas", "numpy", "data analysis", "statistics", "tableau"],
        "cloud":       ["aws", "azure", "gcp", "docker", "kubernetes", "devops"],
    }
    extracted_lower = set(s.lower() for s in extracted_skills)
    categories_covered = sum(
        1 for skills in categories.values() if any(s in extracted_lower for s in skills)
    )
    diversity_score = (categories_covered / len(categories)) * 20

    total = round(skill_breadth + match_score + diversity_score)
    return min(max(total, 0), 100)


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def match_jobs(extracted_skills: List[str]) -> Dict[str, Any]:
    """
    Full pipeline: extracted skills → career analysis.

    Returns:
      extracted_skills, job_matches, top_3_matches,
      career_readiness_score, global_recommended_courses,
      insights, roadmap (for best-fit job),
      resume_suggestions
    """
    job_matches = []
    extracted_lower = set(s.lower() for s in extracted_skills)

    for job in JOBS:
        core_skills = job.get("core_skills", [])
        match_pct  = calculate_match(extracted_skills, job["skills"], core_skills)
        missing    = get_missing_skills(extracted_skills, job["skills"])
        matched    = [s for s in job["skills"] if s.lower() in extracted_lower]
        courses    = get_courses_for_skills(missing)

        # ── Split missing into critical vs secondary ──
        missing_critical  = [s for s in missing if s.lower() in [c.lower() for c in core_skills]]
        missing_secondary = [s for s in missing if s.lower() not in [c.lower() for c in core_skills]]

        # ── Impact insight: predict score after learning core missing skills ──
        total_skills = len(job["skills"])
        potential_matched = len(matched) + len(missing_critical)
        potential_pct = round((potential_matched / total_skills) * 100, 1) if total_skills else match_pct
        if missing_critical and potential_pct > match_pct:
            core_names = " and ".join(s.title() for s in missing_critical[:2])
            impact_insight = (
                f"Learning {core_names} can increase your match "
                f"from {match_pct}% → {potential_pct}%"
            )
        elif match_pct >= 70:
            impact_insight = f"You're nearly there! Add {missing[0].title() if missing else 'polish'} to hit 100%."
        else:
            impact_insight = None

        # ── Time estimate to reach 70% readiness ──
        if match_pct >= 70:
            time_estimate = "~1 month of focused practice"
        elif match_pct >= 40:
            time_estimate = "~2 months of structured learning"
        else:
            time_estimate = "~3 months with dedicated effort"

        # ── Candidate comparison ──
        typical_min  = max(5, total_skills - 2)
        typical_max  = total_skills
        candidate_comparison = (
            f"Top candidates typically have {typical_min}–{typical_max} skills. "
            f"You currently have {len(matched)}."
        )

        job_matches.append({
            "id":                   job["id"],
            "title":                job["title"],
            "icon":                 job["icon"],
            "description":          job["description"],
            "company_name":         job.get("company_name", ""),
            "experience_level":     job.get("experience_level", ""),
            "match_percentage":     match_pct,
            "matched_skills":       matched,
            "missing_skills":       missing,
            "missing_critical":     missing_critical,
            "missing_secondary":    missing_secondary,
            "core_skills":          core_skills,
            "recommended_courses":  courses,
            "salary_range":         job["salary_range"],
            "demand":               job["demand"],
            "impact_insight":       impact_insight,
            "time_estimate":        time_estimate,
            "candidate_comparison": candidate_comparison,
            "potential_match":      potential_pct,
        })

    # Sort by match % descending
    job_matches.sort(key=lambda x: x["match_percentage"], reverse=True)

    top_job = job_matches[0] if job_matches else {}
    top_job_data = next((j for j in JOBS if j["id"] == top_job.get("id")), {})

    # --- Career readiness score ---
    readiness_score = calculate_career_readiness_score(extracted_skills, job_matches)

    # --- Global courses from top job's missing skills ---
    top_missing = top_job.get("missing_skills", [])
    global_courses = get_courses_for_skills(top_missing)

    # --- Smart insights ---
    insights = generate_insights(top_job, extracted_skills, job_matches) if top_job else []

    # --- Career roadmap for best-fit role ---
    roadmap = build_roadmap(top_job_data, extracted_skills) if top_job_data else []

    # --- Resume suggestions ---
    resume_suggestions = generate_resume_suggestions(top_missing, extracted_skills)

    return {
        "extracted_skills":           extracted_skills,
        "job_matches":                job_matches,
        "top_3_matches":              job_matches[:3],
        "career_readiness_score":     readiness_score,
        "best_fit_job":               top_job.get("title", ""),
        "best_fit_job_score":         top_job.get("match_percentage", 0),
        "global_recommended_courses": global_courses,
        "insights":                   insights,
        "roadmap":                    roadmap,
        "roadmap_job":                top_job.get("title", ""),
        "resume_suggestions":         resume_suggestions,
    }
