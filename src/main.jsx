import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// Import pages
import { HomePage } from '@/component/HomePage/HomePage'
import { CoursesPage } from '@/component/CoursesPage/CoursesPage'
import { LoginPage } from '@/component/LoginPage/LoginPage'
import { Shell } from '@/component/Layout/Shell'

// Define routes, all wrapped in Shell layout
const router = createBrowserRouter([
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
    path: '/cart',
    element: <Shell><div>Cart (coming soon)</div></Shell>,
  },
  {
    path: '/my-courses',
    element: <Shell><div>My Courses (coming soon)</div></Shell>,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)