"""
resume_scorer.py
----------------
Scores a resume across 5 dimensions for the Resume Audit feature.

Dimensions (each 0-100):
  1. Skills Coverage    — breadth & depth of detected skills
  2. ATS Compatibility  — keyword density & formatting signals
  3. Certifications     — recognized certs detected in text
  4. Project Depth      — project count & technical indicators
  5. Experience Level   — years / seniority signals in text

Also computes per-dimension actionable feedback.
"""

import re
from typing import List, Dict, Any

# ---------------------------------------------------------------------------
# Known certifications to scan for
# ---------------------------------------------------------------------------
KNOWN_CERTS = [
    "aws certified", "azure certified", "google cloud", "gcp professional",
    "pmp", "scrum master", "certified kubernetes", "cka", "ckad",
    "tensorflow developer", "deep learning specialization",
    "machine learning specialization", "google data analytics",
    "ibm data science", "coursera", "udacity nanodegree",
    "certified ethical hacker", "ceh", "cissp", "comptia",
    "oracle certified", "java certified", "python certification",
    "react certification", "mongodb certified", "databricks",
    "tableau certified", "power bi certified", "snowflake",
    "salesforce certified", "servicenow", "itil",
]

# Technical project keywords
PROJECT_KEYWORDS = [
    "built", "developed", "created", "designed", "implemented",
    "deployed", "architected", "engineered", "led", "shipped",
    "launched", "automated", "optimized", "improved", "reduced",
    "increased", "achieved", "integrated", "migrated", "refactored",
    "github.com", "github", "project:", "project —", "project -",
    "capstone", "hackathon", "kaggle", "portfolio",
]

# Experience indicators
SENIORITY_SIGNALS = {
    "senior":   ["senior", "lead", "principal", "staff", "architect", "head of", "manager", "director"],
    "mid":      ["mid-level", "3 years", "4 years", "5 years", "experienced", "intermediate"],
    "junior":   ["junior", "entry", "fresher", "graduate", "intern", "1 year", "2 years", "beginner"],
}

YEAR_PATTERN = re.compile(r'(\d+)\+?\s*years?\s*(of\s*)?(experience|exp|work)', re.IGNORECASE)


# ---------------------------------------------------------------------------
# Scoring functions
# ---------------------------------------------------------------------------

def score_skills_coverage(extracted_skills: List[str]) -> Dict[str, Any]:
    """Score based on number and diversity of skills."""
    count = len(extracted_skills)

    if count >= 18:
        score = 95
        label = "Excellent"
        feedback = f"Outstanding! You have {count} skills — highly competitive across multiple domains."
    elif count >= 12:
        score = 80
        label = "Strong"
        feedback = f"Strong profile with {count} skills. Add 2-3 more niche skills to stand out."
    elif count >= 8:
        score = 62
        label = "Good"
        feedback = f"Good foundation with {count} skills. Expand into adjacent technologies for better matches."
    elif count >= 4:
        score = 42
        label = "Developing"
        feedback = f"{count} skills detected. Focus on learning 4-6 core skills for your target role."
    else:
        score = 22
        label = "Needs Work"
        feedback = f"Only {count} skills detected. Your resume may not list skills explicitly — add a dedicated Skills section."

    return {"score": score, "label": label, "feedback": feedback, "count": count}


def score_ats_compatibility(raw_text: str, extracted_skills: List[str]) -> Dict[str, Any]:
    """Score ATS compatibility based on keyword density and structure signals."""
    text_lower = raw_text.lower()
    word_count = len(raw_text.split())

    # Check for common ATS-friendly sections
    sections = {
        "experience": any(k in text_lower for k in ["experience", "work history", "employment"]),
        "education":  any(k in text_lower for k in ["education", "university", "degree", "bachelor", "master", "b.tech", "b.e.", "mca", "msc"]),
        "skills":     any(k in text_lower for k in ["skills", "technologies", "technical skills", "competencies", "tools"]),
        "summary":    any(k in text_lower for k in ["summary", "objective", "profile", "about me", "overview"]),
    }

    sections_found = sum(sections.values())
    keyword_density = (len(extracted_skills) / max(word_count, 1)) * 100

    # Scoring
    base = sections_found * 18  # max 72 from sections
    density_bonus = min(keyword_density * 5, 28)  # max 28 from density
    score = min(int(base + density_bonus), 100)

    issues = []
    if not sections["skills"]:
        issues.append("❌ No dedicated Skills section detected")
    if not sections["summary"]:
        issues.append("⚠️ Add a Professional Summary at the top")
    if not sections["experience"]:
        issues.append("⚠️ Work Experience section not clearly labeled")
    if keyword_density < 1.5:
        issues.append("❌ Low keyword density — add more skill terms throughout")
    if word_count < 200:
        issues.append("⚠️ Resume seems too short — aim for 400-700 words")

    passes = [k for k, v in sections.items() if v]
    label = "High" if score >= 75 else "Medium" if score >= 50 else "Low"
    feedback = f"ATS score: {score}/100. " + (issues[0] if issues else "Good keyword coverage!")

    return {
        "score": score, "label": label, "feedback": feedback,
        "sections_found": passes,
        "issues": issues,
        "word_count": word_count,
    }


def score_certifications(raw_text: str) -> Dict[str, Any]:
    """Detect recognized certifications in resume text."""
    text_lower = raw_text.lower()
    found = [cert for cert in KNOWN_CERTS if cert in text_lower]

    count = len(found)
    if count >= 3:
        score = 95
        label = "Excellent"
        feedback = f"{count} certifications detected — impressive credential stack!"
    elif count == 2:
        score = 78
        label = "Good"
        feedback = f"{count} certifications found. One more relevant cert would complete your profile."
    elif count == 1:
        score = 52
        label = "Fair"
        feedback = f"1 certification detected. Add 1-2 more relevant certs for your target role."
    else:
        score = 20
        label = "Needs Work"
        feedback = "No recognized certifications detected. Even free certifications (e.g., Google, Coursera) greatly boost ATS scores."

    return {
        "score": score, "label": label, "feedback": feedback,
        "certifications_found": list(set(found)),
        "count": count,
    }


def score_project_depth(raw_text: str) -> Dict[str, Any]:
    """Score based on project count and action verb usage."""
    text_lower = raw_text.lower()

    action_count = sum(1 for kw in PROJECT_KEYWORDS if kw in text_lower)
    # Count "project" mentions
    project_mentions = len(re.findall(r'\bproject\b', text_lower))
    # Count quantified achievements (numbers with % or $)
    quantified = len(re.findall(r'\d+\s*(%|\$|x\b|k\b|million|users|customers|ms\b)', text_lower))

    score = min(int(action_count * 6 + project_mentions * 8 + quantified * 12), 100)

    if score >= 80:
        label = "Strong"
        feedback = f"Excellent project depth with {action_count} action verbs and {quantified} quantified achievements!"
    elif score >= 55:
        label = "Good"
        feedback = f"Good project content. Add more quantified results (e.g., 'improved speed by 40%') for bigger impact."
    elif score >= 30:
        label = "Fair"
        feedback = "Add 2-3 concrete project descriptions with GitHub links and measurable outcomes."
    else:
        label = "Needs Work"
        feedback = "Projects section is weak or missing. Link GitHub repos and describe what you built and its impact."

    return {
        "score": score, "label": label, "feedback": feedback,
        "action_verbs_found": action_count,
        "quantified_achievements": quantified,
    }


def score_experience_level(raw_text: str) -> Dict[str, Any]:
    """Detect experience level signals in the resume text."""
    text_lower = raw_text.lower()

    # Check for explicit year mentions
    year_matches = YEAR_PATTERN.findall(text_lower)
    max_years = max([int(y[0]) for y in year_matches], default=0) if year_matches else 0

    # Check seniority signals
    level = "entry"
    for tier, signals in SENIORITY_SIGNALS.items():
        if any(s in text_lower for s in signals):
            level = tier
            break

    if max_years >= 5 or level == "senior":
        score = 90
        label = "Senior"
        feedback = f"Senior-level signals detected ({max_years}+ years). Strong experience indicators."
    elif max_years >= 3 or level == "mid":
        score = 70
        label = "Mid-Level"
        feedback = f"Mid-level profile ({max_years} years). Highlight leadership or mentoring experience to stand out."
    elif max_years >= 1 or level == "junior":
        score = 48
        label = "Junior"
        feedback = "Junior/fresher profile. Emphasize projects, hackathons, and internships to compensate for experience."
    else:
        score = 30
        label = "Entry"
        feedback = "Experience level unclear. Clearly state your years of experience or level (e.g., '2 years of Python development')."

    return {
        "score": score, "label": label, "feedback": feedback,
        "years_detected": max_years,
        "level": level,
    }


# ---------------------------------------------------------------------------
# Main audit function
# ---------------------------------------------------------------------------

def compute_resume_audit(raw_text: str, extracted_skills: List[str]) -> Dict[str, Any]:
    """
    Full resume audit returning 5-dimension scores and overall ATS grade.
    """
    dimensions = {
        "skills_coverage":   score_skills_coverage(extracted_skills),
        "ats_compatibility": score_ats_compatibility(raw_text, extracted_skills),
        "certifications":    score_certifications(raw_text),
        "project_depth":     score_project_depth(raw_text),
        "experience_level":  score_experience_level(raw_text),
    }

    # Weighted overall score
    weights = {
        "skills_coverage":   0.30,
        "ats_compatibility": 0.25,
        "certifications":    0.15,
        "project_depth":     0.20,
        "experience_level":  0.10,
    }
    overall = round(sum(dimensions[k]["score"] * w for k, w in weights.items()))

    # Grade
    if overall >= 85:
        grade = "A"
        grade_label = "Outstanding Resume"
        grade_color = "green"
    elif overall >= 70:
        grade = "B"
        grade_label = "Strong Resume"
        grade_color = "cyan"
    elif overall >= 55:
        grade = "C"
        grade_label = "Good Foundation"
        grade_color = "blue"
    elif overall >= 40:
        grade = "D"
        grade_label = "Needs Improvement"
        grade_color = "warning"
    else:
        grade = "F"
        grade_label = "Significant Gaps"
        grade_color = "danger"

    # Top 3 priority actions
    sorted_dims = sorted(dimensions.items(), key=lambda x: x[1]["score"])
    priorities = [
        {"dimension": k.replace("_", " ").title(), "score": v["score"], "action": v["feedback"]}
        for k, v in sorted_dims[:3]
    ]

    return {
        "overall_score": overall,
        "grade": grade,
        "grade_label": grade_label,
        "grade_color": grade_color,
        "dimensions": {
            k: {
                "score": v["score"],
                "label": v["label"],
                "feedback": v["feedback"],
            }
            for k, v in dimensions.items()
        },
        "ats_issues": dimensions["ats_compatibility"].get("issues", []),
        "certifications_found": dimensions["certifications"].get("certifications_found", []),
        "priority_actions": priorities,
    }
