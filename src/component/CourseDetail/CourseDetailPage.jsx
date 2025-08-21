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
  const { add } = useCart();

  useEffect(() => {
    Promise.all([
      api(`/api/courses/${slug}`),
      api("/api/enrollments/me")
    ])
      .then(([courseData, enrollmentsData]) => {
        setCourse(courseData);
        setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
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
  return (
    <section className="course-detail-page">
      <header className="course-detail-header">
        <img
          src={isValidUrl(course.thumbnailUrl) ? course.thumbnailUrl : '/vite.svg'}
          alt={course.title}
          style={{height: '120px', borderRadius: '8px', marginRight: '2rem'}}
        />
        <div>
          <h2 className="course-detail-title">{course.title}</h2>
          <span className="course-detail-price">${(course.price / 100).toFixed(2)}</span>
          <span className="course-detail-level">{course.level}</span>
        </div>
      </header>
      <div className="course-detail-description">{course.longDesc}</div>
      {course.instructor && (
        <div className="course-detail-instructor">Instructor: {course.instructor.name}</div>
      )}
      <div className="course-detail-reviews">
        {course.reviewCount > 0 ? (
          <span>Reviews: {course.avgRating.toFixed(1)} / 5 ({course.reviewCount})</span>
        ) : (
          <span>No reviews yet</span>
        )}
      </div>
      {/* Modules */}
      <div className="course-detail-modules">
        <h3>Modules</h3>
        {course.modules.length === 0 && <div>No modules yet.</div>}
        {course.modules.map((mod, idx) => (
          <div key={mod.id || idx} className="course-detail-module">
            <div className="course-detail-module-title">{mod.title}</div>
            {/* Only allow expansion if enrolled */}
            {enrolled ? (
              <ul className="course-detail-lessons">
                {mod.lessons.map(lesson => (
                  <li key={lesson.id}>
                    {lesson.title} {lesson.isDemo ? <span className="demo-badge">Demo</span> : null}
                    {/* If enrolled or demo, show play button */}
                    {(enrolled || lesson.isDemo) && <Button color="primary" size="small">Play</Button>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="course-detail-locked">Enroll to view lessons</div>
            )}
          </div>
        ))}
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
