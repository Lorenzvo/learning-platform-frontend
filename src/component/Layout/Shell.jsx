import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import frameSvg from "src/component/HomePage/frame.svg";
import cartBlue from "src/assets/cart-blue.png";

// navLink: Tailwind utility classes for consistent indigo/blue button styling
const navLink =
  "px-4 py-2 rounded-md font-medium text-indigo-600 hover:bg-indigo-50 transition";

/**
 * Shell layout component
 * Wraps all main routes/pages with a header and navigation bar.
 * Shows Home, Courses, Cart, Login/Logout, My Courses links.
 * - If JWT exists, shows "Logout" and "My Courses".
 * - If no JWT, shows "Login" instead.
 * - Handles logout by clearing JWT and redirecting to home.
 * - Uses Tailwind palette for consistent look.
 * - Children are rendered in the main content area.
 */
export function Shell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const jwt = localStorage.getItem("jwt");

  // Search bar state, prefill from query param if present
  const [search, setSearch] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("query") || "");
  }, [location.search]);

  // Cart preview state
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    if (jwt) {
      try {
        const items = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(Array.isArray(items) ? items : []);
      } catch {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [jwt]);

  function logout() {
    localStorage.removeItem("jwt");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with app name and navigation/search bar */}
      <header className="bg-white shadow flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6 w-full">
          {/* EdNova title with frame.svg as a cap over 'Ed' */}
          <div className="relative flex items-center" style={{ marginLeft: '-2.5rem' }}>
            <img
              src={frameSvg}
              alt="Ed cap"
              className="absolute left-9 -top-5 h-8 w-8"
              style={{ zIndex: 1 }}
            />
            <span
              className="text-3xl font-bold text-indigo-700 cursor-pointer select-none" style={{ paddingLeft: '2.625rem' }}
              onClick={() => navigate("/")}
              role="link"
              tabIndex={0}
              aria-label="Go to Home Page"
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/'); }}
            >
              EdNova
            </span>
          </div>
          {/* Search bar: longer, inline, white background, next to EdNova */}
          <form
            className="flex items-center"
            onSubmit={e => {
              e.preventDefault();
              if (search.trim()) navigate(`/courses?query=${encodeURIComponent(search.trim())}`);
            }}
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M20 20l-3.5-3.5"/></svg>
              </span>
              <input
                type="text"
                className="w-96 pl-10 pr-3 py-2 rounded-full border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-gray-900 bg-white placeholder-indigo-400 text-lg"
                placeholder="Search for courses"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search for courses"
                onFocus={e => e.target.placeholder = ''}
                onBlur={e => e.target.placeholder = 'Search for courses'}
              />
            </div>
          </form>
          {/* Navigation bar: cart icon and login/logout/my courses on right */}
          <nav className="flex gap-4 items-center ml-auto">
            {/* Cart icon image, with hover preview */}
            <div
              className="relative"
              onMouseEnter={() => setCartPreviewOpen(true)}
              onMouseLeave={() => setCartPreviewOpen(false)}
            >
              <img
                src={cartBlue}
                alt="Cart"
                className={`h-9 w-9 cursor-pointer transition-shadow ${cartPreviewOpen ? "shadow-lg shadow-indigo-400/60" : ""}`}
                onClick={() => navigate("/cart")}
                style={{ display: 'inline-block' }}
                aria-label="Cart"
              />
              {cartPreviewOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-indigo-100 z-50 p-4 text-sm animate-fadeIn">
                  <div className="font-semibold text-indigo-700 mb-2">Cart Preview</div>
                  {jwt ? (
                    cartItems.length > 0 ? (
                      <ul className="max-h-40 overflow-y-auto">
                        {cartItems.map((item, idx) => (
                          <li key={idx} className="py-1 border-b last:border-b-0 flex justify-between items-center">
                            <span>{item.title || item.name || `Item ${idx + 1}`}</span>
                            {item.price && <span className="text-indigo-500 font-medium">${item.price}</span>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-500">No items in your cart.</div>
                    )
                  ) : (
                    <div className="text-gray-500">No items in your cart.</div>
                  )}
                </div>
              )}
            </div>
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
        {/* Show current route for accessibility/debugging (hidden visually) */}
        <span className="text-xs text-gray-400 sr-only">{location.pathname}</span>
      </header>
      {/* Main content area, children are rendered here */}
      <main className="max-w-4xl mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
}
