// Grab the base API URL from Vite env variable.
// In dev, this comes from .env.development (http://localhost:8080).
const BASE = import.meta.env.VITE_API_URL

// Small helper to reduce boilerplate and centralize error handling.
// 'path' is a relative path like "/api/courses".
// 'init' is the usual fetch init (method, headers, body, etc.)
export async function api(path, init) {
  const res = await fetch(`${BASE}${path}`, {
    // Content-Type defaults to JSON for our API calls
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init
  })

  // For non-2xx responses, throw so the caller can handle it in .catch()
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)

  // If the API returns no content, return null; else parse JSON.
  return res.status === 204 ? null : res.json()
}