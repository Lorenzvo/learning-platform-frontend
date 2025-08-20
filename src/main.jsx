import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { HomePage } from '@/component/HomePage/HomePage';
import { CoursesPage } from '@/component/CoursesPage/CoursesPage';
import { LoginPage } from '@/component/LoginPage/LoginPage';
import { Shell } from '@/component/Layout/Shell';
import { EnrollmentsPage } from '@/component/EnrollmentsPage/EnrollmentsPage';
import { SignupPage } from '@/component/LoginPage/SignupPage';

const router = createBrowserRouter([
  {
    path: '/enrollments',
    element: <Shell><EnrollmentsPage /></Shell>,
  },
  {
    path: '/',
    element: <Shell><HomePage /></Shell>,
  },
  {
    path: '/courses',
    element: <Shell><CoursesPage /></Shell>,
  },
  {
    path: '/login',
    element: <Shell><LoginPage /></Shell>,
  },
  {
    path: '/signup',
    element: <Shell><SignupPage /></Shell>,
  },
  {
    path: '/cart',
    element: <Shell><div>Cart (coming soon)</div></Shell>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);