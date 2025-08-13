import React from "react";
import { Button } from "../Button/Button";
import frame from "./frame.svg";
import group2 from "./group-2.png";
import group3 from "./group-3.png";
import group4 from "./group-4.png";
import group5 from "./group-5.png";
import group6 from "./group-6.png";
import group8 from "./group-8.png";
import group from "./group.png";
import image from "./image.png";
import maskGroup2 from "./mask-group-2.png";
import maskGroup4 from "./mask-group-4.png";
import maskGroup7 from "./mask-group-7.png";
import "./HomePage.css";

export const HomePage = () => {
  return (
    <main className="home-page">
      <section className="hero">
        <header className="hero-header">
          <img className="hero-bg" src={group6} alt="Background" />
          <img className="hero-topbar" src={group8} alt="Topbar" />
          <img className="logo-icon" src={frame} alt="Logo icon" />
          <h1 className="logo-text">EdNova</h1>
          <nav className="hero-nav">
            <img src={maskGroup7} alt="Nav item" />
            <img src={maskGroup2} alt="Nav item" />
            <img src={maskGroup4} alt="Nav item" />
          </nav>
        </header>

        <div className="hero-content">
          <h2 className="hero-title">Learn Anytime, Anywhere</h2>
          <p className="hero-subtitle">
            Discover a world of knowledge at your fingertips with Ednova's
            extensive range of online courses.
          </p>
          <Button color="primary" size="medium">
            Browse Courses
          </Button>
        </div>

        <div className="hero-graphics">
          <img src={image} alt="Course 1" />
          <img src={group} alt="Overlay 1" />
          <img src={group4} alt="Course 2" />
          <img src={group3} alt="Overlay 2" />
          <img src={group2} alt="Course 3" />
          <img src={group5} alt="Overlay 3" />
        </div>
      </section>

      <section className="course-section">
        <article className="course-card">
          <img
            src={group3}
            alt="Graphic Design Basics"
            className="course-image"
          />
          <h3 className="course-title">Graphic Design Basics</h3>
          <p className="course-description">
            Learn the fundamentals of graphic design with our beginner-friendly
            course.
          </p>
          <p className="course-price">$49.99</p>
        </article>

        <article className="course-card">
          <img
            src={group4}
            alt="Digital Marketing Mastery"
            className="course-image"
          />
          <h3 className="course-title">Digital Marketing Mastery</h3>
          <p className="course-description">
            Master digital marketing techniques and grow your online presence.
          </p>
          <p className="course-price">$59.99</p>
        </article>

        <article className="course-card">
          <img
            src={group2}
            alt="Web Development Advanced"
            className="course-image"
          />
          <h3 className="course-title">Web Development Advanced</h3>
          <p className="course-description">
            Enhance your web development skills with our advanced course.
          </p>
          <p className="course-price">$69.99</p>
        </article>
      </section>
    </main>
  );
};