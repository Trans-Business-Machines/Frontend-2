"use client";

import { useState } from "react";
import "./AdminUsers.css";
import useSWR from "swr";
import axiosInstance from "../api/axiosInstance";

const VISITORS_PER_PAGE = 10;

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB"); // DD/MM/YYYY
}

function formatDateForFilter(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0]; // YYYY-MM-DD for filtering
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AdminVisitorLog() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);

  // Fetch all visits with pagination
  const fetchVisitors = async (url) => {
    const res = await axiosInstance.get(url);
    console.log("Visitors API response:", res.data);
    return res.data;
  };

  const { data, error, isLoading } = useSWR(
    `/visits?page=${page}&limit=${VISITORS_PER_PAGE}`,
    fetchVisitors
  );

  let visitors = [];
  let totalPages = 1;

  if (data) {
    if (Array.isArray(data)) {
      visitors = data;
    } else if (data.visits) {
      visitors = data.visits;
      totalPages =
        data.totalPages ||
        Math.ceil((data.total || visitors.length) / VISITORS_PER_PAGE);
    } else if (data.data) {
      visitors = data.data;
      totalPages =
        data.totalPages ||
        Math.ceil((data.total || visitors.length) / VISITORS_PER_PAGE);
    }
  }

  // ✅ Normalize visits into a consistent shape
  const normalizedVisitors = visitors.map((v) => ({
    id: v._id,
    name: `${v.firstname || ""} ${v.lastname || ""}`.trim(),
    idNumber: v.national_id || "-",
    phone: v.phone || "",
    host: v.host ? `${v.host.firstname || ""} ${v.host.lastname || ""}`.trim() : "-",
    status: v.status || "checked-out",
    date: formatDateForFilter(v.visit_date), // for filtering
    visitDate: v.visit_date, // full date
    timeIn: v.time_in || v.visit_date,
    timeOut: v.time_out || null, // might not exist yet
  }));

  // ✅ Filtering logic
  const filteredVisitors = normalizedVisitors.filter((v) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      !search ||
      v.name.toLowerCase().includes(searchTerm) ||
      v.phone.includes(search) ||
      v.idNumber.includes(search) ||
      v.host.toLowerCase().includes(searchTerm);

    const matchesStatus =
      !filterStatus || v.status.toLowerCase() === filterStatus.toLowerCase();

    const matchesDate =
      !filterDate || v.date === filterDate; // compare YYYY-MM-DD

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleFilterStatus = (e) => setFilterStatus(e.target.value);
  const handleFilterDate = (e) => setFilterDate(e.target.value);
  const handlePageChange = (newPage) => setPage(newPage);

  if (isLoading) {
    return (
      <div className="admin-users">
        <div className="admin-users-header">
          <div className="admin-users-title">Visitor Log</div>
        </div>
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading visitors...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-users">
        <div className="admin-users-header">
          <div className="admin-users-title">Visitor Log</div>
        </div>
        <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
          Error loading visitors: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <div className="admin-users-title">Visitor Log</div>
      </div>

      {/* Search & Filters */}
      <div
        className="admin-users-search"
        style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 10 }}
      >
        <input
          placeholder="Search by name, phone, ID number, or host"
          value={search}
          onChange={handleSearchChange}
          style={{ flex: 1, minWidth: 300 }}
        />

        <select
          value={filterStatus}
          onChange={handleFilterStatus}
          style={{ minWidth: 140, padding: "11px 16px", borderRadius: 20 }}
        >
          <option value="">All Statuses</option>
          <option value="checked-in">Checked In</option>
          <option value="checked-out">Checked Out</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={handleFilterDate}
          style={{ minWidth: 160, padding: "11px 16px", borderRadius: 20 }}
        />
      </div>

      {/* Visitors Table */}
      <table className="admin-users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID Number</th>
            <th>Phone</th>
            <th>Host</th>
            <th>Date</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredVisitors.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
                No visitors found.
              </td>
            </tr>
          ) : (
            filteredVisitors.map((v) => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{v.idNumber}</td>
                <td>{v.phone}</td>
                <td>{v.host}</td>
                <td>{formatDate(v.visitDate)}</td>
                <td>{formatTime(v.timeIn)}</td>
                <td>{v.timeOut ? formatTime(v.timeOut) : "-"}</td>
                <td>
                  <span
                    className={
                      v.status.toLowerCase() === "checked-in"
                        ? "status-active"
                        : "status-inactive"
                    }
                    style={{ textTransform: "capitalize" }}
                  >
                    {v.status.replace("-", " ")}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="admin-users-pagination">
        <button
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          {"<"}
        </button>

        {[...Array(Math.min(5, totalPages))].map((_, idx) => {
          const pageNum = Math.max(1, Math.min(totalPages, page - 2 + idx));
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={page === pageNum ? "active" : ""}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
