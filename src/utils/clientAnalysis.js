/**
 * clientAnalysis.js
 * -----------------
 * Fully client-side resume analysis engine.
 * 1. Reads the PDF in the browser using PDF.js
 * 2. Extracts text
 * 3. Calls Groq AI directly from the browser
 * 4. Returns data in the EXACT same shape as the Python backend
 * Works on GitHub Pages, Netlify, Vercel — no server needed.
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ---------------------------------------------------------------------------
// Step 1: Extract text from PDF using PDF.js (browser-native)
// ---------------------------------------------------------------------------
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();

  // Dynamically import pdfjs-dist to keep bundle lean
  const pdfjsLib = await import('pdfjs-dist');

  // Set worker — use CDN worker to avoid bundling issues
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText.trim();
}

// ---------------------------------------------------------------------------
// Step 2: Call Groq AI with the resume text and get structured JSON analysis
// ---------------------------------------------------------------------------
async function callGroqAI(resumeText) {
  const prompt = `You are an expert career counselor and resume analyst. Analyze the following resume text and return a detailed JSON analysis.

RESUME TEXT:
${resumeText.substring(0, 8000)}

Return ONLY a valid JSON object with this EXACT structure (no markdown, no explanation, just JSON):
{
  "career_readiness_score": <integer 40-95>,
  "best_fit_job": "<job title string>",
  "best_fit_job_score": <integer 60-95>,
  "extracted_skills": ["skill1", "skill2", ...],
  "job_matches": [
    {
      "id": "job-1",
      "icon": "🤖",
      "title": "<job title>",
      "company_name": "<realistic company name>",
      "match_percentage": <integer 55-95>,
      "experience_level": "<Fresher|Junior|Intermediate|Senior>",
      "matched_skills": ["skill1", ...],
      "missing_skills": ["skill1", ...],
      "missing_critical": ["skill1", ...],
      "missing_secondary": ["skill1", ...],
      "recommended_courses": [],
      "time_estimate": "<X-Y weeks>",
      "candidate_comparison": "<Top X% of applicants|Average applicant pool>",
      "impact_insight": "<one sentence actionable insight>",
      "salary_range": "$XX,000 - $YY,000"
    }
  ],
  "top_3_matches": [<first 3 job_matches objects>],
  "insights": [
    {
      "id": "ins-1",
      "icon": "chart",
      "title": "<insight title>",
      "description": "<2-3 sentence description>",
      "boost": <integer 0-15>,
      "focus_skills": ["skill1", ...]
    }
  ],
  "roadmap": [
    { "step": 1, "skill": "<skill>", "is_core": true, "completed": false, "category": "<category>" }
  ],
  "roadmap_job": "<best fit job title>",
  "resume_audit": {
    "ats_score": <integer 40-90>,
    "structure_score": <integer 40-95>,
    "keyword_score": <integer 40-90>,
    "impact_score": <integer 30-90>,
    "readability": <integer 50-95>,
    "missing_keywords": ["keyword1", ...],
    "formatting_issues": ["issue1", ...]
  },
  "resume_suggestions": [
    {
      "section": "<Experience|Skills|Summary|Education>",
      "suggestion": "<specific actionable suggestion>",
      "impact": "<High|Medium|Low>"
    }
  ]
}

Rules:
- Generate 4-6 job matches relevant to the skills found in the resume
- Be realistic and specific to the actual skills in the resume
- Do not make up skills the person doesn't have
- Scores should reflect the actual quality of the resume
- Return ONLY the JSON, nothing else`;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  // Parse the JSON from the response
  // Strip any markdown code fences if present
  const jsonStr = content.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

  try {
    return JSON.parse(jsonStr);
  } catch (parseErr) {
    // Try to extract JSON from the response if there's extra text
    const match = jsonStr.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('AI returned invalid JSON. Please try again.');
  }
}

// ---------------------------------------------------------------------------
// Main exported function — mirrors the Python backend /api/upload response
// ---------------------------------------------------------------------------
export async function analyzeResumeClientSide(file) {
  // Step 1: Extract text
  const resumeText = await extractTextFromPDF(file);

  if (!resumeText || resumeText.length < 50) {
    throw new Error('Could not extract text from this PDF. Please make sure it is a text-based PDF, not a scanned image.');
  }

  // Step 2: Call Groq AI and get structured analysis
  const analysis = await callGroqAI(resumeText);

  // Step 3: Add filename and text preview
  analysis.filename = file.name;
  analysis.extracted_text_preview = resumeText.substring(0, 500) + '...';

  // Step 4: Ensure top_3_matches is populated (use first 3 job matches)
  if (!analysis.top_3_matches && analysis.job_matches) {
    analysis.top_3_matches = analysis.job_matches.slice(0, 3);
  }

  // Step 5: Move resume_audit into resume_audit key if needed
  if (!analysis.resume_audit && analysis.ats_score) {
    analysis.resume_audit = {
      ats_score: analysis.ats_score,
      structure_score: analysis.structure_score || 70,
      keyword_score: analysis.keyword_score || 70,
      impact_score: analysis.impact_score || 65,
      readability: analysis.readability || 75,
      missing_keywords: analysis.missing_keywords || [],
      formatting_issues: analysis.formatting_issues || [],
    };
  }

  return analysis;
}
