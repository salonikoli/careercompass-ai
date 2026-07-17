"""
skill_extractor.py
------------------
Extracts skills from resume text using:
1. spaCy NLP token matching (preferred)
2. Keyword-based regex fallback

Performance fix: spaCy model is loaded ONCE at module import time,
not on every function call. This prevents a 2–4s cold start per request.
"""

import re
from typing import List

# spaCy removed to prevent Render build failure and OOM issues on Free tier.
# Optimized regex-based keyword matching is used as the sole extraction mechanism.
_SPACY_AVAILABLE = False


# Master list of all trackable skills (lowercased, deduplicated)
MASTER_SKILLS = [
    # Programming Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "r", "scala", "go", "rust",
    "kotlin", "swift", "php", "ruby", "matlab", "solidity", "assembly", "c", "embedded c", "golang",
    # Web
    "html", "css", "react", "angular", "vue", "nodejs", "node.js", "express", "django",
    "flask", "fastapi", "rest api", "graphql", "webpack", "responsive design", "web performance",
    "nextjs", "accessibility", "css animations",
    # Data / ML / AI
    "machine learning", "deep learning", "nlp", "natural language processing", "computer vision",
    "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn", "transformers", "hugging face",
    "openai", "llm", "generative ai", "reinforcement learning", "neural networks",
    # Data Engineering / Analysis
    "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "spark", "hadoop",
    "pandas", "numpy", "matplotlib", "seaborn", "tableau", "power bi", "data visualization",
    "data analysis", "data engineering", "etl", "data warehousing", "statistics",
    "airflow", "kafka", "excel", "reporting", "oracle db",
    # Cloud / DevOps
    "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "terraform", "ansible",
    "jenkins", "ci/cd", "devops", "linux", "bash", "git", "github", "gitlab",
    "monitoring", "prometheus", "grafana", "cloud computing", "microservices", "api design",
    # Security / Networking
    "cybersecurity", "network security", "penetration testing", "cryptography", "siem",
    "incident response", "firewall", "vulnerability assessment", "networking", "routing",
    "switching", "vpn", "cisco",
    # QA / Testing
    "selenium", "unit testing", "test automation", "api testing", "regression testing",
    "postman", "jira", "agile", "scrum",
    # UI/UX Design
    "figma", "wireframing", "user research", "prototyping", "ui design", "ux design",
    "adobe xd", "sketch", "design systems",
    # Business / PM
    "product strategy", "roadmapping", "stakeholder management", "a/b testing",
    "communication", "data warehousing",
    # Embedded / Hardware
    "rtos", "microcontrollers", "arm", "iot", "can bus", "shell scripting",
    # Blockchain / Web3
    "ethereum", "smart contracts", "web3.js", "hardhat", "defi", "nft", "blockchain",
    # Technical Writing / Docs
    "technical writing", "documentation", "markdown", "api documentation", "confluence",
    # MLOps / Infra
    "mlops", "cost optimization", "performance tuning", "backup & recovery",
    # Mobile
    "react native", "flutter", "firebase", "mobile ui", "push notifications", "app store deployment",
]

# Deduplicate while preserving order
_deduped = []
_seen_skills = set()
for _s in MASTER_SKILLS:
    if _s not in _seen_skills:
        _seen_skills.add(_s)
        _deduped.append(_s)
MASTER_SKILLS = _deduped


def extract_skills_keyword(text: str) -> List[str]:
    """
    Keyword-based skill extraction.
    Searches for each master skill as a word/phrase in the resume text.
    """
    text_lower = text.lower()
    found = []
    for skill in MASTER_SKILLS:
        # Use word boundary for single-word skills, substring for multi-word
        if " " in skill:
            if skill in text_lower:
                found.append(skill)
        else:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                found.append(skill)
    return list(set(found))


def extract_skills(text: str) -> List[str]:
    """
    Main entry point for skill extraction.
    Uses optimized regex-based keyword matching with word boundaries.
    """
    if not text or not text.strip():
        return []
    skills = extract_skills_keyword(text)
    # Sort alphabetically for consistent output
    return sorted(skills)
