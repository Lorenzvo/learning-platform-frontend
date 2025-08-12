import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import App from './App.jsx'            // course list
import Course from './pages/Course.jsx' // course detail

// Router table. You can add more routes as the UI grows.
const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/:slug', element: <Course /> }, // e.g. /spring-boot-fundamentals
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)