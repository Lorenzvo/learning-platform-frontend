import React from "react";
import { Link, Outlet } from "react-router-dom";

export const AdminLayout = () => (
  <div className="flex min-h-screen bg-gray-50">
    <nav className="w-56 bg-white border-r border-gray-200 flex flex-col py-8 px-4">
      <h2 className="text-2xl font-bold text-indigo-700 mb-8">Admin</h2>
      <Link to="/admin/payments" className="mb-4 px-3 py-2 rounded hover:bg-indigo-50 text-indigo-600 font-medium">Payments</Link>
      <Link to="/admin/courses" className="mb-4 px-3 py-2 rounded hover:bg-indigo-50 text-indigo-600 font-medium">Courses</Link>
      <Link to="/admin/enrollments" className="mb-4 px-3 py-2 rounded hover:bg-indigo-50 text-indigo-600 font-medium">Enrollments</Link>
    </nav>
    <main className="flex-1 p-8">
      <Outlet />
    </main>
  </div>
);
