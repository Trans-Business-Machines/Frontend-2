import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HostDashboard.css";

// Demo data
const visits = [
  { id: 21398865, type: "Delivery", name: "John Doe", status: "Checked-in", time: "9:12 am" },
  { id: 22749684, type: "Interview", name: "Mark Davis", status: "Checked-in", time: "10:30 am" },
  { id: 37290834, type: "Maintenance", name: "Paul Joe", status: "Checked-in", time: "11:30 am" },
  { id: 42043642, type: "Inquiry", name: "Vivian Joy", status: "Checked-out", time: "3:32 am" }
];

function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function getFormattedDate() {
  const date = new Date();
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    })
    .replace(/ /g, "-");
}

export default function HostDashboard() {
  const navigate = useNavigate();
  const today = getFormattedDate();
  const visitChunks = chunkArray(visits, 4);
  const [currentChunk, setCurrentChunk] = useState(0);

  const hostName = "Samuel";

  return (
    <div className="host-scrollable-content">
      <div className="host-dashboard-wrapper">
        <div className="admin-dashboard-welcome-card">
          <div>
            <div className="admin-dashboard-welcome-title">
              Welcome to your dashboard
            </div>
            <div className="admin-dashboard-welcome-sub">
              Here’s an overview of today's activities
            </div>
          </div>
          <div className="admin-dashboard-date-pill">{today}</div>
        </div>

        <div className="host-dashboard-section-header">
          <span className="host-dashboard-section-title">Recent Visits</span>
          <button
            className="host-dashboard-view-more"
            onClick={() => navigate("/host/history")}
          >
            View more...
          </button>
        </div>

        <div className="host-dashboard-visits-grid">
          {visitChunks[currentChunk].map((v) => (
            <div className="visit-card" key={v.id}>
              <div className="visit-type">{v.type}</div>
              <div className="visit-name">{v.name}</div>
              <div className={`visit-status ${v.status === "Checked-in" ? "checked-in" : "checked-out"}`}>
                {v.status}
              </div>
              <div className="visit-time">{v.time}</div>
            </div>
          ))}
        </div>

        <div className="host-dashboard-pagination">
          <button
            className="host-dashboard-pagination-btn"
            onClick={() => setCurrentChunk((prev) => Math.max(prev - 1, 0))}
            disabled={currentChunk === 0}
          >
            &lt;
          </button>
          <button
            className="host-dashboard-pagination-btn"
            onClick={() => setCurrentChunk((prev) => Math.min(prev + 1, visitChunks.length - 1))}
            disabled={currentChunk === visitChunks.length - 1}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
