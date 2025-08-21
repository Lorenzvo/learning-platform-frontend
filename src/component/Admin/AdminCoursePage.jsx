import React, { useEffect, useState } from "react";
import { api } from "../../lib/api.ts";
import { Button } from "../Button/Button";
import "./AdminCoursePage.css";

export const AdminCoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    price: 0,
    currency: "USD",
    level: "Beginner",
    shortDesc: "",
    longDesc: "",
    thumbnailUrl: "",
    published: true
  });
  const [toast, setToast] = useState("");
  // Pagination and filters
  const [page, setPage] = useState(0);
  const size = 6;
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [published, setPublished] = useState("");

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, [page, size, search, level, published]);

  async function fetchCourses() {
    setLoading(true);
    try {
      const params = [];
      if (search) params.push(`q=${encodeURIComponent(search)}`);
      if (level) params.push(`level=${encodeURIComponent(level)}`);
      if (published !== "") params.push(`published=${published}`);
      params.push(`page=${page}`);
      params.push(`size=${size}`);
      const url = `/api/admin/courses${params.length ? "?" + params.join("&") : ""}`;
      const res = await api(url);
      setCourses(res.content || []);
      setTotalPages(res.totalPages || 1);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch courses");
    }
    setLoading(false);
  }

  function openAddForm() {
    setFormMode("add");
    setForm({
      title: "",
      slug: "",
      price: 0,
      currency: "USD",
      level: "Beginner",
      shortDesc: "",
      longDesc: "",
      thumbnailUrl: "",
      published: true
    });
    setSelectedCourse(null);
    setShowForm(true);
  }

  function openEditForm(course) {
    setFormMode("edit");
    setForm({
      title: course.title,
      slug: course.slug,
      price: course.priceCents,
      currency: course.currency,
      level: course.level,
      shortDesc: course.shortDescription,
      longDesc: course.description,
      thumbnailUrl: course.thumbnailUrl,
      published: course.isActive
    });
    setSelectedCourse(course);
    setShowForm(true);
  }

  async function handleDelete(courseId) {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api(`/api/admin/courses/${courseId}`, { method: "DELETE" });
      setToast("Course deleted");
      fetchCourses();
    } catch (err) {
      setToast(err.message || "Failed to delete course");
    }
  setTimeout(() => setToast("") , 2000);
  }

  async function handlePublish(courseId, publish) {
    try {
      await api(`/api/admin/courses/${courseId}/${publish ? "publish" : "unpublish"}`, { method: "POST" });
      setToast(publish ? "Course published" : "Course unpublished");
      fetchCourses();
    } catch (err) {
      setToast(err.message || "Failed to update publish status");
    }
  setTimeout(() => setToast("") , 2000);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      if (formMode === "add") {
        await api("/api/admin/courses", {
          method: "POST",
          body: JSON.stringify(form),
          headers: { "Content-Type": "application/json" }
        });
        setToast("Course added");
      } else if (formMode === "edit" && selectedCourse) {
        await api(`/api/admin/courses/${selectedCourse.id}`, {
          method: "PUT",
          body: JSON.stringify({
            title: form.title,
            slug: form.slug,
            shortDescription: form.shortDesc,
            thumbnailUrl: form.thumbnailUrl,
            priceCents: form.price,
            currency: form.currency,
            level: form.level,
            longDesc: form.longDesc,
            published: form.published
          }),
          headers: { "Content-Type": "application/json" }
        });
        setToast("Course updated");
      }
      setShowForm(false);
      fetchCourses();
    } catch (err) {
      setToast(err.message || "Failed to save course");
    }
  setTimeout(() => setToast("") , 2000);
  }

  return (
    <section className="admin-course-page">
      <header className="admin-course-header" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
          <h2>Admin Courses</h2>
          <Button color="primary" size="medium" onClick={openAddForm}>Add Course</Button>
        </div>
        <Button color="secondary" size="medium" onClick={() => window.location.href = '/admin'}>Home</Button>
      </header>
      {/* Filters */}
      <div className="admin-course-filters" style={{display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'center'}}>
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search by title or slug..."
          style={{padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '1rem', minWidth: '220px'}}
        />
        <select value={level} onChange={e => { setLevel(e.target.value); setPage(0); }} style={{padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '1rem'}}>
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <select value={published} onChange={e => { setPublished(e.target.value); setPage(0); }} style={{padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '1rem'}}>
          <option value="">All Status</option>
          <option value="true">Published</option>
          <option value="false">Unpublished</option>
        </select>
      </div>
      {toast && <div className="admin-course-toast">{toast}</div>}
      {loading ? (
        <div className="admin-course-loading">Loading…</div>
      ) : error ? (
        <div className="admin-course-error">{error}</div>
      ) : (
        <div className="admin-course-list">
          {courses.length === 0 ? <div>No courses found.</div> : (
            courses.map(course => (
              <div key={course.id} className="admin-course-card">
                <div className="admin-course-card-main">
                  <img src={course.thumbnailUrl} alt={course.title} className="admin-course-thumb" />
                  <div className="admin-course-meta">
                    <h3>{course.title}</h3>
                    <div className="admin-course-slug">Slug: {course.slug}</div>
                    <div className="admin-course-level">Level: {course.level}</div>
                    <div className="admin-course-price">Price: ${(course.priceCents / 100).toFixed(2)} {course.currency}</div>
                    <div className="admin-course-status">{course.isActive ? "Active" : "Inactive"}</div>
                  </div>
                </div>
                <div className="admin-course-actions">
                  <Button color="primary" size="small" onClick={() => openEditForm(course)}>Edit</Button>
                  <Button color="secondary" size="small" onClick={() => handlePublish(course.id, !course.isActive)}>{course.isActive ? "Unpublish" : "Publish"}</Button>
                  <Button color="danger" size="small" onClick={() => handleDelete(course.id)}>Delete</Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {/* Pagination controls */}
      <div className="admin-course-pagination" style={{display: 'flex', gap: '1rem', justifyContent: 'center', margin: '2rem 0'}}>
        <Button color="secondary" size="small" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</Button>
        <span style={{fontWeight: 500, color: '#3730a3'}}>Page {page + 1} of {totalPages}</span>
        <Button color="secondary" size="small" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
      </div>
      {showForm && (
        <div className="admin-course-form-modal">
          <form className="admin-course-form" onSubmit={handleFormSubmit}>
            <h3>{formMode === "add" ? "Add Course" : "Edit Course"}</h3>
            <div className="admin-course-form-row">
              <label>Title<input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required maxLength={255} /></label>
              <label>Slug<input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required maxLength={255} /></label>
            </div>
            <div className="admin-course-form-row">
              <label>Price<input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} required min={0} /></label>
              <label>Currency<input type="text" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} required maxLength={3} /></label>
            </div>
            <div className="admin-course-form-row">
              <label>Level<input type="text" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} required maxLength={50} /></label>
              <label>Short Description<input type="text" value={form.shortDesc} onChange={e => setForm({ ...form, shortDesc: e.target.value })} required maxLength={280} /></label>
            </div>
            <div className="admin-course-form-row">
              <label>Thumbnail URL<input type="text" value={form.thumbnailUrl} onChange={e => setForm({ ...form, thumbnailUrl: e.target.value })} required maxLength={255} /></label>
              <label>Published
                <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
              </label>
            </div>
            <div className="admin-course-form-row">
              <label style={{flex: 1}}>Long Description<textarea value={form.longDesc} onChange={e => setForm({ ...form, longDesc: e.target.value })} required /></label>
            </div>
            <div className="admin-course-form-actions">
              <Button color="primary" size="medium" type="submit">{formMode === "add" ? "Add" : "Update"}</Button>
              <Button color="secondary" size="medium" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};
