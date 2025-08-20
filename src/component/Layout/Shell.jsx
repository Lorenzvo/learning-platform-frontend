import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Tailwind palette: indigo/blue
const navLink =
  "px-4 py-2 rounded-md font-medium text-indigo-600 hover:bg-indigo-50 transition";

export function Shell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const jwt = localStorage.getItem("jwt");

  function logout() {
    localStorage.removeItem("jwt");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-bold text-indigo-700">EdNova</span>
          <nav className="flex gap-2">
            <button className={navLink} onClick={() => navigate("/")}>Home</button>
            <button className={navLink} onClick={() => navigate("/courses")}>Courses</button>
            <button className={navLink} onClick={() => navigate("/cart")}>Cart</button>
            {jwt ? (
              <>
                <button className={navLink} onClick={() => navigate("/my-courses")}>My Courses</button>
                <button className={navLink} onClick={logout}>Logout</button>
              </>
            ) : (
              <button className={navLink} onClick={() => navigate("/login")}>Login</button>
            )}
          </nav>
        </div>
        {/* Optionally show current route for a11y/debug */}
        <span className="text-xs text-gray-400">{location.pathname}</span>
      </header>
      <main className="max-w-4xl mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
}
