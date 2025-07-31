import "./AdminUsers.css";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { FaCheck, FaXmark } from "react-icons/fa6";
import Snackbar from "../components/Snackbar";
import useSWR from "swr";
import axiosInstance from "../api/axiosInstance";

//  Fetch visitors directly from backend
const fetchVisitors = async (url) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

export default function AdminVisitorLog() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);

  const { data, error, isLoading } = useSWR(
    `/visits?page=${page}`,
    fetchVisitors
  );

  // Default values
  let visitors = [];
  let totalPages = 1;
  let currentPage = page;
  if (data) {
    visitors = data.visits || [];
    totalPages = data.totalPages || 1;
    currentPage = data.currentPage || page;
  }

  //  Filter visitors for current page
  const filteredVisitors = visitors.filter((v) => {
    const searchTerm = search.toLowerCase();
    const fullName = `${v.firstname || ""} ${v.lastname || ""}`.trim();
    const hostName =
      v.host && typeof v.host === "object"
        ? `${v.host.firstname || ""} ${v.host.lastname || ""}`.trim()
        : v.host || "";

    const searchMatch =
      !search ||
      fullName.toLowerCase().includes(searchTerm) ||
      (v.phone || "").toLowerCase().includes(searchTerm) ||
      (v.national_id || "").toLowerCase().includes(searchTerm) ||
      hostName.toLowerCase().includes(searchTerm) ||
      (v.purpose || "").toLowerCase().includes(searchTerm);

    const statusMatch =
      !filterStatus || v.status.toLowerCase() === filterStatus.toLowerCase();

    const dateMatch =
      !filterDate ||
      new Date(v.visit_date).toISOString().split("T")[0] === filterDate;

    return searchMatch && statusMatch && dateMatch;
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterStatus = (e) => {
    setFilterStatus(e.target.value);
    setPage(1);
  };

  const handleFilterDate = (e) => {
    setFilterDate(e.target.value);
    setPage(1);
  };

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Export PDF function with axiosInstance
  const handleExportData = async () => {
    try {
      const today = new Date();
      if (today.getDate() < 20) {
        return toast.custom(
          <Snackbar
            type="error"
            message="Date has to more than 20"
            icon={FaXmark}
          />
        );
      }

      const response = await axiosInstance.get("/report", {
        responseType: "blob", // for file downloads
      });

      //  Create downloadable file
      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "monthly-visitor-report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.custom(
        <Snackbar type="success" message="Report downloaded" icon={FaCheck} />
      );
    } catch (error) {
      console.error("Export error:", error);
      let errorMessage = "Failed to export visitors data.";
      toast.custom(
        <Snackbar type="error" message={errorMessage} icon={FaXmark} />
      );
    }
  };

  // Loading state
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

  //  Error state
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

  //  Render main UI
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
          placeholder="Search by name, phone, ID number, host, or purpose"
          value={search}
          onChange={handleSearchChange}
          style={{ flex: 1, minWidth: 300 }}
        />
        <select
          value={filterStatus}
          onChange={handleFilterStatus}
          style={{ minWidth: 120, padding: "11px 16px", borderRadius: 20 }}
        >
          <option value="">All Statuses</option>
          <option value="checked-in">Checked In</option>
          <option value="checked-out">Checked Out</option>
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={handleFilterDate}
          style={{ minWidth: 140, padding: "11px 16px", borderRadius: 20 }}
        />
      </div>

      {/* Table */}
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
            <th>Checkin soldier</th>
          </tr>
        </thead>
        <tbody>
          {filteredVisitors.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
                No visitors found.
              </td>
            </tr>
          )}
          {filteredVisitors.map((v) => {
            return (
              <tr key={v._id}>
                <td>
                  {v.firstname} {v.lastname}
                </td>
                <td>{v.national_id || ""}</td>
                <td>{v.phone || ""}</td>
                <td>
                  {v.host.firstname} {v.host.lastname}
                </td>
                <td>{format(new Date(v.visit_date), "MMMM do, yyyy")}</td>
                <td>{format(new Date(v.time_in), "hh:mm a")}</td>
                <td>{format(new Date(v.time_out), "hh:mm a") || "-"}</td>
                <td>
                  <span
                    className={
                      v.status === "checked-in"
                        ? "status-active"
                        : "status-inactive"
                    }
                    style={{
                      whiteSpace: "nowrap",
                      display: "inline-block",
                    }}
                  >
                    {v.status}
                  </span>
                </td>
                <td>
                  {v.checkin_officer.firstname} {v.checkin_officer.lastname}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="admin-users-pagination">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
      </div>

      {/* Export button */}
      <div className="export-btn-container">
        <button className="export-btn" onClick={handleExportData}>
          Export Data
        </button>
      </div>
    </div>
  );
}
