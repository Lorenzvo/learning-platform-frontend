
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../Button/Button";
import { api } from "../../lib/api.ts";
import frame from "./frame.svg";
import "./CoursesPage.css";
import { Link } from "react-router-dom";
export const CoursesPage = () => {
  const [searchInput, setSearchInput] = useState("");
  // Read query params from URL
  const [searchParams, setSearchParams] = useSearchParams();
  // Removed unused navigate to fix lint error
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const search = searchParams.get("q") || "";
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 0);
  // Level filter state: array of selected levels
  const [levels, setLevels] = useState(() => {
    const param = searchParams.get("level");
    return param ? param.split(",") : [];
  });
  // Reviews filter state: minimum average rating
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  const [reviewsDropdownOpen, setReviewsDropdownOpen] = useState(false);
  const reviewsDropdownRef = useRef(null);
  // Custom dropdown for reviews filter
  useEffect(() => {
    function handleClickOutside(event) {
      if (reviewsDropdownRef.current && !reviewsDropdownRef.current.contains(event.target)) {
        setReviewsDropdownOpen(false);
      }
    }
    if (reviewsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [reviewsDropdownOpen]);
  // debounceRef removed (no longer used)

  // Fetch courses from backend when query params change
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Server-side filtering: backend handles search, sort, level, and minRating
  api(`/api/courses?page=${page}&size=6${searchInput ? `&q=${encodeURIComponent(searchInput)}` : ""}${sort ? `&sort=${encodeURIComponent(sort)}` : ""}${levels.length ? `&level=${levels.join(",")}` : ""}${minRating ? `&minRating=${minRating}` : ""}`)
      .then(data => {
        setCourses(Array.isArray(data?.content) ? data.content : []);
        setTotalPages(typeof data?.totalPages === 'number' ? data.totalPages : 1);
        setCurrentPage(typeof data?.page === 'number' ? data.page : 0);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Failed to load courses");
        setLoading(false);
      });
  }, [page, search, sort, levels, minRating, searchInput]);

  // Debounced search input handler
  // handleSearchInput removed (no longer used)

  // Handler for sort dropdown
  const handleSortChange = (e) => {
    setSort(e.target.value);
    setSearchParams({ q: search, sort: e.target.value, page, level: levels.join(","), minRating });
  };

  // Custom dropdown for level filter
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const levelDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (levelDropdownRef.current && !levelDropdownRef.current.contains(event.target)) {
        setLevelDropdownOpen(false);
      }
    }
    if (levelDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [levelDropdownOpen]);

  const handleLevelCheckbox = (e) => {
    const value = e.target.value;
    let newLevels;
    if (e.target.checked) {
      newLevels = [...levels, value];
    } else {
      newLevels = levels.filter(lvl => lvl !== value);
    }
    setLevels(newLevels);
    setSearchParams({ q: search, sort, page, level: newLevels.join(","), minRating });
  };

  // Handler for reviews filter dropdown
  const handleMinRatingSelect = (value) => {
    setMinRating(value);
    setReviewsDropdownOpen(false);
    setSearchParams({ q: search, sort, page, level: levels.join(","), minRating: value });
  };

  return (
    <section className="courses-page">
      <header className="courses-page__header">
        <div className="courses-page__controls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Sort UI: updates query param, triggers server-side sort */}
            <div className="courses-page__select">
              <span>Sort by</span>
              <select value={sort} onChange={handleSortChange} style={{ marginLeft: 8 }}>
                <option value="">Default</option>
                <option value="priceCents">Price (Low to High)</option>
                <option value="priceCents,desc">Price (High to Low)</option>
                <option value="title">Title (A-Z)</option>
                <option value="title,desc">Title (Z-A)</option>
              </select>
              <img src={frame} alt="Sort icon" />
            </div>
            {/* Filter UI: custom dropdown with checkboxes for course level */}
            <div className="courses-page__filter" style={{ position: 'relative', marginRight: '1rem' }} ref={levelDropdownRef}>
              <button
                type="button"
                className="courses-page__dropdown-btn"
                style={{ padding: '0.5rem 1rem', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: 'pointer', minWidth: 90 }}
                onClick={() => setLevelDropdownOpen((open) => !open)}
              >
                Level &#9662;
              </button>
              {levelDropdownOpen && (
                <div
                  className="courses-page__dropdown-menu"
                  style={{ position: 'absolute', top: '110%', left: 0, zIndex: 10, background: '#fff', border: '1px solid #ccc', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '0.5rem 1rem', minWidth: 140 }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                    <input type="checkbox" value="BEGINNER" checked={levels.includes("BEGINNER")}
                      onChange={handleLevelCheckbox} /> Beginner
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                    <input type="checkbox" value="INTERMEDIATE" checked={levels.includes("INTERMEDIATE")}
                      onChange={handleLevelCheckbox} /> Intermediate
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" value="ADVANCED" checked={levels.includes("ADVANCED")}
                      onChange={handleLevelCheckbox} /> Advanced
                  </label>
                </div>
              )}
            </div>
            {/* Ratings filter dropdown button */}
            <div className="courses-page__filter courses-page__filter--ratings" style={{ position: 'relative', marginRight: '1rem', marginLeft: '-0.5rem' }} ref={reviewsDropdownRef}>
              <button
                type="button"
                className="courses-page__dropdown-btn"
                style={{ padding: '0.5rem 1rem', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: 'pointer', minWidth: 90 }}
                onClick={() => setReviewsDropdownOpen((open) => !open)}
              >
                Ratings &#9662;
              </button>
              {reviewsDropdownOpen && (
                <div
                  className="courses-page__dropdown-menu"
                  style={{ position: 'absolute', top: '110%', left: 0, zIndex: 10, background: '#fff', border: '1px solid #ccc', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '0.5rem 1rem', minWidth: 140 }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                    <input type="radio" name="minRating" value="2.0" checked={minRating === "2.0"}
                      onChange={() => handleMinRatingSelect("2.0")} /> 2.0 <span style={{ color: '#f5b50a', fontSize: '1em' }}>★</span>+
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                    <input type="radio" name="minRating" value="3.0" checked={minRating === "3.0"}
                      onChange={() => handleMinRatingSelect("3.0")} /> 3.0 <span style={{ color: '#f5b50a', fontSize: '1em' }}>★</span>+
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                    <input type="radio" name="minRating" value="4.0" checked={minRating === "4.0"}
                      onChange={() => handleMinRatingSelect("4.0")} /> 4.0 <span style={{ color: '#f5b50a', fontSize: '1em' }}>★</span>+
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 8 }}>
                    <input type="radio" name="minRating" value="4.5" checked={minRating === "4.5"}
                      onChange={() => handleMinRatingSelect("4.5")} /> 4.5 <span style={{ color: '#f5b50a', fontSize: '1em' }}>★</span>+
                  </label>
                  {minRating && (
                    <button
                      type="button"
                      style={{ width: '100%', padding: '0.4rem', borderRadius: 4, border: '1px solid #ccc', background: '#f5f5f5', color: '#333', cursor: 'pointer', marginTop: 4 }}
                      onClick={() => { setMinRating(""); setSearchParams({ q: searchInput, sort, page, level: levels.join(",") }); }}
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <input
            type="text"
            className="courses-page__search-input"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search for courses"
            style={{ padding: '0.6rem 1.2rem', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '1rem', width: 320, marginLeft: 'auto' }}
          />
        </div>
      </header>

      {/* Loading state */}
      {loading && (
        <div className="courses-loading">Loading...</div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="courses-error">{error}</div>
      )}

      {/* Empty state */}
      {!loading && !error && courses.length === 0 && (
        <div className="courses-empty">No courses found.</div>
      )}

      {/* Courses grid: minimal UI, palette matches existing, now with averageRating, instructor, and level */}
      {!loading && !error && courses.length > 0 && (
        <div className="courses-page__grid">
          {courses.map((course) => (
            <Link
              key={course.slug || course.title}
              to={`/courses/${course.slug}`}
              className="courses-page__card-link"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <article className="courses-page__card">
                <img
                  src={course.thumbnailUrl ? course.thumbnailUrl : 'https://via.placeholder.com/320x180?text=No+Image'}
                  alt={course.title}
                  className="courses-page__image"
                />
                <div className="courses-page__content">
                  <h3 className="courses-page__title">{course.title}</h3>
                  <p className="courses-page__description">{course.shortDesc || course.description}</p>
                </div>
                <div className="courses-page__meta-row">
                  <div className="courses-page__meta-group">
                    {typeof course.averageRating === 'number' && (
                      <span className="courses-page__meta-pill courses-page__rating">
                        {course.averageRating.toFixed(1)} ★
                      </span>
                    )}
                    {course.level && (
                      <span className="courses-page__meta-pill courses-page__level">
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1).toLowerCase()}
                      </span>
                    )}
                  </div>
                  {typeof course.priceCents === 'number' && (
                    <span className="courses-page__meta-pill courses-page__price">
                      ${(course.priceCents / 100).toFixed(2)}
                    </span>
                  )}
                </div>
                {/* Removed instructor display, now showing shortDesc above */}
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination controls: numbered pages and arrows */}
      <div className="courses-page__footer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
        <Button
          color="secondary"
          size="small"
          disabled={currentPage === 0}
          onClick={() => {
            setPage(currentPage - 1);
            setSearchParams({ q: search, sort, page: currentPage - 1, level: levels.join(","), minRating });
          }}
        >
          ←
        </Button>
        {[...Array(totalPages)].map((_, idx) => (
          <Button
            key={idx}
            color={idx === currentPage ? "primary" : "secondary"}
            size="small"
            style={{ minWidth: 32, fontWeight: idx === currentPage ? 700 : 400 }}
            onClick={() => {
              setPage(idx);
              setSearchParams({ q: search, sort, page: idx, level: levels.join(","), minRating });
            }}
          >
            {idx + 1}
          </Button>
        ))}
        <Button
          color="secondary"
          size="small"
          disabled={currentPage === totalPages - 1}
          onClick={() => {
            setPage(currentPage + 1);
            setSearchParams({ q: search, sort, page: currentPage + 1, level: levels.join(","), minRating });
          }}
        >
          →
        </Button>
      </div>
    </section>
  );
};
