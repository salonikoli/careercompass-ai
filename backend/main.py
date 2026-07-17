"""
main.py  (v6 — AI Career Intelligence System)
----------------------------------------------
FastAPI REST API endpoints:
  GET  /health         - Root health check (for Render)
  GET  /api/health     - Health check
  POST /api/upload     - Upload PDF resume → full career analysis + resume audit
  POST /api/match-jd   - Paste job description → JD vs resume comparison
  POST /api/ai-chat    - Groq LLM-powered career chatbot (context-aware)
  POST /api/chat       - Rule-based chatbot (legacy fallback)
"""

import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from resume_parser import extract_text_from_pdf
from skill_extractor import extract_skills
from job_matcher import match_jobs, get_courses_for_skills, get_missing_skills, JOBS
from insights_engine import generate_resume_suggestions
from ai_chat import get_ai_response
from resume_scorer import compute_resume_audit
from interview_prep import get_questions, generate_ai_questions
from linkedin_optimizer import analyze_linkedin_profile

# ---------------------------------------------------------------------------
# App initialization
# ---------------------------------------------------------------------------
app = FastAPI(
    title="AI Career Intelligence System API",
    description="Resume analysis, JD matching, Groq AI chat, skill gap insights, career roadmap.",
    version="6.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://prasannaganesann.github.io",  # GitHub Pages production
        "http://localhost:5173",               # Vite dev server
        "http://localhost:3000",               # Alternative local dev
        "http://127.0.0.1:5173",
        os.getenv("FRONTEND_URL", ""),         # Any additional domain via env var
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


# ---------------------------------------------------------------------------
# Chatbot knowledge base
# ---------------------------------------------------------------------------
CHAT_RESPONSES = {
    "data scientist":        "To become a Data Scientist, focus on: Python, SQL, Statistics, Machine Learning, and visualization tools. Start with the Coursera ML Specialization by Andrew Ng!",
    "data analyst":          "Data Analysts need SQL, Excel, Python, Tableau/Power BI, and solid statistics. Google Data Analytics Certificate on Coursera is a great structured start!",
    "web developer":         "For Web Development master HTML → CSS → JavaScript → React. freeCodeCamp is free and structured. Build 3 projects to land your first role!",
    "frontend":              "Frontend Developers need HTML, CSS, JavaScript, React/Vue plus responsive design. Build a portfolio with 3-5 live projects on GitHub Pages or Vercel.",
    "backend":               "Backend Developers work with Python/Node.js, SQL, REST APIs, Docker. Start with a CRUD API project then containerize it with Docker.",
    "full stack":            "Full Stack Developers bridge frontend and backend. Master React + Node.js + SQL — build a complete web app end-to-end for your portfolio.",
    "devops":                "DevOps Engineers need Linux, Docker, Kubernetes, CI/CD, and cloud (AWS). Start with Docker + GitHub Actions, then move to Kubernetes.",
    "cloud":                 "Cloud is in huge demand. AWS Free Tier lets you practice real deployments. AWS Cloud Practitioner cert is a great first credential.",
    "mobile":                "Mobile Developers use React Native (cross-platform) or Flutter. Start with React Native if you know JavaScript — reuse existing skills!",
    "ai engineer":           "AI Engineers need Python + Deep Learning + NLP + MLOps. Start with DeepLearning.ai Specialization, then explore Hugging Face Transformers.",
    "machine learning":      "Machine Learning: Andrew Ng's ML Specialization on Coursera is the gold standard. Follow with Kaggle competitions for hands-on practice!",
    "python":                "Python is the #1 language for data science and AI. Start with 'Python for Everybody' on Coursera, then practice on Kaggle.",
    "salary":                "Salaries: Data Scientist $90k-$150k | AI Engineer $120k-$200k | Web Dev $70k-$130k | DevOps $90k-$160k | Cloud Architect $130k-$220k.",
    "resume":                "Strong resumes: quantified achievements ('improved accuracy by 15%'), project links (GitHub), and an explicit Skills section with all your tools.",
    "skills":                "Focus on skills for your target role. Upload your resume for a personalized skill gap analysis and learning roadmap!",
    "courses":               "Best free resources: freeCodeCamp, fast.ai, Kaggle Learn, Google ML Crash Course. Paid: Coursera, Udemy (on sale), DeepLearning.ai.",
    "internship":            "For internships: build 2-3 solid GitHub projects, apply on LinkedIn, Internshala, AngelList. A Kaggle notebook replaces formal experience!",
    "career":                "Switching careers? Start with MOOCs, build a portfolio, contribute to open source. A focused 6-month plan can get you interview-ready.",
    "deep learning":         "Deep Learning: PyTorch and TensorFlow are the main frameworks. Start with the DeepLearning.ai specialization — covers CNNs, RNNs, transformers.",
    "nlp":                   "NLP is exploding with LLMs. Hugging Face's free NLP course is the best starting point — covers BERT, GPT and fine-tuning.",
    "docker":                "Docker containerizes apps for consistent deployments. Docker's official 'Getting Started' tutorial is free and excellent.",
    "sql":                   "SQL is fundamental for data roles. Practice on LeetCode SQL problems, Mode Analytics, or SQLZoo. Real projects beat any course.",
    "roadmap":               "Upload your resume and I'll generate a step-by-step career roadmap for your best-fit role! Also try the JD Matcher tab. 🗺️",
    "job description":       "Use the 'JD Match' tab to paste any job description and instantly see how well your resume matches — with missing skills and suggestions!",
    "job match":             "Your skill-to-employment match score = (your skills ∩ job skills) / total job skills × 100. Upload your resume to see your scores!",
    "portfolio":             "Build a portfolio: 1 data project (Kaggle), 1 web app (GitHub), 1 API (hosted on Railway/Render). Quality over quantity!",
    "interview":             "For interviews: LeetCode Easy/Medium for DSA, Grokking System Design, mock interviews on Pramp. Prepare STAR-format behavioral answers.",
    "infosys":               "Infosys typically hires for Data Analyst, Backend Dev, and Cybersecurity roles. Strong SQL, Python, and communication skills are key.",
    "tcs":                   "TCS hires across all tech roles. Strong fundamentals in your domain + good communication + certification (AWS/Azure) helps a lot.",
    "google":                "Google values strong CS fundamentals, system design, and coding proficiency. LeetCode Medium/Hard + System Design prep is essential.",
    "amazon":                "Amazon focuses on Leadership Principles + technical depth. For tech roles: LeetCode, system design, and 'tell me about a time...' stories.",
    "default":               "I'm your AI Career Mentor! Ask me about job roles, companies, skills, courses, salaries, JD matching, or career roadmaps. 🚀",
}


def get_chat_response(message: str) -> str:
    msg = message.lower()
    for keyword, response in CHAT_RESPONSES.items():
        if keyword in msg:
            return response
    return CHAT_RESPONSES["default"]


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class AIChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = []
    context: Optional[dict] = None

class JDMatchRequest(BaseModel):
    jd_text: str
    resume_skills: List[str]

class InterviewPrepRequest(BaseModel):
    job_id: str
    job_title: str
    extracted_skills: Optional[List[str]] = []
    missing_skills: Optional[List[str]] = []
    generate_ai: Optional[bool] = False  # Use Groq to generate personalized questions

class LinkedInOptRequest(BaseModel):
    url: str = ""
    resume_skills: List[str] = []
    job_role: str = ""


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/")
def root():
    """Root endpoint — required for Render health check."""
    return {"status": "ok", "service": "AI Career Intelligence System API", "version": "6.0.0"}


@app.get("/health")
def health_root():
    """Root-level health check (Render default)."""
    return {"status": "ok"}


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "AI Career Intelligence System API", "version": "6.0.0"}


@app.post("/api/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload a PDF resume → full Skill-to-Employment analysis.
    Each job match now includes company_name and experience_level.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    raw_text = extract_text_from_pdf(file_bytes)
    if not raw_text:
        raise HTTPException(
            status_code=422,
            detail="Could not extract text from PDF. Ensure it is not image-only/scanned."
        )

    skills = extract_skills(raw_text)
    analysis = match_jobs(skills)
    resume_audit = compute_resume_audit(raw_text, skills)

    return {
        "filename": file.filename,
        "extracted_text_preview": raw_text[:500] + "..." if len(raw_text) > 500 else raw_text,
        "resume_audit": resume_audit,
        **analysis,
    }


@app.post("/api/match-jd")
async def match_job_description(request: JDMatchRequest):
    """
    Job Description Matching — game-changer feature.

    Accepts a raw JD text + the user's already-extracted resume skills.
    Extracts skills from the JD, compares with resume skills, and returns:
      - jd_skills:          all skills found in the JD
      - matched_skills:     skills present in both JD and resume
      - missing_skills:     JD skills absent from resume
      - match_percentage:   score = matched / total_jd_skills * 100
      - improvement_suggestions: actionable tips per missing skill
      - recommended_courses:    courses for missing skills
      - closest_job_role:   which of our 15 roles best matches the JD
    """
    jd_text = request.jd_text.strip()
    if not jd_text:
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")
    if len(jd_text) < 50:
        raise HTTPException(status_code=400, detail="Job description too short. Paste the full JD text.")

    # Extract skills from JD text (reuses the same NLP pipeline)
    jd_skills = extract_skills(jd_text)
    if not jd_skills:
        raise HTTPException(
            status_code=422,
            detail="Could not extract any recognizable skills from the job description. "
                   "Ensure the JD contains technical skill terms."
        )

    resume_skills = [s.lower() for s in request.resume_skills]
    jd_skills_lower = [s.lower() for s in jd_skills]

    # Calculate match
    resume_set = set(resume_skills)
    matched = [s for s in jd_skills_lower if s in resume_set]
    missing = [s for s in jd_skills_lower if s not in resume_set]
    match_pct = round((len(matched) / len(jd_skills_lower)) * 100, 1) if jd_skills_lower else 0.0

    # Resume improvement suggestions for missing JD skills
    suggestions = generate_resume_suggestions(missing, resume_skills)

    # Course recommendations for missing skills
    courses = get_courses_for_skills(missing)

    # Find the closest standard job role to this JD (by overlap of skills)
    closest_role = None
    best_overlap = 0
    jd_set = set(jd_skills_lower)
    for job in JOBS:
        job_skills_set = set(s.lower() for s in job["skills"])
        overlap = len(jd_set & job_skills_set)
        if overlap > best_overlap:
            best_overlap = overlap
            closest_role = {
                "title":            job["title"],
                "company_name":     job["company_name"],
                "experience_level": job["experience_level"],
                "icon":             job["icon"],
            }

    # Generate human-like headline insight
    if match_pct >= 75:
        headline = f"🚀 Excellent! You match {match_pct}% of this job description. Apply with confidence!"
    elif match_pct >= 50:
        headline = f"⭐ You are {match_pct}% aligned with this JD. A few targeted skills would make you a top candidate."
    elif match_pct >= 30:
        headline = f"📈 You match {match_pct}% of this JD. Focus on the missing skills below to become competitive."
    else:
        headline = f"💪 You match {match_pct}% of this JD. Use this as a gap analysis to plan your learning path."

    return {
        "jd_skills":               jd_skills,
        "matched_skills":          matched,
        "missing_skills":          missing,
        "match_percentage":        match_pct,
        "headline":                headline,
        "closest_job_role":        closest_role,
        "improvement_suggestions": suggestions,
        "recommended_courses":     courses,
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    return ChatResponse(response=get_chat_response(request.message))


@app.post("/api/ai-chat", response_model=ChatResponse)
async def ai_chat(request: AIChatRequest):
    """
    Groq LLM-powered career mentor chat.
    Accepts full conversation history + resume context for personalized responses.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    response = get_ai_response(
        message=request.message,
        conversation_history=request.conversation_history or [],
        context=request.context,
    )
    return ChatResponse(response=response)


@app.post("/api/interview-prep")
async def interview_prep(request: InterviewPrepRequest):
    """
    Returns role-specific interview questions.
    Optionally uses Groq AI to generate personalized questions based on the user's skills.
    """
    # Get static questions from bank
    static_questions = get_questions(request.job_id, count=10)

    ai_questions = []
    if request.generate_ai:
        # Generate personalized questions using Groq
        ai_questions = generate_ai_questions(
            job_title=request.job_title,
            job_id=request.job_id,
            extracted_skills=request.extracted_skills or [],
            missing_skills=request.missing_skills or [],
            count=5,
        )

    return {
        "job_id": request.job_id,
        "job_title": request.job_title,
        "static_questions": static_questions,
        "ai_questions": ai_questions,
        "total": len(static_questions) + len(ai_questions),
    }


@app.post("/api/linkedin-optimize")
async def linkedin_optimize(request: LinkedInOptRequest):
    """
    Generates personalized LinkedIn optimization strategy using parsed resume and URL.
    """
    if not request.job_role:
        raise HTTPException(status_code=400, detail="Job role is required for LinkedIn optimization.")
    
    result = analyze_linkedin_profile(request.url, request.resume_skills, request.job_role)
    return result


@app.get("/api/salary-insights")
async def salary_insights():
    """
    Returns salary data and market insights for all job roles.
    Aggregated from jobs.json with entry/mid/senior splits.
    """
    salary_data = []
    for job in JOBS:
        salary_data.append({
            "id": job.get("id"),
            "title": job.get("title"),
            "icon": job.get("icon", "💼"),
            "experience_level": job.get("experience_level"),
            "salary_range": job.get("salary_range", "N/A"),
            "salary_entry": job.get("salary_entry", "N/A"),
            "salary_mid": job.get("salary_mid", "N/A"),
            "salary_senior": job.get("salary_senior", "N/A"),
            "demand": job.get("demand", "High"),
            "demand_trend": job.get("demand_trend", "Stable"),
            "top_companies": job.get("top_companies", []),
            "remote_friendly": job.get("remote_friendly", False),
        })
    return {"salary_data": salary_data}


# ---------------------------------------------------------------------------
# Direct run
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

