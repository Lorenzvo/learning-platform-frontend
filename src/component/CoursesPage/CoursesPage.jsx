import React from "react";
import { Button } from "../Button/Button";
import frame from "./frame.svg";
import group3 from "./group-3.png";
import group5 from "./group-5.png";
import group7 from "./group-7.png";
import group8 from "./group-8.png";
import group11 from "./group-11.png";
import group12 from "./group-12.png";
import "./CoursesPage.css";

const courses = [
  {
    title: "Java Basics",
    description: "Learn the fundamentals of Java programming.",
    price: "$49",
    image: group3,
  },
  {
    title: "Full-Stack Web Development",
    description: "Become a versatile web developer.",
    price: "$149",
    image: group5,
  },
  {
    title: "UI/UX Design",
    description: "Master the art of user interface and experience design.",
    price: "$79",
    image: group7,
  },
  {
    title: "AWS Cloud Practitioner",
    description: "Understand the core services of AWS.",
    price: "$99",
    image: group8,
  },
  {
    title: "Data Analytics with Python",
    description: "Analyze data efficiently using Python tools.",
    price: "$89",
    image: group11,
  },
  {
    title: "Cybersecurity Essentials",
    description: "Learn key cybersecurity principles.",
    price: "$109",
    image: group12,
  },
];

export const CoursesPage = () => {
  return (
    <section className="courses-page">
      <header className="courses-page__header">
        <h2>Our Courses</h2>
        <div className="courses-page__controls">
          <div className="courses-page__select">
            <span>Sort by</span>
            <img src={frame} alt="Sort icon" />
          </div>
          <div className="courses-page__select">
            <span>Filter by Category</span>
            <img src={frame} alt="Filter icon" />
          </div>
          <div className="courses-page__search">
            <input
              type="text"
              placeholder="Search courses"
              aria-label="Search courses"
            />
          </div>
        </div>
      </header>

      <div className="courses-page__grid">
        {courses.map((course) => (
          <article key={course.title} className="courses-page__card">
            <img
              src={course.image}
              alt={course.title}
              className="courses-page__image"
            />
            <div className="courses-page__content">
              <h3 className="courses-page__title">{course.title}</h3>
              <p className="courses-page__description">{course.description}</p>
              <span className="courses-page__price">{course.price}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="courses-page__footer">
        <Button color="primary" size="medium">
          Load More
        </Button>
      </div>
    </section>
  );
};