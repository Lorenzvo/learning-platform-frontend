import React, { useState } from "react";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router-dom";

const today = new Date().toISOString().slice(0, 10);

export const AdminPaymentsPage = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmRefundId, setConfirmRefundId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refundProcessing, setRefundProcessing] = useState(false);
  const [refundDone, setRefundDone] = useState(false);
  const [search, setSearch] = useState("");

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
    setConfirmRefundId(paymentId);
    setShowModal(true);
  };

  const confirmRefund = async () => {
    setRefundProcessing(true);
    setShowModal(false);
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`/api/admin/payments/${confirmRefundId}/refund`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Refund failed");
      setRefundProcessing(false);
      setRefundDone(true);
      setConfirmRefundId(null);
      fetchPayments();
      setTimeout(() => setRefundDone(false), 1200);
    } catch (e) {
      alert(e.message);
      setRefundProcessing(false);
      setShowModal(false);
    }
  };

  // Refund processing/loading screen
  if (refundProcessing) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-bold text-indigo-700">Processing...</h2>
          </div>
        </div>
      </div>
    );
  }
  // Refund done screen
  if (refundDone) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-bold text-green-600">Refunded!</h2>
          </div>
        </div>
      </div>
    );
  }
  // Filter payments by generic search query
  const filteredPayments = payments.filter(p => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    // Match against id, userEmail, status, date, amount
    const amountStr = p.amountCents ? (p.amountCents / 100).toFixed(2) : "";
    return (
      String(p.id).toLowerCase().includes(q) ||
      (p.userEmail && p.userEmail.toLowerCase().includes(q)) ||
      (p.status && p.status.toLowerCase().includes(q)) ||
      (p.date && p.date.toLowerCase().includes(q)) ||
      amountStr.includes(q)
    );
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">Payments</h1>
        <Button color="gray" size="small" onClick={() => navigate("/")}>Home</Button>
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
          <Button color="indigo" size="small" onClick={fetchPayments}>Show Payments</Button>
        </div>
        {/* Short search bar, right-aligned */}
        <div style={{ minWidth: 180 }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search payments"
            className="border rounded px-3 py-2 w-full text-base"
            style={{ outline: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
          />
        </div>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading && <div>Loading...</div>}
      {filteredPayments.length > 0 && (
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
              {filteredPayments.map(p => (
                <tr key={p.id} className="border-b">
                  <td className="px-3 py-2">{p.id}</td>
                  <td className="px-3 py-2">{p.date}</td>
                  <td className="px-3 py-2">${(p.amountCents / 100).toFixed(2)}</td>
                  <td className="px-3 py-2">{p.userEmail}</td>
                  <td className="px-3 py-2">{p.status}</td>
                  <td className="px-3 py-2">
                    {p.status === "REFUNDED" ? (
                      <span className="text-green-600 font-semibold">Refunded</span>
                    ) : p.status === "SUCCESS" ? (
                      <Button color="indigo" size="small" onClick={() => handleRefund(p.id)}>
                        Refund
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {filteredPayments.length === 0 && (
        <div className="text-gray-500 mt-8">No payments found. Use Download CSV for reports.</div>
      )}
      {/* Refund processing/loading screen */}
      {refundProcessing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-bold text-indigo-700">Processing...</h2>
          </div>
        </div>
      )}
      {/* Refund done screen */}
      {refundDone && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-bold text-green-600">Refunded!</h2>
          </div>
        </div>
      )}
      {/* Refund confirmation modal */}
      {showModal && !refundProcessing && !refundDone && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-base font-bold mb-3">Proceed with refunding payment no. {confirmRefundId}?</h2>
            <div className="flex gap-3 justify-center">
              <Button color="red" size="medium" onClick={confirmRefund}>Confirm Refund</Button>
              <Button color="gray" size="medium" onClick={() => { setShowModal(false); setConfirmRefundId(null); }}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
