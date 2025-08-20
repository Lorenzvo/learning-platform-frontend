import React, { useState } from "react";
import { Button } from "../Button/Button";

const today = new Date().toISOString().slice(0, 10);

export const AdminPaymentsPage = () => {
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Download CSV
  const handleDownload = () => {
    const token = localStorage.getItem("jwt");
    fetch(`/api/admin/payments/reports/payments.csv?from=${from}&to=${to}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "payments.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      });
  };

  // Fetch payments (if endpoint available)
  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`/api/admin/payments?from=${from}&to=${to}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data = await res.json();
      setPayments(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Refund payment
  const handleRefund = async (paymentId) => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`/api/admin/payments/${paymentId}/refund`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Refund failed");
      fetchPayments();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">Payments</h1>
      <div className="flex gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <Button color="primary" size="small" onClick={handleDownload}>Download CSV</Button>
        <Button color="indigo" size="small" onClick={fetchPayments}>Show Payments</Button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading && <div>Loading...</div>}
      {payments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <table className="min-w-full">
            <thead>
              <tr className="bg-indigo-50">
                <th className="px-3 py-2 text-left text-sm font-semibold text-indigo-700">ID</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-indigo-700">Date</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-indigo-700">Amount</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-indigo-700">User</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-indigo-700">Status</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-indigo-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-b">
                  <td className="px-3 py-2">{p.id}</td>
                  <td className="px-3 py-2">{p.date}</td>
                  <td className="px-3 py-2">${(p.amountCents / 100).toFixed(2)}</td>
                  <td className="px-3 py-2">{p.userEmail}</td>
                  <td className="px-3 py-2">{p.status}</td>
                  <td className="px-3 py-2">
                    {p.status === "COMPLETED" && (
                      <Button color="indigo" size="small" onClick={() => handleRefund(p.id)}>Refund</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {payments.length === 0 && (
        <div className="text-gray-500 mt-8">No payments found. Use Download CSV for reports.</div>
      )}
    </div>
  );
};
