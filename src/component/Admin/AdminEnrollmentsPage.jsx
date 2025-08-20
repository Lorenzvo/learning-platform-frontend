import React, { useState } from "react";
import { Button } from "../Button/Button";

const today = new Date().toISOString().slice(0, 10);

export const AdminEnrollmentsPage = () => {
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Download CSV
  const handleDownload = () => {
    const token = localStorage.getItem("jwt");
    fetch(`/api/admin/enrollments/reports/enrollments.csv?from=${from}&to=${to}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "enrollments.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      });
  };

  // Fetch enrollments
  const fetchEnrollments = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`/api/admin/enrollments?from=${from}&to=${to}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch enrollments");
      const data = await res.json();
      setEnrollments(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter enrollments by generic search query
  const filteredEnrollments = enrollments.filter(e => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    // Match against id, userEmail, courseTitle, status, date
    return (
      String(e.id).toLowerCase().includes(q) ||
      (e.userEmail && e.userEmail.toLowerCase().includes(q)) ||
      (e.courseTitle && e.courseTitle.toLowerCase().includes(q)) ||
      (e.status && e.status.toLowerCase().includes(q)) ||
      (e.date && e.date.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">Enrollments</h1>
        <Button color="gray" size="small" onClick={() => window.location.href = "/"}>Home</Button>
      </div>
      <div className="flex gap-4 mb-6 items-end justify-between">
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border rounded px-2 py-1" />
          </div>
          <Button color="primary" size="small" onClick={handleDownload}>Download CSV</Button>
          <Button color="indigo" size="small" onClick={fetchEnrollments}>Show Enrollments</Button>
        </div>
        {/* Short search bar, right-aligned */}
        <div style={{ minWidth: 180 }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search enrollments"
            className="border rounded px-3 py-2 w-full text-base"
            style={{ outline: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
          />
        </div>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading && <div>Loading...</div>}
      {filteredEnrollments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <table className="min-w-full">
            <thead>
              <tr className="bg-indigo-50">
                <th className="px-3 py-2 text-left text-sm font-semibold text-indigo-700">ID</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-indigo-700">Date</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-indigo-700">User</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-indigo-700">Course</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-indigo-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map(e => (
                <tr key={e.id} className="border-b">
                  <td className="px-3 py-2">{e.id}</td>
                  <td className="px-3 py-2">{e.date}</td>
                  <td className="px-3 py-2">{e.userEmail}</td>
                  <td className="px-3 py-2">{e.courseTitle}</td>
                  <td className="px-3 py-2">{e.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {filteredEnrollments.length === 0 && (
        <div className="text-gray-500 mt-8">No enrollments found. Use Download CSV for reports.</div>
      )}
    </div>
  );
};
