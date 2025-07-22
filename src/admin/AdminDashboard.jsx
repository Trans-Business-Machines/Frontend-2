import React, { useState } from "react";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Table from "../components/Table";
import axiosInstance from "../api/axiosInstance";
import "./AdminDashboard.css";

const getTodaysVisitors = async (url) => {
  const res = await get(url);
  return res.data;
};

const getStats = async (url) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

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

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // Fetch only the first page with 10 records for dashboard
  const { data, isLoading } = useSWR(`/visits?page=1&limit=10`, getTodaysVisitors);
  const { data: stats, isLoading: statsLoading } = useSWR("/stats", getStats);

  if (isLoading || statsLoading) {
    return <div>Loading visitors and stats...</div>;
  }

  if (!data || !stats) {
    return <div>Loading dashboard data...</div>;
  }

  const adminName = "Jessica";

  //  Map backend values correctly
  const totalVisitors = stats.visitCount ?? 0;
  const activeVisitors = stats.activeVisitors ?? 0;
  const checkedOutVisitors = stats.checkedOutVisitors ?? 0;

  return (
    <div className="admin-dashboard">
      {/* Welcome Section */}
      <div className="admin-dashboard-welcome-card">
        <div>
          <div className="admin-dashboard-welcome-title">
            Welcome to your dashboard
          </div>
          <div className="admin-dashboard-welcome-sub">
            Here's an overview of today&apos;s activities
          </div>
        </div>
        <div className="admin-dashboard-date-pill">
          {getFormattedDate()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-dashboard-cards-row">
        <div className="admin-dashboard-card">
          <div className="admin-dashboard-card-label">Total Visitors</div>
          <div className="admin-dashboard-card-content">
            <span className="admin-dashboard-card-value">{totalVisitors}</span>
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
          <div className="admin-dashboard-card-label">Active Visitors</div>
          <div className="admin-dashboard-card-content">
            <span className="admin-dashboard-card-value">{activeVisitors}</span>
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
          <div className="admin-dashboard-card-label">Checked Out</div>
          <div className="admin-dashboard-card-content">
            <span className="admin-dashboard-card-value">
              <strong>{checkedOutVisitors}</strong>
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

      {/* Recent Activity Table */}
      <div className="admin-dashboard-table-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "600" }}>Recent Visitors</h3>
          <button 
            onClick={() => navigate("/admin/visitor-log")}
            style={{
              background: "#219150",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500"
            }}
          >
            View More
          </button>
        </div>
        
        {!data.visits || data.visits.length === 0 ? (
          <div style={{ padding: "1rem", textAlign: "center" }}>
            <p style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#285e61" }}>
              No visitors today.
            </p>
          </div>
        ) : (
          <Table visitors={data.visits} />
        )}
      </div>
    </div>
  );
}
