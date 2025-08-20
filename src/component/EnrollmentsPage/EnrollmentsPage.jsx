import React, { useEffect, useState } from "react";
import { api } from "../../lib/api.ts";
import { Button } from "../Button/Button";
import "./EnrollmentsPage.css";

export const EnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api("/api/enrollments/me")
      .then(data => {
        setEnrollments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to load enrollments");
        setLoading(false);
      });
  }, []);

  return (
    <section className="enrollments-page">
      <header className="enrollments-page__header">
        <h2>My Enrollments</h2>
      </header>
      {loading && <div className="enrollments-loading">Loading...</div>}
      {error && !loading && <div className="enrollments-error">{error}</div>}
      {!loading && !error && enrollments.length === 0 && (
        <div className="enrollments-empty">
          You are not enrolled in any courses.<br />
          <Button color="primary" size="medium" onClick={() => window.location.href = '/courses'}>
            Browse Courses
          </Button>
        </div>
      )}
      {!loading && !error && enrollments.length > 0 && (
        <div className="enrollments-page__grid">
          {enrollments.map((enrollment) => (
            <article key={enrollment.id || enrollment.courseId} className="enrollments-page__card">
              <img
                src={enrollment.courseThumbnailUrl || 'https://via.placeholder.com/320x180?text=No+Image'}
                alt={enrollment.courseTitle}
                className="enrollments-page__image"
              />
              <div className="enrollments-page__content">
                <h3 className="enrollments-page__title">{enrollment.courseTitle || 'Untitled Course'}</h3>
                <p className="enrollments-page__description">{enrollment.courseDescription || ''}</p>
                <span className="enrollments-page__status">Status: {enrollment.status || 'Active'}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
