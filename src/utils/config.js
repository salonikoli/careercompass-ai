/**
 * config.js — Centralized API configuration
 * ------------------------------------------
 * Single source of truth for the backend API base URL.
 *
 * Resolution order:
 *   1. VITE_API_URL env var (set at build time for production → deployed Render backend)
 *   2. '/api'  (falls through to Vite dev-server proxy → localhost:8000 in local dev)
 *
 * All components and utils MUST import API_BASE from here.
 * NEVER hardcode 'http://localhost:8000' anywhere.
 */

export const API_BASE = (() => {
  const envUrl = import.meta.env.VITE_API_URL;
  // If env var is set AND is not the default placeholder, use it directly
  if (envUrl && envUrl !== 'http://localhost:8000' && envUrl.startsWith('http')) {
    // Strip trailing slash for consistency
    return envUrl.replace(/\/$/, '');
  }
  // Local dev: Vite proxy routes /api/* → localhost:8000
  return '/api';
})();

/**
 * Whether a real deployed backend is configured.
 * Used by components to decide fallback strategies.
 */
export const HAS_DEPLOYED_BACKEND = (() => {
  const envUrl = import.meta.env.VITE_API_URL;
  return !!(envUrl && envUrl.startsWith('https://'));
})();

/**
 * Whether the Groq client-side key is available.
 */
export const HAS_GROQ_KEY = (() => {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  return !!(key && key.length > 10 && key !== 'your_groq_api_key_here');
})();
