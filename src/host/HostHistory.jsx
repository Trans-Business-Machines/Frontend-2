import React, { useState } from "react";
import "./HostHistory.css";

const initialVisitors = [
  { name: "John Doe", id: "20251234", purpose: "Delivery", in: "09:15 AM", out: "9:45 AM", date: "2025-05-22" },
  { name: "Lucy Smith", id: "20251235", purpose: "HR", in: "08:50 AM", out: "9:30 AM", date: "2025-05-26" },
  { name: "Tom Baker", id: "20251236", purpose: "Delivery", in: "10:45 AM", out: "11:00 AM", date: "2025-06-02" },
  { name: "Rita Patel", id: "20251237", purpose: "Inquiry", in: "11:05 AM", out: "12:30 PM", date: "2025-06-02" },
  { name: "Jane Roe", id: "20251238", purpose: "Meeting", in: "12:00 PM", out: "1:00 PM", date: "2025-06-03" },
];

const PURPOSES = ["All", "Meeting", "Delivery", "HR", "Inquiry"];

export default function HostHistory() {
  const [search, setSearch] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("All");
  const [dateOrder, setDateOrder] = useState("Descending");

  // Filtering logic
  const filtered = initialVisitors
    .filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.id.toLowerCase().includes(search.toLowerCase()) ||
        v.date.includes(search);
      const matchesPurpose =
        purposeFilter === "All" || v.purpose === purposeFilter;
      return matchesSearch && matchesPurpose;
    })
    .sort((a, b) =>
      dateOrder === "Ascending"
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date)
    );

  return (
    <div className="host-history-wrapper">
      <div className="host-history-title">Visitor Check-in History</div>
      <div className="host-history-desc">
        Need to look back? Filter and browse previous guest check-ins.
      </div>
      <input
        type="text"
        className="host-history-search"
        placeholder="Search by visitor, id or date (yyyy-mm-dd)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="host-history-filter-row">
        <div>
          <label style={{ marginRight: 10 }}>Date</label>
          <select
            value={dateOrder}
            onChange={e => setDateOrder(e.target.value)}
          >
            <option>Ascending</option>
            <option>Descending</option>
          </select>
        </div>
        <div>
          <label style={{ marginRight: 10 }}>Purpose</label>
          <select
            value={purposeFilter}
            onChange={e => setPurposeFilter(e.target.value)}
          >
            {PURPOSES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="host-history-table-container">
        <table className="host-history-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>ID Number</th>
              <th>Purpose</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "#aaa" }}>
                  No records found.
                </td>
              </tr>
            ) : (
              filtered.map((v, i) => (
                <tr key={i}>
                  <td>{v.name}</td>
                  <td>{v.id}</td>
                  <td>{v.purpose}</td>
                  <td>{v.in}</td>
                  <td>{v.out}</td>
                  <td>{v.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="host-history-pagination">
        <span>Showing {filtered.length} of {initialVisitors.length}</span>
        {/* Add real pagination here if needed */}
      </div>
    </div>
  );
}