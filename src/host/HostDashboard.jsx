import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./HostDashboard.css";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

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
      year: "numeric",
    })
    .replace(/ /g, "-");
}

// Helper to format time nicely
function formatTime(isoString) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

export default function HostDashboard() {
  const navigate = useNavigate();
  const today = getFormattedDate();
  const [currentChunk, setCurrentChunk] = useState(0);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth(); // ✅ Logged-in host

  const hostName = `${user?.firstname ?? ""}`; // Show host's actual name

  useEffect(() => {
    async function fetchVisits() {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `/visits/host/${user.userId}?today=false`
        );

        // ✅ Extract hostLogs safely
        const logs = res.data?.hostLogs || [];
        setVisits(logs);
      } catch (err) {
        console.error("Error fetching visits:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user?.userId) {
      fetchVisits();
    }
  }, [user?.userId]);

  // ✅ Chunk the visits into groups of 4 for pagination
  const visitChunks = useMemo(() => chunkArray(visits, 4), [visits]);

  return (
    <div className="host-scrollable-content">
      <div className="host-dashboard-wrapper">
        {/* Welcome Section */}
        <div className="admin-dashboard-welcome-card">
          <div>
            <div className="admin-dashboard-welcome-title">
              Welcome to your dashboard {hostName}
            </div>
            <div className="admin-dashboard-welcome-sub">
              Here’s an overview of today's activities
            </div>
          </div>
          <div className="admin-dashboard-date-pill">{today}</div>
        </div>

        {/* Recent Visits Section */}
        <div className="host-dashboard-section-header">
          <span className="host-dashboard-section-title">Recent Visits</span>
          <button
            className="host-dashboard-view-more"
            onClick={() => navigate("/host/history")}
          >
            View more...
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <p style={{ textAlign: "center", color: "#666" }}>Loading visits...</p>
        ) : visits.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>
            No visits found yet.
          </p>
        ) : (
          <>
            {/* Visit Cards */}
            <div className="host-dashboard-visits-grid">
              {visitChunks[currentChunk].map((v) => (
                <div className="visit-card" key={v._id}>
                  {/* Purpose (type of visit) */}
                  <div className="visit-type">{v.purpose ?? "Unknown"}</div>

                  {/* Visitor Name */}
                  <div className="visit-name">
                    {v.firstname} {v.lastname}
                  </div>

                  {/* Status */}
                  <div
                    className={`visit-status ${
                      v.status === "checked-in" ? "checked-in" : "checked-out"
                    }`}
                  >
                    {v.status === "checked-in" ? "Checked-in" : "Checked-out"}
                  </div>

                  {/* Time In */}
                  <div className="visit-time">{formatTime(v.time_in)}</div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="host-dashboard-pagination">
              <button
                className="host-dashboard-pagination-btn"
                onClick={() =>
                  setCurrentChunk((prev) => Math.max(prev - 1, 0))
                }
                disabled={currentChunk === 0}
              >
                &lt;
              </button>
              <button
                className="host-dashboard-pagination-btn"
                onClick={() =>
                  setCurrentChunk((prev) =>
                    Math.min(prev + 1, visitChunks.length - 1)
                  )
                }
                disabled={currentChunk === visitChunks.length - 1}
              >
                &gt;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
