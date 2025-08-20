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
  const { add } = useCart();

  useEffect(() => {
    api(`/api/courses/${slug}`)
      .then(setCourse)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    try {
      await add(course.id);
      setToast("Added to cart");
      setTimeout(() => setToast(""), 2000);
    } catch (err) {
      setToast(err.message || "Failed to add to cart");
      setTimeout(() => setToast(""), 2000);
    }
  };

  if (loading) return <div className="course-detail-loading">Loading…</div>;
  if (error) return <div className="course-detail-error">Error: {error}</div>;
  if (!course) return <div className="course-detail-empty">Course not found.</div>;

  return (
    <section className="course-detail-page">
      <header className="course-detail-header">
        <h2 className="course-detail-title">{course.title}</h2>
        <span className="course-detail-price">${(course.priceCents / 100).toFixed(2)}</span>
      </header>
      <div className="course-detail-description">{course.description}</div>
      <Button color="primary" size="medium" onClick={handleAddToCart}>
        Add to Cart
      </Button>
      {toast && <div className="course-detail-toast">{toast}</div>}
      {/* Optionally render TOC, modules, lessons here if available in course */}
    </section>
  );
};
