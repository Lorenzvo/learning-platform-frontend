
import React from 'react';
import './HomePage.css';


const courses = [
  {
    id: 1,
    title: 'Web Development',
    description: 'Build modern websites and web apps using HTML, CSS, and JavaScript.',
    image: 'https://undraw.co/api/illustrations/undraw_web_development_re_6b3a.svg'
  },
  {
    id: 2,
    title: 'Java Spring Boot',
    description: 'Create robust backend applications with Java and Spring Boot.',
    image: 'https://undraw.co/api/illustrations/undraw_programming_re_kg9v.svg'
  },
  {
    id: 3,
    title: 'Digital Marketing',
    description: 'Master digital marketing strategies to grow your online presence.',
    image: 'https://undraw.co/api/illustrations/undraw_marketing_re_7f1g.svg'
  },
  {
    id: 4,
    title: 'Graphic Design',
    description: 'Learn the principles of graphic design and visual communication.',
    image: 'https://undraw.co/api/illustrations/undraw_design_re_6yws.svg'
  },
  {
    id: 5,
    title: 'Linear Algebra',
    description: 'Understand the foundations of linear algebra for STEM fields.',
    image: 'https://undraw.co/api/illustrations/undraw_mathematics_re_abe5.svg'
  },
  {
    id: 6,
    title: 'Cloud Computing',
    description: 'Explore cloud platforms and learn how to deploy scalable applications.',
    image: 'https://undraw.co/api/illustrations/undraw_cloud_hosting_7xb1.svg'
  }
];

export const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>EdNova</h1>
        <nav className="homepage-nav top-right">
          <button className="nav-btn small">Home</button>
          <button className="nav-btn small">Courses</button>
          <button className="nav-btn small">Login</button>
        </nav>
      </header>
      <section className="homepage-hero">
        <h2 className="homepage-subtitle">Learning starts here</h2>
        <p className="homepage-description">
          Welcome to EdNova, your gateway to modern online education. Explore interactive courses, connect with expert instructors, and unlock your potential in a vibrant learning community. Start your journey today!
        </p>
      </section>
      <main className="homepage-main">
        <h2 className="courses-title">Featured Courses</h2>
        <div className="courses-grid six-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card large">
              <img src={course.image} alt={course.title} className="course-image large" />
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <button className="course-btn">View Course</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};