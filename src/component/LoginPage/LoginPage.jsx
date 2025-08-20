import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "src/lib/api.ts";
import { Button } from "../Button/Button";
import { TextField } from "src/component/TextField/TextField";
import frame from "./frame.svg";
import group2 from "./group-2.png";
import group from "./group.png";
import image from "./image.png";
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
      // On success, store accessToken and navigate
      localStorage.setItem("jwt", resp.accessToken);
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
          <img className="background-image" src={image} alt="Background" />
          <img className="student-illustration" src={group2} alt="Student" />
          <img className="icon-frame" src={frame} alt="Frame Icon" />
          <div className="logo">
            <img className="logo-icon" src={group} alt="Logo Icon" />
            <h1 className="logo-text">EdNova</h1>
          </div>
        </header>

        <form className="login-form" aria-label="Login Form" onSubmit={handleSubmit}>
          <div className="input-group">
            {/* Accessibility: label and aria-label for email */}
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
            />
          </div>
          <div className="input-group">
            {/* Accessibility: label and aria-label for password */}
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
            />
          </div>
          {error && (
            <div className="p-2 text-red-700 text-sm" role="alert">{error}</div>
          )}
          <div className="button-group">
            <Button color="primary" size="medium" type="submit" disabled={loading} aria-busy={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </form>

        <nav className="login-links" aria-label="Secondary Navigation">
          <div className="link-row">
            <a href="#" className="link">
              Create Account
            </a>
            <a href="#" className="link secondary">
              Forgot Password?
            </a>
          </div>
          <div className="link-row">
            <a href="#" className="link">
              Home
            </a>
            <a href="#" className="link">
              Courses
            </a>
          </div>
        </nav>
      </section>
    </main>
  );
};