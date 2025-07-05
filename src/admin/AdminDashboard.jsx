import React, { useState } from "react";
import "./AdminDashboard.css";

// Mixed users and visitors, each has a type and appropriate actions
const mockData = [
  { type: "User", name: "Angela Moss", email: "angela@company.com", action: "Added" },
  { type: "User", name: "John Doe", email: "john@company.com", action: "Deleted" },
  { type: "Visitor", name: "Lucy Smith", email: "lucy@company.com", action: "Checked in" },
  { type: "User", name: "Paul Black", email: "paul@company.com", action: "Added" },
  { type: "Visitor", name: "Carl Evans", email: "carl@company.com", action: "Checked out" },
  { type: "User", name: "Ava Brown", email: "ava@company.com", action: "Added" },
  { type: "Visitor", name: "Bella Frost", email: "bella@company.com", action: "Checked in" },
  { type: "User", name: "Liam Lee", email: "liam@company.com", action: "Added" },
  { type: "Visitor", name: "Kim Hunt", email: "kim@company.com", action: "Checked in" },
  { type: "User", name: "Zara Blue", email: "zara@company.com", action: "Added" },
  { type: "Visitor", name: "Noah Gill", email: "noah@company.com", action: "Checked out" },
  { type: "Visitor", name: "Rita Moss", email: "rita@company.com", action: "Checked in" },
  { type: "Visitor", name: "Steve Nash", email: "steve@company.com", action: "Checked out" },
];

const ROWS_PER_PAGE = 6;

// Calculate stats
const stats = {
  totalUsers: mockData.filter(d => d.type === "User").length,
  todaysTotalVisitors: mockData.filter(d => d.type === "Visitor").length,
  checkedIn: mockData.filter(d => d.action === "Checked in").length,
  checkedOut: mockData.filter(d => d.action === "Checked out").length,
};

export default function AdminDashboard() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(mockData.length / ROWS_PER_PAGE);
  const rowsToDisplay = mockData.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  return (
    <div className="admin-dashboard">
      <div className="admin-profile-welcome-box">
        <div className="admin-profile-welcome-title">Welcome, Admin!</div>
        <div className="admin-profile-welcome-sub">
          Here is an overview of your system users and visitors.
        </div>
      </div>

      {/* Statistic Cards */}
      <div className="admin-dashboard-cards-row">
        <div className="admin-dashboard-card">
          <div className="admin-dashboard-card-label">Total Users</div>
          <div className="admin-dashboard-card-content">
            <span className="admin-dashboard-card-value">{stats.totalUsers}</span>
            <span className="admin-dashboard-card-icon" style={{ background: "#219150" }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <g>
                  <path fill="#fff" d="M16.5 13c2.485 0 4.5 2.015 4.5 4.5V21h-2v-3.5a2.5 2.5 0 0 0-5 0V21h-2v-3.5c0-2.485 2.015-4.5 4.5-4.5Z"/>
                  <circle cx="16.5" cy="9" r="2.5" fill="#fff"/>
                  <path fill="#fff" d="M7.5 13c2.485 0 4.5 2.015 4.5 4.5V21h-2v-3.5a2.5 2.5 0 0 0-5 0V21h-2v-3.5C2 15.015 4.015 13 7.5 13Z"/>
                  <circle cx="7.5" cy="9" r="2.5" fill="#fff"/>
                </g>
              </svg>
            </span>
          </div>
        </div>
        <div className="admin-dashboard-card">
          <div className="admin-dashboard-card-label">Today's Total Visitors</div>
          <div className="admin-dashboard-card-content">
            <span className="admin-dashboard-card-value">{stats.todaysTotalVisitors}</span>
            <span className="admin-dashboard-card-icon" style={{ background: "#e8f7f2" }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <g>
                  <path fill="#219150" d="M16.5 13c2.485 0 4.5 2.015 4.5 4.5V21h-2v-3.5a2.5 2.5 0 0 0-5 0V21h-2v-3.5c0-2.485 2.015-4.5 4.5-4.5Z"/>
                  <circle cx="16.5" cy="9" r="2.5" fill="#219150"/>
                  <path fill="#219150" d="M7.5 13c2.485 0 4.5 2.015 4.5 4.5V21h-2v-3.5a2.5 2.5 0 0 0-5 0V21h-2v-3.5C2 15.015 4.015 13 7.5 13Z"/>
                  <circle cx="7.5" cy="9" r="2.5" fill="#219150"/>
                </g>
              </svg>
            </span>
          </div>
        </div>
        <div className="admin-dashboard-card">
          <div className="admin-dashboard-card-label">Checked In / Checked Out</div>
          <div className="admin-dashboard-card-content">
            <span className="admin-dashboard-card-value">
              <span style={{ fontWeight: 700 }}>{stats.checkedIn}</span> / <span style={{ fontWeight: 700 }}>{stats.checkedOut}</span>
            </span>
            <span className="admin-dashboard-card-icon" style={{ background: "#219150" }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <g>
                  <circle cx="12" cy="8" r="4" fill="#fff"/>
                  <rect x="6" y="14" width="12" height="7" rx="3.5" fill="#fff"/>
                </g>
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-dashboard-table-section">
        <table className="admin-dashboard-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rowsToDisplay.map((row, idx) => (
              <tr key={row.email + row.action + idx}>
                <td>{row.type}</td>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="admin-dashboard-pagination">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>{"<"}</button>
          {[...Array(totalPages)].map((_, idx) => (
            <button key={idx + 1} onClick={() => setPage(idx + 1)} className={page === idx + 1 ? "active" : ""}>{idx + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>{">"}</button>
        </div>
      </div>
    </div>
  );
}