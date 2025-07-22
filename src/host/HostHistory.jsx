import { useState } from "react";
import useSWR from "swr";
import "./HostHistory.css";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

// Helper to format time
function formatTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const strMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${strMinutes} ${ampm}`;
}

// Helper to format date
function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// SWR fetcher
const fetcher = async (url) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

// Hardcoded purposes
const visitPurposes = [
  "business meeting",
  "job interview",
  "client consultation",
  "vendor delivery",
  "maintenance",
  "it support",
  "training workshop",
  "office tour",
  "inspection audit",
  "executive visit",
  "networking event",
  "hr appointment",
  "legal compliance meeting",
  "follow up",
];

export default function HostHistory() {
  const [search, setSearch] = useState("");
  const [dateSort, setDateSort] = useState("Descending");
  const [purpose, setPurpose] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { user } = useAuth();

  const { data: hostsData, error, isLoading: loading } = useSWR(
    `/visits/host/${user.userId}?today=false`,
    fetcher
  );

  //  Extract the actual host logs array safely
  const hosts = Array.isArray(hostsData)
    ? hostsData
    : hostsData?.hostLogs || [];

  // Filter + Search
  const filtered = hosts.filter((v) => {
    const fullName = `${v.firstname ?? ""} ${v.lastname ?? ""}`.toLowerCase();
    const nationalId = v.national_id ?? "";
    const visitDate = formatDate(v.visit_date);
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      nationalId.includes(search) ||
      visitDate.includes(search);

    const matchesPurpose = purpose ? v.purpose === purpose : true;
    return matchesSearch && matchesPurpose;
  });

  // Sort by date
  const sorted = filtered.sort((a, b) => {
    const dateA = new Date(a.visit_date);
    const dateB = new Date(b.visit_date);
    return dateSort === "Ascending" ? dateA - dateB : dateB - dateA;
  });

  // Paginate
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);
  const pageCount = Math.ceil(filtered.length / perPage);

  return (
    <div className="host-history-page">
      <h2 className="host-history-title">Visitor Check-in History</h2>
      <p className="host-history-desc">
        Need to look back? Filter and browse previous guest check-ins.
      </p>

      {loading && (
        <p style={{ textAlign: "center", color: "#666" }}>Loading data...</p>
      )}
      {error && (
        <p style={{ textAlign: "center", color: "red" }}>
          Error: {error.message}{" "}
          {error.status ? `(Status: ${error.status})` : ""}
        </p>
      )}

      {!loading && !error && (
        <>
          {/* Search + Filters */}
          <input
            type="text"
            className="host-history-search"
            placeholder="Search by visitor, id or date (dd-mm-yyyy)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="host-history-filter-row">
            <label>Date</label>
            <select
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value)}
            >
              <option>Ascending</option>
              <option>Descending</option>
            </select>

            <label>Purpose</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            >
              <option value="">All</option>
              {visitPurposes.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

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
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", color: "#999" }}>
                      No records found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((v) => (
                    <tr key={v._id}>
                      <td>{`${v.firstname ?? ""} ${v.lastname ?? ""}`}</td>
                      <td>{v.national_id}</td>
                      <td>{v.purpose}</td>
                      <td>{formatTime(v.time_in)}</td>
                      <td>{v.time_out ? formatTime(v.time_out) : "-"}</td>
                      <td>{formatDate(v.visit_date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="host-history-pagination">
              <span>
                Showing{" "}
                {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} -{" "}
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
        </>
      )}
    </div>
  );
}
