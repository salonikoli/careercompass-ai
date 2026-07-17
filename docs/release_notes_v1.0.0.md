# AI Career Mentor — Version 1.0.0 Release Notes

**Release Date:** May 30, 2026  
**Version:** `v1.0.0`  
**License:** MIT  
**Award:** 🏆 *2nd Prize — HACKFEST (MOBIUS 2K26), Thiagarajar College of Engineering*

---

## 🌟 Welcome to Version 1.0.0!

We are proud to announce the official stable production release of **AI Career Mentor**! This version represents the transition from a hackathon prototype into a recruiter-grade, open-source-grade showcase application. The platform has been fully hardened, optimized for the Render Free tier, and cleaned of legacy and duplicate code paths.

---

## 🚀 Key Features

### 1. 📄 3-Tier Resume Upload & Parsing
* Read resume text directly in the browser via `pdfjs-dist` (Tier 1: Client-side parsing).
* Seamless fallback to standard FastAPI endpoints `pdfplumber` and `pypdf` (Tier 2: Deployed Backend parsing).
* Graceful fallback to rich static data in offline/guest mode (Tier 3: Demo Mode).

### 2. 🤖 Interactive AI Career Copilot
* Fully integrated context-aware chat interface powered by **Groq AI (llama-3.1-8b-instant)**.
* Copilot detects user intents (e.g. "fix my resume" or "help me practice interviews") and automatically navigates the dashboard tabs for the user.

### 3. 🎯 Resume Audit & ATS Deep Analysis
* Visual 5-dimensional resume score cards (Skills, ATS Score, Certifications, Projects, Experience).
* SVG spider/radar charts displaying score dimensions.
* Dynamic checklist of ATS compatibility indicators and ranked priority improvement actions.
* Schema normalization allows the frontend to parse both client-side Groq analysis and Python backend scores without crashes.

### 4. 💼 Job Mapping & Skill Gap Roadmaps
* Match resumes against 15+ tech roles with weighted scoring (Core Skills = 70%, Other = 30%).
* Generate interactive learning roadmaps with curated course recommendations from a database of over 70 courses.

### 5. 💰 Salary Insights & LinkedIn Profile Optimizer
* Full entry/mid/senior salary distributions across all roles with remote-friendly indicators.
* Personalized profile optimization checklists generated using resume text.

---

## 🛠️ Performance & Security Hardening (v1.0.0)

* **spaCy Removal:** Removed the massive `spaCy` NLP dependency. Skill extraction now utilizes a high-precision, optimized regex-based keyword matching algorithm with word boundaries (`\b`), reducing backend RAM overhead by **>90%** and fixing Render build OOM failures.
* **API Route Security:** Centralized all API endpoints through `API_BASE` (`config.js`). Hardcoded localhosts and relative URLs causing 405 Method Not Allowed errors on GitHub Pages have been completely eliminated.
* **CORS Restrictions:** Locked API endpoints to specific origins (GitHub Pages and local Vite development URLs). Allow Credentials disabled for safety.
* **Locked Python Environment:** Added a `.python-version` file at the root directory to pin Render to Python `3.11.0`, ensuring a stable, reproducible virtual environment.
* **Vite Chunk Splitting:** Split large vendor libraries (`react`, `react-dom`) and dynamic PDF parsing dependencies to maintain a lightweight initial asset payload size of **<140KB**.

---

## 📋 Deployed URLs
* **Frontend Web Application:** `https://prasannaganesann.github.io/AI-Career-Mentor/`
* **Production API Server:** `https://ai-career-mentor-api-2olt.onrender.com`
* **API Health Check:** `https://ai-career-mentor-api-2olt.onrender.com/health`
