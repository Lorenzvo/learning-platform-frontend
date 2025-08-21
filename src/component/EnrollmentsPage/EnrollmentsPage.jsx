import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../../lib/api.ts";
import { Button } from "../Button/Button";
import "./EnrollmentsPage.css";


export const EnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;


  const location = useLocation();
  // Reset to first page whenever location changes to /enrollments
  useEffect(() => {
    if (location.pathname === "/enrollments") {
      setPage(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/enrollments") {
      setLoading(true);
      api(`/api/enrollments/me?page=${page}&size=${pageSize}`)
        .then(data => {
          setEnrollments(Array.isArray(data?.content) ? data.content : []);
          setTotalPages(typeof data?.totalPages === 'number' ? data.totalPages : 1);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message || "Failed to load enrollments");
          setLoading(false);
        });
    }
  }, [location.pathname, page]);

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
        <>
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
          {/* Pagination controls */}
          <div className="courses-page__footer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
            <Button
              color="secondary"
              size="small"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              ←
            </Button>
            {[...Array(totalPages)].map((_, idx) => (
              <Button
                key={idx}
                color={idx === page ? "primary" : "gray"}
                size="small"
                onClick={() => setPage(idx)}
                style={{ fontWeight: idx === page ? 700 : 400 }}
              >
                {idx + 1}
              </Button>
            ))}
            <Button
              color="secondary"
              size="small"
              disabled={page === totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              →
            </Button>
          </div>
        </>
      )}
    </section>
  );
};
