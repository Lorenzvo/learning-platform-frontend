import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// Import pages
import { HomePage } from '@/component/HomePage/HomePage'
import { CoursesPage } from '@/component/CoursesPage/CoursesPage'
import { LoginPage } from '@/component/LoginPage/LoginPage' 

// Define routes that actually exist
const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/courses', element: <CoursesPage /> },
  { path: '/login', element: <LoginPage /> },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)