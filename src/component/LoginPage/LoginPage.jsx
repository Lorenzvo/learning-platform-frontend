import React from "react";
import { Button } from "../Button/Button";
import { TextField } from "src/component/TextField/TextField";
import frame from "./frame.svg";
import group2 from "./group-2.png";
import group from "./group.png";
import image from "./image.png";
import "./LoginPage.css";

export const LoginPage = () => {
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

        <form className="login-form" aria-label="Login Form">
          <div className="input-group">
            <TextField placeholder="Email" variant="outlined" />
          </div>
          <div className="input-group">
            <TextField placeholder="Password" variant="outlined" />
          </div>
          <div className="button-group">
            <Button color="primary" size="medium">
              Sign In
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