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
import { CartProvider } from '@/context/CartContext.jsx';
import { CartPage } from '@/component/Cart/CartPage';
import { CourseDetailPage } from '@/component/CourseDetail/CourseDetailPage';
import { CheckoutPage } from '@/component/Checkout/CheckoutPage';
import { CartCheckoutPage } from '@/component/Checkout/CartCheckoutPage';
import { AdminLayout } from "@/component/Admin/AdminLayout";
import { RequireAdmin } from "@/component/Admin/RequireAdmin";
import { AdminPaymentsPage } from "@/component/Admin/AdminPaymentsPage";
import { AdminEnrollmentsPage } from "@/component/Admin/AdminEnrollmentsPage";
import { AuthProvider } from "@/context/useAuth";

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
    element: <Shell><CartPage /></Shell>,
  },
  {
    path: '/courses/:slug',
    element: <Shell><CourseDetailPage /></Shell>,
  },
  {
    path: '/checkout',
    element: <Shell><CheckoutPage /></Shell>,
  },
  {
    path: '/cart-checkout',
    element: <Shell><CartCheckoutPage /></Shell>,
  },
  {
    path: '/admin',
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { path: 'payments', element: <AdminPaymentsPage /> },
      { path: 'courses', element: <div className="text-xl text-indigo-700">Admin Courses Page (Coming Soon)</div> },
  { path: 'enrollments', element: <AdminEnrollmentsPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);