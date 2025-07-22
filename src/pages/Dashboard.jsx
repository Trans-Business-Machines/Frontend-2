import "./Dashboard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { HiDocumentSearch } from "react-icons/hi";
import { IoIosAddCircle, IoMdLogOut } from "react-icons/io";
import Table from "../components/Table";
import useSWR from "swr";
import axiosInstance from "../api/axiosInstance";

const getTodaysVisitors = async (url) => {
  try {
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    console.warn("Error fetching today's visitors:", error?.response?.status, error?.message);
    return { visits: [], hasNext: false, hasPrev: false }; // fallback
  }
};

const getStats = async (url) => {
  try {
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    console.warn("Error fetching stats:", error?.response?.status, error?.message);
    return { visitCount: 0, activeVisitors: 0, checkedOutVisitors: 0 }; // fallback
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data = { visits: [], hasNext: false, hasPrev: false }, isLoading } = useSWR(
    `/visits/today?page=${page}`,
    getTodaysVisitors
  );

  const { data: stats = { visitCount: 0, activeVisitors: 0, checkedOutVisitors: 0 }, isLoading: statsLoading } =
    useSWR("/stats", getStats);

  if (isLoading || statsLoading) {
    return <div>Loading visitors and stats...</div>;
  }

  function nextPage() {
    setPage((prevPage) => prevPage + 1);
  }

  function prevPage() {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  }

  return (
    <section className="dashboard-content soldier-dashboard-bg">
      <article className="soldier-welcome-banner">
        <div className="soldier-banner-center">
          <h2 className="soldier-banner-title">Welcome to your profile</h2>
          <p className="soldier-banner-desc">
            Here's an overview of today's activities
          </p>
        </div>
        <div className="soldier-banner-date">{format(new Date(), "PPP")}</div>
      </article>

      {/* Stats Section */}
      <div className="soldier-stat-card-row">
        <div className="soldier-stat-card">
          <div className="soldier-stat-card-content">
            <div className="soldier-stat-card-label">Today's Total Visitors</div>
            <div className="soldier-stat-card-value">{stats.visitCount ?? 0}</div>
          </div>
          <div className="soldier-stat-card-icon soldier-stat-groupicon">
            <svg width="32" height="32" fill="none">
              <rect width="32" height="32" rx="7" fill="#E2F5EA" />
              <path
                d="M10 24v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1"
                stroke="#2E8E6D"
                strokeWidth="2"
              />
              <circle cx="12" cy="14" r="2" stroke="#2E8E6D" strokeWidth="2" />
              <circle cx="20" cy="14" r="2" stroke="#2E8E6D" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="soldier-stat-card">
          <div className="soldier-stat-card-content">
            <div className="soldier-stat-card-label">Active Visitors</div>
            <div className="soldier-stat-card-value">{stats.activeVisitors ?? 0}</div>
          </div>
          <div className="soldier-stat-card-icon soldier-stat-personicon">
            <svg width="32" height="32" fill="none">
              <rect width="32" height="32" rx="7" fill="#E2F5EA" />
              <circle cx="16" cy="13" r="4" stroke="#2E8E6D" strokeWidth="2" />
              <path
                d="M10 24v-1a6 6 0 0 1 12 0v1"
                stroke="#2E8E6D"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
        <div className="soldier-stat-card">
          <div className="soldier-stat-card-content">
            <div className="soldier-stat-card-label">Checked-Out Visitors</div>
            <div className="soldier-stat-card-value">{stats.checkedOutVisitors ?? 0}</div>
          </div>
          <div className="soldier-stat-card-icon soldier-stat-clockicon">
            <svg width="32" height="32" fill="none">
              <rect width="32" height="32" rx="7" fill="#FFF6E2" />
              <circle cx="16" cy="16" r="10" stroke="#F6C768" strokeWidth="2" />
              <path
                d="M16 11v5l3 3"
                stroke="#F6C768"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Table & Pagination */}
      <div className="dashboard-table-section">
        <div className="dashboard-table-header">
          <h3>Today's Visitors</h3>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="shorcut-btn" onClick={() => navigate("/visitors-log")}>
              <HiDocumentSearch size={24} />
              <span>View full log</span>
            </button>
            <button className="shorcut-btn" onClick={() => navigate("/check-in")}>
              <IoIosAddCircle size={24} />
              <span>Check in</span>
            </button>
            <button className="shorcut-btn" onClick={() => navigate("/check-out")}>
              <IoMdLogOut size={24} />
              <span>Check Out</span>
            </button>
          </div>
        </div>

        {data.visits.length === 0 ? (
          <div style={{ paddingBlock: "1rem", textAlign: "center" }}>
            <p style={{ fontWeight: "bold", fontSize: "1.45rem", color: "#285e61" }}>
              No Visitors today.
            </p>
          </div>
        ) : (
          <div style={{ marginTop: "1rem" }}>
            <Table visitors={data.visits} />

            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "20px",
                marginLeft: "auto",
                justifyContent: "right",
                alignItems: "center",
                width: "40%",
                maxWidth: "400px",
              }}
            >
              <button
                className="pagination-button"
                onClick={prevPage}
                disabled={!data.hasPrev}
              >
                <FaChevronLeft size={14} />
              </button>
              <button className="current-page-btn">{page}</button>
              <button
                className="pagination-button"
                onClick={nextPage}
                disabled={!data.hasNext}
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
