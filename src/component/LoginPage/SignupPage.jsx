import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "src/lib/api.ts";
import { Button } from "../Button/Button";
import { TextField } from "src/component/TextField/TextField";
import group from "./group.png";
import "./LoginPage.css";

export const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await post("/api/auth/signup", { body: { email, password } });
      setSuccess("Account created! You can now log in.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Signup failed");
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
        <form className="login-form" aria-label="Signup Form" onSubmit={handleSubmit}>
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
          <div className="input-group modern-input">
            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
            <TextField
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              variant="outlined"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              aria-label="Confirm Password"
              required
              style={{ fontSize: '1rem', borderRadius: '8px', fontFamily: 'Inter, Roboto, sans-serif', padding: '10px 12px', border: '1px solid #e5e7eb', background: '#f8fafc' }}
            />
          </div>
          {error && (
            <div className="login-error" role="alert">{error}</div>
          )}
          {success && (
            <div className="login-error" style={{ background: '#dcfce7', color: '#166534' }} role="alert">{success}</div>
          )}
          <div className="button-group">
            <Button color="primary" size="large" type="submit" disabled={loading} aria-busy={loading} style={{ width: '100%', borderRadius: '8px', fontWeight: 600, fontSize: '1.1rem', padding: '12px 0' }}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </div>
        </form>
        <nav className="login-links sleek-links" aria-label="Secondary Navigation" style={{ marginTop: '18px' }}>
          <div className="link-row" style={{ justifyContent: 'center', display: 'flex' }}>
            <a href="/login" className="link left-link">
              Already have an account?
            </a>
          </div>
        </nav>
      </section>
    </main>
  );
};
