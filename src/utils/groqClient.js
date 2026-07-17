/**
 * groqClient.js
 * -------------
 * Direct Groq API client for frontend (client-side).
 * Generates role-specific interview questions via llama-3.1-8b-instant.
 * Falls back gracefully if the API fails.
 *
 * ⚠️  API key is read from VITE_GROQ_API_KEY environment variable.
 *     Copy .env.example → .env and fill in your key. Never commit .env.
 */

// Read from Vite env — set VITE_GROQ_API_KEY in your .env file
const GROQ_API_KEY  = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_MODEL    = 'llama-3.1-8b-instant';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

// Simple in-memory cache: key = `${role}-${difficulty}` → questions[]
const CACHE = new Map();

/**
 * generateInterviewQuestions
 * --------------------------
 * @param {string} role       — e.g. "Data Scientist", "ML Engineer"
 * @param {string} difficulty — "Easy" | "Medium" | "Hard"
 * @returns {Promise<Array>}  — array of question objects
 */
export async function generateInterviewQuestions(role = 'Software Engineer', difficulty = 'Medium') {
  const cacheKey = `${role}-${difficulty}`;
  if (CACHE.has(cacheKey)) return CACHE.get(cacheKey);

  const prompt = `Generate exactly 5 interview questions for a ${role} position at ${difficulty} level.

Include:
- 3 technical questions specific to ${role} technologies and concepts
- 2 behavioral questions using STAR format

Return ONLY a valid JSON array with NO markdown, NO explanation, NO extra text.
Each item must have: question (string), options (array of exactly 4 strings), correctAnswer (string matching one option exactly), explanation (string 1-2 sentences), type ("Technical" or "Behavioral"), difficulty ("${difficulty}").

Example format:
[{"question":"...","options":["A","B","C","D"],"correctAnswer":"A","explanation":"...","type":"Technical","difficulty":"${difficulty}"}]`;

  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: 'You are an expert technical interviewer. Always respond with valid JSON arrays only. No markdown, no code blocks, no explanation outside the JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1800,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const raw  = data.choices?.[0]?.message?.content?.trim() || '[]';

  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();

  let questions;
  try {
    questions = JSON.parse(cleaned);
  } catch {
    throw new Error('Groq returned malformed JSON. Using fallback questions.');
  }

  // Normalize fields: ensure correct_index exists for QuestionCard
  const normalized = questions.map(q => ({
    q:             q.question || q.q || 'Question unavailable',
    options:       Array.isArray(q.options) ? q.options : [],
    correct_index: Array.isArray(q.options) ? q.options.indexOf(q.correctAnswer) : 0,
    hint:          q.explanation || 'No explanation provided.',
    type:          q.type || 'Technical',
    difficulty:    q.difficulty || difficulty,
    source:        'groq',
  }));

  CACHE.set(cacheKey, normalized);
  return normalized;
}

/** Clear cache for a specific role (force refresh) */
export function clearQuestionCache(role, difficulty) {
  CACHE.delete(`${role}-${difficulty}`);
}
