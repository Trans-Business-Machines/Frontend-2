import "./Dashboard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { IoMdContacts } from "react-icons/io";
import { RiContactsLine } from "react-icons/ri";
import { TiInputCheckedOutline } from "react-icons/ti";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Table from "../components/Table";
import useSWR from "swr";
import axiosInstance from "../api/axiosInstance";

const getTodaysVisitors = async (url) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

const getStats = async (url) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSWR(
    `/visits/today?page=${page}`,
    getTodaysVisitors
  );

  const { data: stats, isLoading: statsLoading } = useSWR("/stats", getStats);

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
      <article className="soldier-welcome-banner soldier-welcome-banner-centered">
        <div className="soldier-banner-center">
          <h2 className="soldier-banner-title">Welcome to your profile</h2>
          <p className="soldier-banner-desc">
            Here's an overview of today's activities
          </p>
        </div>
        <div className="soldier-banner-date">{format(new Date(), "PPP")}</div>
      </article>
      <div className="soldier-stat-card-row">
        <div className="soldier-stat-card">
          <div className="soldier-stat-card-content">
            <div className="soldier-stat-card-label">
              Today's Total Visitors
            </div>
            <div className="soldier-stat-card-value">{stats.visitCount}</div>
          </div>
          <div className="soldier-stat-card-icon">
            <IoMdContacts />
          </div>
        </div>
        <div className="soldier-stat-card">
          <div className="soldier-stat-card-content">
            <div className="soldier-stat-card-label">Active Visitors</div>
            <div className="soldier-stat-card-value">
              {stats.activeVisitors}
            </div>
          </div>
          <div className="soldier-stat-card-icon">
            <RiContactsLine />
          </div>
        </div>
        <div className="soldier-stat-card">
          <div className="soldier-stat-card-content">
            <div className="soldier-stat-card-label">Checked-Out Visitors</div>
            <div className="soldier-stat-card-value">
              {stats.checkedOutVisitors}
            </div>
          </div>
          <div className="soldier-stat-card-icon">
            <TiInputCheckedOutline />
          </div>
        </div>
      </div>
      <div className="dashboard-table-section">
        <div className="dashboard-table-header">
          <h3>Today's Visitors</h3>
          <div>
            <button
              className="dashboard-btn"
              onClick={() => navigate("/visitors-log")}
            >
              View Full Log
            </button>
            <button
              className="dashboard-btn"
              onClick={() => navigate("/check-in")}
            >
              Check In
            </button>
            <button
              className="dashboard-btn"
              onClick={() => navigate("/check-out")}
            >
              Check Out
            </button>
          </div>
        </div>

        {data?.visits?.length === 0 ? (
          <div
            style={{
              paddingBlock: "1rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontWeight: "bold",
                fontSize: "1.45rem",
                color: "#285e61",
              }}
            >
              No Visitors today.
            </p>
          </div>
        ) : (
          <div
            style={{
              marginTop: "1rem",
            }}
          >
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
                className="dashboard-btn"
                onClick={prevPage}
                disabled={!data.hasPrev}
              >
                <FaChevronLeft size={14} />
              </button>
              <button className="current-page-btn">{page}</button>
              <button
                className="dashboard-btn"
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
