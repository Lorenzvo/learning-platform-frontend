import React, { useEffect, useState } from "react";
import { Button } from "../Button/Button";
import { api } from "../../lib/api.ts";
import frame from "./frame.svg";
import "./CoursesPage.css";
export const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  // Fetch courses from backend
  useEffect(() => {
    setLoading(true);
    setError(null);
      api(`/api/courses?page=${page}${search ? `&q=${encodeURIComponent(search)}` : ""}`)
        .then(data => {
          console.log('Courses API response:', data);
          setCourses(Array.isArray(data?.content) ? data.content : []);
          setLoading(false);
        })
      .catch(err => {
        setError(err.message || "Failed to load courses");
        setLoading(false);
      });
  }, [page, search]);

  // Handler for search box
  const handleSearch = e => {
    e.preventDefault();
    setPage(1);
    setSearch(e.target.elements.q.value.trim());
  };

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
            <form onSubmit={handleSearch}>
              <input
                type="text"
                name="q"
                placeholder="Search courses"
                aria-label="Search courses"
                defaultValue={search}
              />
              <Button color="primary" size="small" type="submit">Search</Button>
            </form>
          </div>
        </div>
      </header>

      {/* Loading state */}
      {loading && (
        <div className="courses-loading">Loading...</div> // Show skeleton or loading
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="courses-error">{error}</div>
      )}

      {/* Empty state */}
      {!loading && !error && courses.length === 0 && (
        <div className="courses-empty">No courses found.</div>
      )}

      {/* Courses grid */}
      {!loading && !error && courses.length > 0 && (
        <div className="courses-page__grid">
          {courses.map((course) => (
            <article key={course.id || course.title} className="courses-page__card">
              <img
                src={'https://via.placeholder.com/320x180?text=No+Image'}
                alt={course.title}
                className="courses-page__image"
              />
              <div className="courses-page__content">
                <h3 className="courses-page__title">{course.title}</h3>
                <p className="courses-page__description">{course.description}</p>
                {typeof course.priceCents === 'number' && (
                  <span className="courses-page__price">
                    ${(course.priceCents / 100).toFixed(2)}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="courses-page__footer">
        <Button color="primary" size="medium">
          Load More
        </Button>
      </div>
    </section>
  );
};