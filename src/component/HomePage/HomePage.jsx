
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
      {/* Stack Overflow-style blue banner hero */}
      <section
        className="relative left-1 right-0 -mx-[50vw] w-screen h-[260px] md:h-[380px] flex items-center !mt-[-32px] bg-cover bg-center bg-no-repeat"
        aria-label="Blue background banner for EdNova homepage"
        style={{
          backgroundImage: `url(/src/assets/bluebackground.png)`
        }}
      >
        {/* Overlay for contrast */}
        <div className="absolute inset-0 bg-blue-900 bg-opacity-60 pointer-events-none" />
        {/* Content container, left-aligned */}
        <div className="relative z-10 max-w-5xl pl-2 md:pl-8 flex flex-col justify-center h-full text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4" tabIndex={0}>
            Learning starts here
          </h1>
          <p className="text-white text-lg md:text-xl max-w-xl mt-2 md:mt-4" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.18)' }}>
            Welcome to EdNova, your gateway to modern online education. Explore interactive courses, connect with expert instructors, and unlock your potential in a vibrant learning community. Start your journey today!
          </p>
        </div>
      </section>
      <main className="homepage-main">
        <h2 className="courses-title">Featured Courses</h2>
        <div className="courses-grid six-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card large">
              <img src={course.image} alt={course.title} className="course-image large" />
              <h3 className="course-title large">{course.title}</h3>
              <p className="course-description large">{course.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
        