import "./HostHistory.css";
import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { capitalize } from "../utils/index";
import { format } from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import useSWR from "swr";
import axiosInstance from "../api/axiosInstance";

// SWR fetcher function
const getHostVisitLogs = async (url) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

export default function HostHistory() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  // Fetch the information from the backend API
  const { data: hostsData, isLoading: loading } = useSWR(
    `/visits/host/${user.userId}?today=false&page=${page}`,
    getHostVisitLogs
  );

  // filtered logs
  const filtered = useMemo(() => {
    const logs = hostsData?.hostLogs || [];

    if (!search) return logs;

    const term = search.toLowerCase().trim();

    const filteredLogs = logs.filter((log) => {
      const matchText =
        log.firstname.toLowerCase().includes(term) ||
        log.lastname.toLowerCase().includes(term) ||
        log.national_id.includes(term) ||
        log.purpose.includes(term);

      const visitDate = format(new Date(log.visit_date), "dd-MM-yyyy");
      const matchesDate = visitDate.includes(term);

      return matchText || matchesDate;
    });

    return filteredLogs;
  }, [hostsData, search]);

  const moveTo = (page) => {
    setPage(page);
  };

  return (
    <div className="host-history-page">
      <h2 className="host-history-title">Visitor Check-in History</h2>
      <p className="host-history-desc">
        Need to look back? Filter and browse previous guest check-ins.
      </p>

      {loading && (
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
          <p style={{ textAlign: "center" }}>Loading visits data...</p>
        </div>
      )}
      {!loading && hostsData && (
        <>
          {/* Search + Filters */}
          <input
            type="text"
            className="host-history-search"
            placeholder="Search by visitor, id or date (dd-mm-yyyy)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              marginBlock: "1.5rem",
            }}
          />

          {/* Table */}
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
                {filtered?.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{ textAlign: "center", color: "#999" }}
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  filtered?.map((v) => (
                    <tr key={v._id}>
                      <td>{`${v.firstname ?? ""} ${v.lastname ?? ""}`}</td>
                      <td>{v.national_id}</td>
                      <td>{capitalize(v.purpose)}</td>
                      <td>{format(new Date(v.time_in), "hh: mm a")}</td>
                      <td>
                        {v.time_out
                          ? format(new Date(v.time_out), "hh:mm a")
                          : "-"}
                      </td>
                      <td>{format(new Date(v.visit_date), "dd-MM-yyyy")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="host-history-pagination">
              <span>
                Showing {hostsData.current} of {hostsData.totalPages}
              </span>

              <div className="pagination-btn-container">
                <button
                  onClick={() => moveTo(page - 1)}
                  className="pagination-button"
                  disabled={!hostsData.hasPrev}
                >
                  <FaChevronLeft />
                </button>
                <button className="current-page-btn">
                  {hostsData.current}
                </button>
                <button
                  onClick={() => moveTo(page + 1)}
                  className="pagination-button"
                  disabled={!hostsData.hasNext}
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
