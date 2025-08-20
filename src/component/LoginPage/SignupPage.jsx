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
          <img className="background-image" src={image} alt="Background" />
          <img className="student-illustration" src={group2} alt="Student" />
          <img className="icon-frame" src={frame} alt="Frame Icon" />
          <div className="logo">
            <img className="logo-icon" src={group} alt="Logo Icon" />
            <h1 className="logo-text">EdNova</h1>
          </div>
        </header>
        <form className="login-form" aria-label="Signup Form" onSubmit={handleSubmit}>
          <div className="input-group">
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
          <div className="input-group">
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
            />
          </div>
          {error && (
            <div className="p-2 text-red-700 text-sm" role="alert">{error}</div>
          )}
          {success && (
            <div className="p-2 text-green-700 text-sm" role="alert">{success}</div>
          )}
          <div className="button-group">
            <Button color="primary" size="medium" type="submit" disabled={loading} aria-busy={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </div>
        </form>
        <nav className="login-links" aria-label="Secondary Navigation">
          <div className="link-row">
            <a href="/login" className="link">Already have an account?</a>
          </div>
        </nav>
      </section>
    </main>
  );
};
