"""
insights_engine.py
------------------
Generates human-like career insights, career roadmap, and resume
improvement suggestions based on skill gaps and job matches.

All logic is rule-based — no heavy ML required.
"""

from typing import List, Dict, Any


# ---------------------------------------------------------------------------
# Smart Insight Generation
# ---------------------------------------------------------------------------

def generate_insights(top_job: Dict, extracted_skills: List[str], all_matches: List[Dict]) -> List[str]:
    """
    Produce 3-5 human-readable insight strings for the career dashboard.
    """
    insights = []
    name = top_job["title"]
    pct = top_job["match_percentage"]
    missing = top_job["missing_skills"]
    matched = top_job["matched_skills"]

    # --- Insight 1: Headline matchability statement ---
    if pct >= 80:
        insights.append(f"🚀 Outstanding! You are {pct}% ready for {name}. You have a very strong profile — start applying now!")
    elif pct >= 60:
        insights.append(f"⭐ You are {pct}% ready for {name}. You're close — a few targeted skills will make you highly competitive.")
    elif pct >= 40:
        insights.append(f"📈 You are {pct}% ready for {name}. A focused 2-3 month learning plan can significantly boost your profile.")
    else:
        insights.append(f"💪 You are {pct}% ready for {name}. Build your foundation — start with the core skills below.")

    # --- Insight 2: Top missing skill action ---
    if missing:
        top_gap = missing[0]
        if pct >= 50:
            insights.append(f"🎯 You're close to becoming a {name}! Learning {top_gap.title()} could push you to the top of candidates.")
        else:
            insights.append(f"📚 Your most impactful next step: master {top_gap.title()} — it's a core requirement for {name} roles.")

    # --- Insight 3: Strength callout ---
    if matched:
        strength = matched[0] if len(matched) == 1 else f"{matched[0].title()} and {matched[1].title()}"
        insights.append(f"✅ Your expertise in {strength} is a great asset — these are in-demand skills for {name} positions.")

    # --- Insight 4: Secondary role opportunity ---
    secondary = [j for j in all_matches if j["id"] != top_job["id"] and j["match_percentage"] >= 35]
    if secondary:
        s = secondary[0]
        insights.append(
            f"💡 You're also {s['match_percentage']}% aligned with {s['title']}. "
            f"Adding {s['missing_skills'][0].title() if s['missing_skills'] else 'a few skills'} "
            f"could open that path too."
        )

    # --- Insight 5: Volume of skills message ---
    n_skills = len(extracted_skills)
    if n_skills >= 15:
        insights.append(f"🌟 With {n_skills} identifiable skills, you have a diverse profile — focus on depth in your primary track.")
    elif n_skills >= 8:
        insights.append(f"📊 You have {n_skills} recognized skills. Building 3-5 more targeted skills will significantly strengthen your profile.")
    else:
        insights.append(f"🔍 Only {n_skills} skills detected. Enrich your resume with specific tools, technologies, and project outcomes.")

    return insights[:5]


# ---------------------------------------------------------------------------
# Career Roadmap Builder
# ---------------------------------------------------------------------------

def build_roadmap(job: Dict, extracted_skills: List[str]) -> List[Dict]:
    """
    Build a step-by-step roadmap from the job's roadmap_order list.
    Each step has: order, skill, completed (bool), is_core (bool).
    """
    extracted_lower = set(s.lower() for s in extracted_skills)
    roadmap_order = job.get("roadmap_order", job.get("skills", []))
    core_skills = set(s.lower() for s in job.get("core_skills", []))

    steps = []
    for i, skill in enumerate(roadmap_order):
        steps.append({
            "step": i + 1,
            "skill": skill,
            "completed": skill.lower() in extracted_lower,
            "is_core": skill.lower() in core_skills,
        })
    return steps


# ---------------------------------------------------------------------------
# Resume Improvement Suggestions
# ---------------------------------------------------------------------------

SUGGESTION_TEMPLATES = {
    "python":           "Add Python projects (e.g. data pipelines, automation scripts) to your GitHub and link them on your resume.",
    "machine learning": "Include ML project experience — describe the dataset, model used, and accuracy achieved.",
    "sql":              "Mention SQL-driven achievements: e.g., 'Wrote queries to analyze 500k+ records, reducing report time by 40%.'",
    "deep learning":    "Add a deep learning project (image classifier, text generator) to demonstrate hands-on experience.",
    "nlp":              "Showcase an NLP project — sentiment analysis, chatbot, or document classification work great.",
    "tensorflow":       "Specify frameworks used: 'Built neural network using TensorFlow/Keras achieving 92% accuracy.'",
    "pytorch":          "Include PyTorch experience with concrete model architecture and training details.",
    "docker":           "Mention Docker usage: 'Containerized application using Docker, reducing deployment time by 60%.'",
    "kubernetes":       "Add Kubernetes to your DevOps stack — even a learning project with k8s cluster setup counts.",
    "aws":              "List AWS services you've used (S3, EC2, Lambda) and any certifications obtained.",
    "azure":            "Mention Azure services like Azure ML, Blob Storage, or Function Apps with quantified outcomes.",
    "react":            "Add links to live React projects or GitHub repos — judges and recruiters check these.",
    "nodejs":           "Describe a REST API or backend service you built with Node.js, including throughput or scale details.",
    "typescript":       "Highlight TypeScript adoption: 'Migrated legacy JavaScript codebase to TypeScript, eliminating 80% of type errors.'",
    "git":              "Add your GitHub profile link and highlight open-source contributions or active commit history.",
    "statistics":       "Include coursework or certifications in statistics — mention tools like SPSS, SAS, or R used.",
    "data visualization": "Mention Tableau, Power BI, or D3.js dashboards you built, ideally with business impact.",
    "agile":            "Highlight Agile experience: sprint planning, retrospectives, velocity tracking, or Scrum Master involvement.",
    "linux":            "Add Linux sysadmin tasks: 'Managed Ubuntu servers, configured cron jobs, automated deployments with Bash.'",
}



DEFAULT_SUGGESTION = "Add quantifiable achievements and project links to strengthen this skill's presence on your resume."

RESUME_STRUCTURE_TIPS = [
    "📝 Use bullet points with action verbs: 'Built', 'Designed', 'Improved', 'Automated', 'Increased'.",
    "🔢 Quantify results wherever possible: 'Improved model accuracy by 15%', 'Reduced load time by 2s'.",
    "🔗 Add links: GitHub profile, portfolio, live project URLs, or Kaggle profile.",
    "📐 Keep your resume to 1-2 pages maximum with consistent formatting.",
    "🏷️ Include a dedicated 'Skills' section with tools, languages, and frameworks listed explicitly.",
    "⭐ List your 2-3 most relevant projects near the top — projects speak louder than coursework alone.",
]


def generate_resume_suggestions(missing_skills: List[str], extracted_skills: List[str]) -> Dict[str, Any]:
    """
    Generate actionable resume improvement suggestions based on skill gaps.
    Returns skill-specific tips and general structural advice.
    """
    skill_tips = []
    for skill in missing_skills[:6]:  # Cap at 6 specific tips
        tip = SUGGESTION_TEMPLATES.get(skill.lower(), DEFAULT_SUGGESTION)
        skill_tips.append({
            "skill": skill,
            "tip": tip,
            "priority": "high" if skill in missing_skills[:3] else "medium",
        })

    # Also flag if resume is sparse (few detected skills = poor keyword density)
    structure_tips = list(RESUME_STRUCTURE_TIPS)
    if len(extracted_skills) < 8:
        structure_tips.insert(0, "⚠️ Your resume seems sparse on technical keywords — add a dedicated Skills section with specific tools and technologies.")

    return {
        "skill_specific_tips": skill_tips,
        "structure_tips": structure_tips[:4],
    }
