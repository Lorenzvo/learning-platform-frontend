// Tiny wrapper around fetch to centralize JSON headers + error handling.
// With the Vite proxy, can call: api('/api/courses') or api('/actuator/health')
export async function api(path, init) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
  if (!res.ok) {
    // Surface a readable error to the caller
    throw new Error(`${res.status} ${res.statusText}`)
  }
  // Some endpoints return 204 No Content
  return res.status === 204 ? null : res.json()
}
