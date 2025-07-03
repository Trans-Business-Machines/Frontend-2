import React, { useState, useMemo, useEffect } from "react";
import "./HostHistory.css";

// Visitor data
const visitors = [
  { name: "John Doe", id: "20251234", purpose: "Delivery", timeIn: "09:15 AM", timeOut: "09:45 AM", date: "12-03-2025" },
  { name: "Lucy Smith", id: "20251235", purpose: "HR", timeIn: "08:50 AM", timeOut: "09:30 AM", date: "18-03-2025" },
  { name: "Tom Baker", id: "20251236", purpose: "Delivery", timeIn: "10:45 AM", timeOut: "11:00 AM", date: "25-03-2025" },
  { name: "Rita Patel", id: "20251237", purpose: "Inquiry", timeIn: "11:05 AM", timeOut: "12:30 PM", date: "29-03-2025" },
  { name: "Angela Wu", id: "20251238", purpose: "Maintenance", timeIn: "09:03 AM", timeOut: "10:10 AM", date: "05-04-2025" },
  { name: "Carlos Garcia", id: "20251239", purpose: "Delivery", timeIn: "10:00 AM", timeOut: "10:45 AM", date: "08-04-2025" },
  { name: "Sarah O'Neil", id: "20251240", purpose: "HR", timeIn: "09:20 AM", timeOut: "09:55 AM", date: "11-04-2025" },
  { name: "Victor Chen", id: "20251241", purpose: "Inquiry", timeIn: "11:30 AM", timeOut: "12:10 PM", date: "13-04-2025" },
  { name: "Emily Brown", id: "20251242", purpose: "Maintenance", timeIn: "08:50 AM", timeOut: "09:20 AM", date: "16-04-2025" },
  { name: "Mohammed Ali", id: "20251243", purpose: "Delivery", timeIn: "09:40 AM", timeOut: "10:12 AM", date: "19-04-2025" },
  { name: "Anna Müller", id: "20251244", purpose: "HR", timeIn: "10:17 AM", timeOut: "10:45 AM", date: "20-04-2025" },
  { name: "James Lee", id: "20251245", purpose: "Inquiry", timeIn: "09:25 AM", timeOut: "09:55 AM", date: "22-04-2025" },
  { name: "Priya Kumar", id: "20251246", purpose: "Maintenance", timeIn: "11:10 AM", timeOut: "12:00 PM", date: "25-04-2025" },
  { name: "Elena Petrova", id: "20251247", purpose: "Delivery", timeIn: "08:45 AM", timeOut: "09:30 AM", date: "27-04-2025" },
  { name: "Sam Johnson", id: "20251248", purpose: "HR", timeIn: "09:35 AM", timeOut: "10:00 AM", date: "01-05-2025" },
  { name: "Ahmed Hassan", id: "20251249", purpose: "Inquiry", timeIn: "10:25 AM", timeOut: "11:00 AM", date: "05-05-2025" },
  { name: "Grace Kim", id: "20251250", purpose: "Maintenance", timeIn: "09:10 AM", timeOut: "09:55 AM", date: "09-05-2025" },
  { name: "Peter Evans", id: "20251251", purpose: "Delivery", timeIn: "10:40 AM", timeOut: "11:10 AM", date: "13-05-2025" },
  { name: "Maria Rossi", id: "20251252", purpose: "HR", timeIn: "08:55 AM", timeOut: "09:35 AM", date: "17-05-2025" },
  { name: "Satoshi Tanaka", id: "20251253", purpose: "Inquiry", timeIn: "09:50 AM", timeOut: "10:20 AM", date: "20-05-2025" },
  { name: "Linda Clark", id: "20251254", purpose: "Maintenance", timeIn: "11:00 AM", timeOut: "12:05 PM", date: "23-05-2025" },
  { name: "Nina Dubois", id: "20251255", purpose: "Delivery", timeIn: "09:05 AM", timeOut: "09:50 AM", date: "26-05-2025" },
  { name: "David Smith", id: "20251256", purpose: "HR", timeIn: "10:10 AM", timeOut: "10:40 AM", date: "29-05-2025" },
  { name: "Yusuf Adeyemi", id: "20251257", purpose: "Inquiry", timeIn: "09:30 AM", timeOut: "10:10 AM", date: "01-06-2025" },
  { name: "Sofia Gonzalez", id: "20251258", purpose: "Maintenance", timeIn: "11:20 AM", timeOut: "12:00 PM", date: "05-06-2025" },
];

export default function HostHistory() {
  const [search, setSearch] = useState("");
  const [dateSort, setDateSort] = useState("Descending");
  const [purpose, setPurpose] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 10;

  const filtered = useMemo(() => {
    let results = visitors;

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      results = results.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.id.includes(query) ||
          v.date.includes(query)
      );
    }

    if (purpose) {
      results = results.filter((v) => v.purpose === purpose);
    }

    results = results.sort((a, b) => {
      const [da, ma, ya] = a.date.split("-").map(Number);
      const [db, mb, yb] = b.date.split("-").map(Number);
      const dateA = new Date(ya, ma - 1, da);
      const dateB = new Date(yb, mb - 1, db);
      return dateSort === "Ascending"
        ? dateA - dateB
        : dateB - dateA;
    });

    return results;
  }, [search, dateSort, purpose]);

  const pageCount = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    setPage(1);
  }, [search, dateSort, purpose]);

  const uniquePurposes = [...new Set(visitors.map(v => v.purpose))];

  return (
    <div className="host-history-page">
      <h2 className="host-history-title">Visitor Check-in History</h2>
      <p className="host-history-desc">
        Need to look back? Filter and browse previous guest check-ins.
      </p>

      <input
        type="text"
        className="host-history-search"
        placeholder="Search by visitor, id or date (dd-mm-yyyy)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="host-history-filter-row">
        <label>Date</label>
        <select value={dateSort} onChange={(e) => setDateSort(e.target.value)}>
          <option>Ascending</option>
          <option>Descending</option>
        </select>

        <label>Purpose</label>
        <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
          <option value="">All</option>
          {uniquePurposes.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
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
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#999" }}>
                  No records found.
                </td>
              </tr>
            ) : (
              paginated.map((v) => (
                <tr key={v.id}>
                  <td>{v.name}</td>
                  <td>{v.id}</td>
                  <td>{v.purpose}</td>
                  <td>{v.timeIn}</td>
                  <td>{v.timeOut}</td>
                  <td>{v.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="host-history-pagination">
          <span>
            Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}
            -
            {Math.min(page * perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="host-history-pagination-controls">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>{"<"}</button>
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={page === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={page === pageCount} onClick={() => setPage(page + 1)}>{">"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
