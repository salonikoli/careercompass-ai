import os
import json
from groq import Groq

# Load from environment — never hardcode secrets
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
MODEL = "llama-3.1-8b-instant"

def analyze_linkedin_profile(url: str, resume_skills: list, job_role: str) -> dict:
    try:
        client = Groq(api_key=GROQ_API_KEY)
        skills_str = ", ".join(resume_skills) if resume_skills else "general tech skills"
        
        url_context = f"They provided this LinkedIn URL to analyze: {url}" if url else "They want to optimize their profile completely from scratch using their resume."

        prompt = f"""You are an elite LinkedIn Career Coach & Technical Recruiter. 
The user is targeting a '{job_role}' role and has these exact verified skills extracted from their resume: {skills_str}.
{url_context}

Your objective is to provide a master-class, highly personalized "LinkedIn Optimization Strategy" that perfectly aligns their profile towards being a top-tier {job_role}. 
If a URL is provided, mention their URL handle/slug to personalize the advice. Make your tone encouraging, highly professional, and strictly actionable.

Respond as a JSON object strictly in this format:
{{
  "analysis": "A brief, highly personalized 3-sentence opening analysis.",
  "headline_suggestions": [
    "Optimized Headline Option 1 (using role + core skills + unique value)",
    "Optimized Headline Option 2",
    "Optimized Headline Option 3"
  ],
  "about_summary": "A fully polished, incredibly professional 150-word LinkedIn About section targeting {job_role}. Naturally weave in their resume skills.",
  "action_plan": [
    "Highly specific step 1 (e.g., 'Pin [Skill] to your top 3 skills')",
    "Highly specific step 2",
    "Highly specific step 3",
    "Highly specific step 4"
  ]
}}
"""
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1500,
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content.strip())
    except Exception as e:
        print(f"LinkedIn Optimizer Error: {e}")
        return {
            "error": True,
            "analysis": "We encountered an error connecting to the AI analyzer.",
            "headline_suggestions": [],
            "about_summary": "",
            "action_plan": []
        }
