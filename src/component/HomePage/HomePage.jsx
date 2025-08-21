import React from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';

const courses = [
  {
    id: 3,
    title: 'Web Development',
    description: 'Learn modern web development from scratch.',
    image: 'https://www.appletechsoft.com/wp-content/uploads/2022/08/Fundamentals-For-Building-A-Great-Web-Design.jpg',
    slug: 'web-development-bootcamp',
    priceCents: 2499,
    level: 'BEGINNER',
    averageRating: 4.0
  },
  {
    id: 2,
    title: 'Java Fundamentals',
    description: 'A beginner-friendly introduction to Java.',
    image: 'https://howtodoinjava.com/wp-content/uploads/2019/03/JAVA.jpg',
    slug: 'java-fundamentals',
    priceCents: 1999,
    level: 'BEGINNER',
    averageRating: 4.2
  },
  {
    id: 4,
    title: 'Digital Marketing',
    description: 'Master digital marketing strategies to grow your online presence.',
    image: 'https://www.reshot.com/preview-assets/illustrations/FHZSTMBAP2/digital-marketing-team-FHZSTMBAP2-w1600.jpg',
    slug: 'digital-marketing',
    priceCents: 5999,
    level: 'BEGINNER',
    averageRating: 4.3
  },
  {
    id: 5,
    title: 'Graphic Design',
    description: 'Learn the principles of graphic design and visual communication.',
    image: 'https://miro.medium.com/0*G_W4PEC6F5eZePDU.jpg',
    slug: 'graphic-design',
    priceCents: 5499,
    level: 'BEGINNER',
    averageRating: 3.0
  },
  {
    id: 6,
    title: 'Linear Algebra',
    description: 'Understand the foundations of linear algebra for STEM fields.',
    image: 'https://r2.erweima.ai/i/CtY2uEsGS167dI6DXiV7vQ.png',
    slug: 'linear-algebra',
    priceCents: 6999,
    level: 'INTERMEDIATE',
    averageRating: 3.7
  },
  {
    id: 6,
    title: 'Cloud Computing',
    description: 'Explore cloud platforms and learn how to deploy scalable applications.',
    image: 'https://www.openaccessgovernment.org/wp-content/uploads/2022/09/Server-Illustration.png',
    slug: 'cloud-computing',
    priceCents: 6499,
    level: 'BEGINNER',
    averageRating: 4.0
  }
];

const featuredCourses = courses.filter(course => course.id >= 2 && course.id <= 6);

export const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* Stack Overflow-style blue banner hero */}
      <section
        className="relative left-1 right-0 -mx-[50vw] w-screen h-[260px] md:h-[380px] flex items-center bg-cover bg-center bg-no-repeat"
        aria-label="Blue background banner for EdNova homepage"
        style={{ backgroundImage: "url('/src/assets/bluebackground.png')" }}
      >
  {/* Overlay removed so PNG background is fully visible */}
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
          {featuredCourses.map(course => (
            <Link
              key={course.id}
              to={`/courses/${course.slug}`}
              className="courses-page__card-link"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <article className="courses-page__card">
                <img src={course.image} alt={course.title} className="courses-page__image" />
                <div className="courses-page__content">
                  <h3 className="courses-page__title">{course.title}</h3>
                  <p className="courses-page__description">{course.description}</p>
                </div>
                <div className="courses-page__meta-row">
                  <div className="courses-page__meta-group">
                    <span className="courses-page__meta-pill courses-page__rating">
                      {course.averageRating.toFixed(1)} ★
                    </span>
                    <span className="courses-page__meta-pill courses-page__level">
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <span className="courses-page__meta-pill courses-page__price">
                    ${(course.priceCents / 100).toFixed(2)}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
