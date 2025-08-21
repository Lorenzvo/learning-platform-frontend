import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { post } from "src/lib/api.ts";
import { Button } from "../Button/Button";
import { TextField } from "src/component/TextField/TextField";
import group from "./group.png";
import "./LoginPage.css";

export const LoginPage = () => {
  // Accessibility: use label and aria attributes for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // POST to backend login endpoint (AuthController: /api/auth/login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const resp = await post("/api/auth/login", { body: { email, password } });
      console.log("Login response:", resp);
      console.log("Login token:", resp.token);
      // On success, store token and decode user info
      localStorage.setItem("jwt", resp.token);
  const decoded = jwtDecode(resp.token);
      // decoded.role should be "ADMIN" or "USER" (backend sets this)
      localStorage.setItem("user", JSON.stringify({
        email: decoded.email,
        roles: [decoded.role], // ensure array for compatibility
      }));
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-container">
        <header className="login-header">
          <img className="student-illustration" src={group} alt="Logo" />
          <div className="logo">
            <h1 className="logo-text">EdNova</h1>
          </div>
        </header>

        <form className="login-form" aria-label="Login Form" onSubmit={handleSubmit}>
          <div className="input-group modern-input">
            <label htmlFor="email" className="sr-only">Email</label>
            <TextField
              id="email"
              type="email"
              placeholder="Email"
              variant="outlined"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-label="Email"
              required
              style={{ fontSize: '1rem', borderRadius: '8px', fontFamily: 'Inter, Roboto, sans-serif', padding: '10px 12px', border: '1px solid #e5e7eb', background: '#f8fafc' }}
            />
          </div>
          <div className="input-group modern-input">
            <label htmlFor="password" className="sr-only">Password</label>
            <TextField
              id="password"
              type="password"
              placeholder="Password"
              variant="outlined"
              value={password}
              onChange={e => setPassword(e.target.value)}
              aria-label="Password"
              required
              style={{ fontSize: '1rem', borderRadius: '8px', fontFamily: 'Inter, Roboto, sans-serif', padding: '10px 12px', border: '1px solid #e5e7eb', background: '#f8fafc' }}
            />
          </div>
          {error && (
            <div className="login-error" role="alert">{error}</div>
          )}
          <div className="button-group">
            <Button color="primary" size="large" type="submit" disabled={loading} aria-busy={loading} style={{ width: '100%', borderRadius: '8px', fontWeight: 600, fontSize: '1.1rem', padding: '12px 0' }}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </form>

        <nav className="login-links sleek-links" aria-label="Secondary Navigation">
          <div className="link-row bottom-row">
            <a href="/signup" className="link left-link">
              Create Account
            </a>
            <a href="#" className="link right-link secondary">
              Forgot Password?
            </a>
          </div>
        </nav>
      </section>
    </main>
  );
};