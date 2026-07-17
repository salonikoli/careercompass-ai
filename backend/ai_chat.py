"""
ai_chat.py
----------
Groq LLM-powered career assistant.
Uses llama3-8b-8192 with a rich context-aware system prompt built
from the user's resume analysis: skills, job matches, readiness score.

Falls back to rule-based responses if Groq is unavailable.
"""

import os
from groq import Groq
from typing import Optional, List, Dict, Any

# Load .env file automatically (pip install python-dotenv)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv optional — falls back to system env vars

# Load from environment — never hardcode secrets
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
MODEL = "llama-3.1-8b-instant"


# ---------------------------------------------------------------------------
# System prompt builder — injects user's resume context
# ---------------------------------------------------------------------------

def build_system_prompt(context: Optional[Dict[str, Any]] = None) -> str:
    base = """You are an expert AI Career Mentor with deep knowledge of the tech industry, job markets, skill development, and career transitions. You are highly encouraging, specific, and actionable in your advice.

Your personality:
- Warm, professional, and motivating
- Data-driven — reference specific skills, percentages, and timelines
- Concise — keep answers under 120 words unless the user asks for detail
- Use emojis sparingly but effectively (1-2 per message max)

You help users with:
- Career path selection and transitions
- Skill gap analysis and prioritization  
- Course and resource recommendations
- Resume and interview advice
- Job search strategies
- Salary negotiation tips
- Technical skill roadmaps"""

    if context:
        skills = context.get("extracted_skills", [])
        score = context.get("career_readiness_score", 0)
        best_job = context.get("best_fit_job", "")
        best_score = context.get("best_fit_job_score", 0)
        top_jobs = context.get("top_3_matches", [])

        top_job_names = [f"{j['title']} ({j['match_percentage']}% match)" 
                         for j in top_jobs[:3]] if top_jobs else []

        context_block = f"""

--- USER'S RESUME CONTEXT ---
Detected Skills ({len(skills)} total): {', '.join(skills[:20]) if skills else 'None detected'}
Career Readiness Score: {score}/100
Best-Fit Role: {best_job} ({best_score}% match)
Top 3 Matches: {', '.join(top_job_names) if top_job_names else 'Not analyzed yet'}
---

When the user asks questions, reference their actual skills and scores to give personalized advice. 
If they ask "what should I learn", look at their best-fit role and missing skills."""

        return base + context_block

    return base + "\n\nNote: No resume has been uploaded yet. Encourage the user to upload their resume for personalized advice."


# ---------------------------------------------------------------------------
# Rule-based fallback (same as before — used if Groq fails)
# ---------------------------------------------------------------------------
FALLBACK_RESPONSES = {
    "data scientist":   "To become a Data Scientist, focus on Python, SQL, Statistics, and ML. Start with Andrew Ng's ML Specialization on Coursera! 🔬",
    "machine learning": "Machine Learning: Andrew Ng's ML Specialization is the gold standard. Follow with Kaggle competitions for hands-on practice! ⚡",
    "web developer":    "Master HTML → CSS → JS → React. freeCodeCamp is free and structured. Build 3 projects to land your first role! 🌐",
    "frontend":         "Frontend needs HTML, CSS, JS, React + responsive design. Build a portfolio with 3-5 live projects on GitHub Pages or Vercel.",
    "backend":          "Backend: Python/Node.js, SQL, REST APIs, Docker. Start with a CRUD API then containerize it. ⚙️",
    "full stack":       "Full Stack: Master React + Node.js + SQL. Build a complete web app end-to-end for your portfolio. 🧱",
    "devops":           "DevOps: Linux → Docker → Kubernetes → CI/CD → AWS. Start with Docker + GitHub Actions. 🔄",
    "cloud":            "AWS Free Tier lets you practice real deployments. AWS Cloud Practitioner cert is a great first credential. ☁️",
    "python":           "Python is #1 for data science and AI. Start with 'Python for Everybody' on Coursera, then practice on Kaggle. 🐍",
    "salary":           "Salaries: Data Scientist $90k-$150k | AI Engineer $120k-$200k | Web Dev $70k-$130k | DevOps $90k-$160k 💰",
    "resume":           "Strong resumes have: quantified achievements, project links (GitHub), and an explicit Skills section. 📄",
    "interview":        "For interviews: LeetCode Easy/Medium for DSA, Grokking System Design, mock interviews on Pramp. Prepare STAR-format answers. 🎯",
    "default":          "I'm your AI Career Mentor powered by Groq! Ask me about job roles, skills, courses, salaries, or career roadmaps. 🚀",
}


def fallback_response(message: str) -> str:
    msg = message.lower()
    for keyword, response in FALLBACK_RESPONSES.items():
        if keyword in msg:
            return response
    return FALLBACK_RESPONSES["default"]


# ---------------------------------------------------------------------------
# Main chat function
# ---------------------------------------------------------------------------

def get_ai_response(
    message: str,
    conversation_history: List[Dict[str, str]],
    context: Optional[Dict[str, Any]] = None,
) -> str:
    """
    Get AI response from Groq with full conversation history + resume context.
    Falls back to rule-based if Groq API fails.
    """
    try:
        client = Groq(api_key=GROQ_API_KEY)

        system_prompt = build_system_prompt(context)

        # Build messages array: system + history + new message
        messages = [{"role": "system", "content": system_prompt}]

        # Add recent conversation history (last 10 messages to stay within context)
        for msg in conversation_history[-10:]:
            messages.append(msg)

        # Add current user message
        messages.append({"role": "user", "content": message})

        completion = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=300,
            top_p=1,
        )

        return completion.choices[0].message.content.strip()

    except Exception as e:
        print(f"[ai_chat] Groq API error: {e} — falling back to rule-based")
        return fallback_response(message)
