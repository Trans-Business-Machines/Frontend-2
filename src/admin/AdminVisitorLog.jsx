import React, { useState } from "react";
import "./AdminUsers.css"; // reuse styles for table, search, pagination

const mockVisitors = [
  { name: "Alice Smith", idNumber: "38291034", phone: "0712345001", host: "Angela Moss", date: "2025-06-01", time: "Morning", purpose: "Meeting", status: "Checked In" },
  { name: "Bob John", idNumber: "57820013", phone: "0712345002", host: "Paul Black", date: "2025-06-01", time: "Afternoon", purpose: "Delivery", status: "Checked Out" },
  { name: "Carol White", idNumber: "41678390", phone: "0712345003", host: "Emma White", date: "2025-06-01", time: "Evening", purpose: "Interview", status: "Checked In" },
  // ... add other visitors here ...
];

const VISITORS_PER_PAGE = 10;

function formatDateForTable(dateStr) {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-");
    return `${d}-${m}-${y}`;
  }
  return dateStr;
}

export default function AdminVisitorLog() {
  const [visitors] = useState(mockVisitors);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTime, setFilterTime] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterHost, setFilterHost] = useState("");
  const [filterPurpose, setFilterPurpose] = useState("");
  const [page, setPage] = useState(1);

  const filteredVisitors = visitors.filter((v) => {
    const match =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.phone.includes(search) ||
      v.idNumber.includes(search) ||
      v.host.toLowerCase().includes(search.toLowerCase()) ||
      formatDateForTable(v.date).includes(search);
    const statusMatch = filterStatus === "" || v.status === filterStatus;
    const timeMatch = filterTime === "" || v.time === filterTime;
    const dateMatch = !filterDate || v.date === filterDate;
    const hostMatch = filterHost === "" || v.host === filterHost;
    const purposeMatch = filterPurpose === "" || v.purpose === filterPurpose;
    return match && statusMatch && timeMatch && dateMatch && hostMatch && purposeMatch;
  });

  const totalPages = Math.ceil(filteredVisitors.length / VISITORS_PER_PAGE);
  const visitorsToDisplay = filteredVisitors.slice((page - 1) * VISITORS_PER_PAGE, page * VISITORS_PER_PAGE);

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setPage(1);
  }
  function handleFilterStatus(e) {
    setFilterStatus(e.target.value);
    setPage(1);
  }
  function handleFilterTime(e) {
    setFilterTime(e.target.value);
    setPage(1);
  }
  function handleFilterDate(e) {
    setFilterDate(e.target.value);
    setPage(1);
  }
  function handleFilterHost(e) {
    setFilterHost(e.target.value);
    setPage(1);
  }
  function handleFilterPurpose(e) {
    setFilterPurpose(e.target.value);
    setPage(1);
  }

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <div className="admin-users-title">Visitor Log</div>
      </div>

      <div className="admin-users-search" style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 10 }}>
        <input
          placeholder="Search by name, phone, id number, host, date"
          value={search}
          onChange={handleSearchChange}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select value={filterStatus} onChange={handleFilterStatus} style={{ minWidth: 120, padding: "11px 16px", borderRadius: 20 }}>
          <option value="">All Statuses</option>
          <option value="Checked In">Checked In</option>
          <option value="Checked Out">Checked Out</option>
        </select>
        <select value={filterTime} onChange={handleFilterTime} style={{ minWidth: 120, padding: "11px 16px", borderRadius: 20 }}>
          <option value="">All Times</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={handleFilterDate}
          style={{ minWidth: 140, padding: "11px 16px", borderRadius: 20 }}
        />
        <select value={filterHost} onChange={handleFilterHost} style={{ minWidth: 120, padding: "11px 16px", borderRadius: 20 }}>
          <option value="">All Hosts</option>
          {/* Optional: Add dynamic host options */}
        </select>
        <select value={filterPurpose} onChange={handleFilterPurpose} style={{ minWidth: 120, padding: "11px 16px", borderRadius: 20 }}>
          <option value="">All Purposes</option>
          {/* Optional: Add dynamic purpose options */}
        </select>
      </div>

      <table className="admin-users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Id Number</th>
            <th>Phone</th>
            <th>Host</th>
            <th>Date</th>
            <th>Time</th>
            <th>Purpose</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {visitorsToDisplay.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>No visitors found.</td>
            </tr>
          )}
          {visitorsToDisplay.map((visitor, idx) => (
            <tr key={idx}>
              <td>{visitor.name}</td>
              <td>{visitor.idNumber}</td>
              <td>{visitor.phone}</td>
              <td>{visitor.host}</td>
              <td>{formatDateForTable(visitor.date)}</td>
              <td>{visitor.time}</td>
              <td>{visitor.purpose}</td>
              <td>
                <span
                  className={visitor.status === "Checked In" ? "status-active" : "status-inactive"}
                  style={{ whiteSpace: "nowrap", display: "inline-block" }}
                >
                  {visitor.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="admin-users-pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          {"<"}
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button key={idx + 1} onClick={() => setPage(idx + 1)} className={page === idx + 1 ? "active" : ""}>
            {idx + 1}
          </button>
        ))}
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          {">"}
        </button>
      </div>
    </div>
  );
}
