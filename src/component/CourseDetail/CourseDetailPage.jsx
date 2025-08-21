// Helper to check for valid thumbnail URL
function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  // Optionally check for valid image extension
  if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|svg|webp)$/i.test(trimmed)) return false;
  return true;
}
import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { api } from "../../lib/api.ts";
import { useCart } from "../../context/useCart";
import { Button } from "../Button/Button";
import "./CourseDetailPage.css";

export const CourseDetailPage = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [redirecting, setRedirecting] = useState(false);
  const [openModuleIdx, setOpenModuleIdx] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const { add } = useCart();

  useEffect(() => {
    Promise.all([
      api(`/api/courses/${slug}`),
      api("/api/enrollments/me")
    ])
      .then(([courseData, enrollmentsData]) => {
        setCourse(courseData);
        // Use .content for paginated enrollments
        if (enrollmentsData && Array.isArray(enrollmentsData.content)) {
          setEnrollments(enrollmentsData.content);
        } else if (Array.isArray(enrollmentsData)) {
          setEnrollments(enrollmentsData);
        } else {
          setEnrollments([]);
        }
        setError(null);
      })
      .catch(e => {
        const msg = (e.message || '').toLowerCase();
        const notLoggedIn = !localStorage.getItem('jwt');
        if (
          e.code === 401 || e.status === 401 ||
          msg.includes('unauthorized') || msg.includes('not authorized') ||
          (msg.includes('course not found') && notLoggedIn)
        ) {
          setRedirecting(true);
          window.location.href = '/login';
        } else {
          setError(e.message);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const enrolled = enrollments.some(e => e.courseId === course?.id);

  const handleAddToCart = async () => {
    console.log("handleAddToCart fired", course);
    if (!course || !course.id) {
      setToast("Course ID not available");
      setTimeout(() => setToast(""), 2000);
      return;
    }
    try {
      await add(course.id);
      setToast("Added to cart");
    } catch (err) {
      setToast(err.message || "Failed to add to cart");
    }
    setTimeout(() => setToast(""), 2000);
  };

  console.log("Rendering CourseDetailPage", course, course?.id);
  if (loading) return <div className="course-detail-loading">Loading…</div>;
  if (redirecting) return null;
  if (error) return <div className="course-detail-error">Error: {error}</div>;
  if (!course) return <div className="course-detail-empty">Course not found.</div>;
  console.log("Thumbnail URL:", course && course.thumbnailUrl);
  // ...existing code...

  return (
    <section className="course-detail-page">
      <header className="course-detail-header" style={{display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '2rem'}}>
        <img
          src={isValidUrl(course.thumbnailUrl) ? course.thumbnailUrl : '/vite.svg'}
          alt={course.title}
          style={{width: '260px', height: '180px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 2px 16px rgba(80,112,255,0.12)'}}
        />
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <h2 className="course-detail-title" style={{fontSize: '2.2rem', fontWeight: 700, color: '#4f46e5', marginBottom: '0.5rem'}}>{course.title}</h2>
          {course.instructor && (
            <div className="course-detail-instructor" style={{fontSize: '1.2rem', color: '#374151', marginBottom: '0.3rem', fontWeight: 500}}>
              Instructor: {course.instructor.name}
            </div>
          )}
          <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
            <span className="course-detail-level" style={{fontSize: '1.1rem', color: '#6b7280', background: '#e0e7ff', borderRadius: '6px', padding: '4px 16px'}}>{course.level}</span>
            {!enrolled && (
              <span className="course-detail-price" style={{fontSize: '1.2rem', fontWeight: 600, color: '#2563eb', marginLeft: '0.8rem'}}>${(course.price / 100).toFixed(2)}</span>
            )}
          </div>
        </div>
      </header>
      <div className="course-detail-description" style={{color: '#111', fontSize: '1.08rem', marginBottom: '2rem', lineHeight: 1.7}}>{course.longDesc}</div>
      {/* Reviews summary */}
      <div className="course-detail-reviews-summary" style={{marginBottom: '1.5rem'}}>
        {course.reviewCount > 0 ? (
          <span style={{fontWeight: 600, color: '#3730a3'}}>Reviews: {course.avgRating.toFixed(1)} / 5 ({course.reviewCount})</span>
        ) : (
          <span>No reviews yet</span>
        )}
      </div>
      {/* Modules */}
      <div className="course-detail-modules">
        <h3 style={{marginBottom: '1rem', fontWeight: 600, color: '#3730a3'}}>Modules</h3>
        {course.modules.length === 0 && <div>No modules yet.</div>}
        {course.modules.map((mod, idx) => (
          <div key={mod.id || idx} className="course-detail-module">
            <div
              className="course-detail-module-title"
              onClick={() => setOpenModuleIdx(openModuleIdx === idx ? null : idx)}
              style={{cursor: enrolled ? 'pointer' : 'not-allowed'}}
            >
              {mod.title}
              {enrolled && (
                <span style={{fontSize: '1.2rem', marginLeft: '0.5rem'}}>{openModuleIdx === idx ? '▲' : '▼'}</span>
              )}
            </div>
            {/* Only allow expansion if enrolled */}
            {enrolled && openModuleIdx === idx ? (
              <ul className="course-detail-lessons">
                {mod.lessons.map(lesson => (
                  <li key={lesson.id} className="course-detail-lesson">
                    <span>
                      {lesson.title} {lesson.isDemo ? <span className="demo-badge">Demo</span> : null}
                    </span>
                    {(enrolled || lesson.isDemo) && (
                      <Button
                        color="primary"
                        size="small"
                        onClick={() => {
                          if (lesson.contentUrl) {
                            window.open(lesson.contentUrl, "_blank", "noopener,noreferrer");
                          }
                        }}
                      >
                        Play
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : !enrolled ? (
              <div className="course-detail-locked">Enroll to view lessons</div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Reviews section at bottom */}
      <div className="course-detail-reviews-list" style={{marginTop: '2.5rem', padding: '2rem 0', borderTop: '1px solid #e5e7eb'}}>
        <h3 style={{fontWeight: 600, color: '#3730a3', marginBottom: '1rem'}}>Recent Reviews</h3>
        {course.recentReviews && course.recentReviews.length > 0 ? (
          course.recentReviews.map((review, idx) => (
            <div key={review.id || idx} className="course-detail-review" style={{marginBottom: '1.2rem', paddingBottom: '1.2rem', borderBottom: '1px solid #f3f4f6'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.7rem'}}>
                <span style={{fontWeight: 500, color: '#2563eb'}}>{review.userName || review.userId}</span>
                <span style={{color: '#f59e42', fontWeight: 700}}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                <span style={{fontSize: '0.95rem', color: '#6b7280'}}>{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{marginTop: '0.5rem', color: '#111', fontSize: '1.05rem'}}>{review.text || review.comment}</div>
            </div>
          ))
        ) : (
          <div>No reviews yet.</div>
        )}

        {/* Review form for enrolled users */}
        {enrolled && (
          <div className="course-detail-review-form" style={{marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '10px', boxShadow: '0 2px 8px rgba(80,112,255,0.06)'}}>
            <h4 style={{marginBottom: '1rem', color: '#3730a3'}}>Leave a Review</h4>
            <form onSubmit={async e => {
              e.preventDefault();
              if (!reviewText.trim() || reviewRating < 1 || reviewRating > 5) return;
              try {
                await api(`/api/courses/${course.id}/reviews`, {
                  method: 'POST',
                  body: JSON.stringify({
                    comment: reviewText,
                    rating: reviewRating
                  }),
                  // Let api.ts handle headers and auth
                });
                setReviewText("");
                setReviewRating(5);
                // Refresh course data to get new reviews/avg
                const updatedCourse = await api(`/api/courses/${course.id}`);
                setCourse(updatedCourse);
                setToast("Review posted!");
                setTimeout(() => setToast(null), 2000);
              } catch (err) {
                setToast(err.message || "Failed to post review");
              }
              setTimeout(() => setToast(""), 2000);
            }}>
              <div style={{marginBottom: '1rem'}}>
                <label style={{fontWeight: 500, marginRight: '1rem'}}>Rating:</label>
                {[1,2,3,4,5].map(star => (
                  <span
                    key={star}
                    style={{cursor: 'pointer', color: reviewRating >= star ? '#f59e42' : '#d1d5db', fontSize: '1.5rem'}}
                    onClick={() => setReviewRating(star)}
                  >★</span>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                rows={3}
                style={{width: '100%', fontSize: '1.05rem', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '1rem'}}
                placeholder="Write your review here..."
                required
              />
              <Button color="primary" size="medium" type="submit">Post Review</Button>
            </form>
          </div>
        )}
      </div>
      {/* Purchase buttons for non-enrolled users */}
      {!enrolled && (
        <div className="course-detail-actions">
          <Button
            color="primary"
            size="medium"
            onClick={handleAddToCart}
            disabled={!course || !course.id}
          >
            Add to Cart
          </Button>
          <Button
            color="secondary"
            size="medium"
            onClick={() => window.location.href = `/checkout?courseId=${course.id}`}
            disabled={!course || !course.id}
          >
            Checkout
          </Button>
        </div>
      )}
      {toast && <div className="course-detail-toast">{toast}</div>}
    </section>
  );
};
