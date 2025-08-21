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
  if (opts.headers["Authorization"]) {
    console.log("API request Authorization header:", opts.headers["Authorization"]);
  } else {
    console.log("API request: No Authorization header sent");
  }
  if (opts.body && typeof opts.body !== "string") {
    opts.body = JSON.stringify(opts.body);
  }
  let res = await fetch(url, opts);
  let data;
  try {
    data = await res.json();
  } catch {
    data = undefined;
  }
  // If token expired (401), try to refresh only if JWT is present
  const jwt = localStorage.getItem("jwt");
  if (res.status === 401 && path !== "/api/auth/refresh" && jwt) {
    try {
      const refreshRes = await fetch(API_BASE + "/api/auth/refresh", { method: "POST", credentials: "include" });
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        if (refreshData.accessToken) {
          localStorage.setItem("jwt", refreshData.accessToken);
          opts.headers["Authorization"] = `Bearer ${refreshData.accessToken}`;
          res = await fetch(url, opts);
          try {
            data = await res.json();
          } catch {
            data = undefined;
          }
        }
      } else {
        // Refresh failed, log out
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        // Show message and delay redirect
        if (!document.getElementById('session-expired-toast')) {
          const toast = document.createElement('div');
          toast.id = 'session-expired-toast';
          toast.textContent = 'Session expired. Redirecting to login…';
          toast.style.position = 'fixed';
          toast.style.top = '24px';
          toast.style.left = '50%';
          toast.style.transform = 'translateX(-50%)';
          toast.style.background = '#3730a3';
          toast.style.color = '#fff';
          toast.style.padding = '1rem 2rem';
          toast.style.borderRadius = '8px';
          toast.style.zIndex = '9999';
          document.body.appendChild(toast);
        }
        setTimeout(() => {
          window.location.href = "/login";
        }, 60000);
        throw new Error("Session expired. Please log in again.");
      }
    } catch {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      // Show message and delay redirect
      if (!document.getElementById('session-expired-toast')) {
        const toast = document.createElement('div');
        toast.id = 'session-expired-toast';
        toast.textContent = 'Session expired. Redirecting to login…';
        toast.style.position = 'fixed';
        toast.style.top = '24px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = '#3730a3';
        toast.style.color = '#fff';
        toast.style.padding = '1rem 2rem';
        toast.style.borderRadius = '8px';
        toast.style.zIndex = '9999';
        document.body.appendChild(toast);
      }
      setTimeout(() => {
        window.location.href = "/login";
      }, 60000);
      throw new Error("Session expired. Please log in again.");
    }
  }
  if (!res.ok) {
    const err: any = new Error((data && data.message) || res.statusText);
    err.code = (data && data.code) || res.status;
    err.message = (data && data.message) || res.statusText;
    throw err;
  }
  return data; // Fixed return statement
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

export function put(path: string, options: any = {}) {
  return api(path, { ...options, method: "PUT" });
}