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
        <div className="courses-page__grid">
          {enrollments.map((enrollment) => (
            enrollment.status !== 'CANCELED' ? (
              <a
                key={enrollment.id || enrollment.courseId}
                href={`/courses/${enrollment.slug}`}
                className="courses-page__card-link"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article className="courses-page__card">
                  <img
                    src={enrollment.thumbnailUrl || 'https://via.placeholder.com/320x180?text=No+Image'}
                    alt={enrollment.courseTitle}
                    className="courses-page__image"
                  />
                  <div className="courses-page__content">
                    <h3 className="courses-page__title">{enrollment.courseTitle || 'Untitled Course'}</h3>
                    <p className="courses-page__description">{enrollment.shortDesc || enrollment.courseDescription || ''}</p>
                  </div>
                  <div className="courses-page__meta-row" style={{ alignItems: 'flex-end' }}>
                    <span className="courses-page__meta-pill courses-page__status" style={{ marginRight: '0', marginLeft: 'auto', alignSelf: 'flex-end' }}>
                      {enrollment.status || 'Active'}
                    </span>
                  </div>
                </article>
              </a>
            ) : (
              <article key={enrollment.id || enrollment.courseId} className="courses-page__card">
                <img
                  src={enrollment.thumbnailUrl || 'https://via.placeholder.com/320x180?text=No+Image'}
                  alt={enrollment.courseTitle}
                  className="courses-page__image"
                />
                <div className="courses-page__content">
                  <h3 className="courses-page__title">{enrollment.courseTitle || 'Untitled Course'}</h3>
                  <p className="courses-page__description">{enrollment.shortDesc || enrollment.courseDescription || ''}</p>
                </div>
                <div className="courses-page__meta-row" style={{ alignItems: 'flex-end' }}>
                  <a href={`/checkout?courseId=${enrollment.courseId}`} style={{ textDecoration: 'none', marginLeft: '0', alignSelf: 'flex-end' }}>
                    <Button color="primary" size="small" style={{ marginTop: '0.5rem', alignSelf: 'flex-end' }}>
                      Reactivate
                    </Button>
                  </a>
                  <span className="courses-page__meta-pill courses-page__status" style={{ marginRight: '0', marginLeft: 'auto', alignSelf: 'flex-end' }}>
                    {enrollment.status || 'Active'}
                  </span>
                </div>
              </article>
            )
          ))}
        </div>
      )}
    </section>
  );
};
