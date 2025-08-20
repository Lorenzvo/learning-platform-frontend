// src/lib/api.ts
// API helper for HTTP requests. Usage:
//   import { api, get, post, del } from "../lib/api";
//   const data = await get("/courses");
//   const resp = await post("/login", { body: { username, password } });
//
// Throws on non-2xx responses with error { code, message } if available.
//
// Error surface:
//   try {
//     await get("/bad-path");
//   } catch (err) {
//     // err.code, err.message
//   }

const API_BASE = import.meta.env.VITE_API_BASE || "";

function getToken() {
  return localStorage.getItem("jwt") || "";
}

function buildHeaders(options: any = {}) {
  const headers: Record<string, string> = {
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

export async function api(path: string, options: any = {}) {
  const url = API_BASE + path;
  const opts = {
    method: options.method || "GET",
    headers: buildHeaders(options),
    ...options,
  };
  if (opts.body && typeof opts.body !== "string") {
    opts.body = JSON.stringify(opts.body);
  }
  const res = await fetch(url, opts);
  let data;
  try {
    data = await res.json();
  } catch {
    data = undefined;
  }
  if (!res.ok) {
    const err: any = new Error((data && data.message) || res.statusText);
    err.code = (data && data.code) || res.status;
    err.message = (data && data.message) || res.statusText;
    throw err;
  }
  return data;
}

export function get(path: string, options: any = {}) {
  return api(path, { ...options, method: "GET" });
}

export function post(path: string, options: any = {}) {
  return api(path, { ...options, method: "POST" });
}

export function del(path: string, options: any = {}) {
  return api(path, { ...options, method: "DELETE" });
}
