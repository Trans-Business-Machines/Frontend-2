import React, { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import axiosInstance from "../api/axiosInstance";
import "./HostHistory.css";

const HOST_ID = "xkb2gzc57rotpy228wtbbvui"; // The host's unique ID
const perPage = 10;

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatTime(timeStr) {
  if (!timeStr) return "-";
  const date = new Date(timeStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// Fetch function
const fetchHostVisits = async (url) => {
  const res = await axiosInstance.get(url);
  return res.data; // Should return { visits: [...] }
};

export default function HostHistory() {
  const [search, setSearch] = useState("");
  const [dateSort, setDateSort] = useState("Descending");
  const [purpose, setPurpose] = useState("");
  const [page, setPage] = useState(1);

  // Fetch visits for this host
  const { data, error, isLoading } = useSWR(
    `/visits/host/${HOST_ID}?today=false`,
    fetchHostVisits
  );

  // Extract visits array safely
  const visits = data?.visits || [];

  // Filter + sort logic
  const filtered = useMemo(() => {
    let results = visits.map((v) => ({
      id: v.national_id || "-",
      name: `${v.firstname || ""} ${v.lastname || ""}`.trim(),
      purpose: v.purpose || "-",
      timeIn: formatTime(v.time_in),
      timeOut: formatTime(v.time_out),
      date: formatDate(v.visit_date),
    }));

    // Search
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      results = results.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.id.toString().includes(query) ||
          v.date.includes(query)
      );
    }

    // Filter by purpose
    if (purpose) {
      results = results.filter((v) => v.purpose === purpose);
    }

    // Sort by date
    results = results.sort((a, b) => {
      const [da, ma, ya] = a.date.split("-").map(Number);
      const [db, mb, yb] = b.date.split("-").map(Number);
      const dateA = new Date(ya, ma - 1, da);
      const dateB = new Date(yb, mb - 1, db);
      return dateSort === "Ascending" ? dateA - dateB : dateB - dateA;
    });

    return results;
  }, [visits, search, dateSort, purpose]);

  // Pagination
  const pageCount = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, dateSort, purpose]);

  const uniquePurposes = [...new Set(visits.map((v) => v.purpose))];

  if (isLoading) {
    return <div className="host-history-page">Loading history...</div>;
  }

  if (error) {
    return (
      <div className="host-history-page" style={{ color: "red" }}>
        Failed to load history: {error.message}
      </div>
    );
  }

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
            <option key={p} value={p}>
              {p}
            </option>
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
              paginated.map((v, idx) => (
                <tr key={idx}>
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

        {/* Pagination controls */}
        <div className="host-history-pagination">
          <span>
            Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}-
            {Math.min(page * perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="host-history-pagination-controls">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              {"<"}
            </button>
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={page === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === pageCount}
              onClick={() => setPage(page + 1)}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
