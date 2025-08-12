import "./HostDashboard.css";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { capitalize } from "../utils";
import axiosInstance from "../api/axiosInstance";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import useSWR from "swr";

// Get host visit data
const getHostData = async (url) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

export default function HostDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading } = useSWR(
    user.userId ? `/visits/host/${user.userId}?today=${true}` : null,
    getHostData
  );

  
  return (
    <section className="host-scrollable-content">
      <div className="host-dashboard-wrapper">
        <article className="admin-dashboard-welcome-card">
          <div style={{ paddingBlock: "1.1rem" }}>
            <div className="admin-dashboard-welcome-title">
              Welcome to your dashboard
            </div>
            <div className="admin-dashboard-welcome-sub">
              Here&apos;s an overview of today's activities
            </div>
          </div>
          <div className="admin-dashboard-date-pill">
            {format(new Date(), "PPP")}
          </div>
        </article>

        <article className="host-dashboard-section-header">
          <span className="host-dashboard-section-title">Recent Visits</span>
          <button
            className="host-dashboard-view-more"
            onClick={() => navigate("/host/history")}
          >
            View more
          </button>
        </article>

        {/* Loading State */}
        {isLoading ? (
          <div
            style={{
              background: "white",
              padding: "1.5rem",
              width: "100%",
              borderRadius: "8px",
              fontSize: "1.15rem",
              color: "#285E61",
              fontWeight: "500",
            }}
          >
            <p style={{ textAlign: "center" }}>Loading visits...</p>
          </div>
        ) : data?.hostLogs.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "1.5rem",
              width: "100%",
              borderRadius: "8px",
              fontSize: "1.15rem",
              color: "#285E61",
              fontWeight: "500",
            }}
          >
            <p>You have no visits today.</p>
          </div>
        ) : (
          <>
            <div className="host-dashboard-visits-grid">
              {data?.hostLogs.map((v) => (
                <div className="visit-card" key={v._id}>
                  <div className="visit-type">
                    {capitalize(v.purpose) ?? "Unknown"}
                  </div>

                  <div className="visit-name">
                    {v.firstname} {v.lastname}
                  </div>

                  <div
                    className={`visit-status ${
                      v.status === "checked-in" ? "checked-in" : "checked-out"
                    }`}
                  >
                    {v.status === "checked-in" ? "Checked-in" : "Checked-out"}
                  </div>

                  <div className="visit-time">
                    {format(new Date(v.time_in), "h:mm a")}
                  </div>
                </div>
              ))}
            </div>

            <div className="host-dashboard-pagination">
              <button className="pagination-button" disabled={!data.hasPrev}>
                <FaChevronLeft />
              </button>
              <button className="pagination-button" disabled={!data.hasNext}>
                <FaChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
