import React, { useState } from "react";
import "./VisitorsLog.css";

const sampleVisitors = [
  { name: "John Doe", id: "20215234", host: "Angela Moss", purpose: "Meeting", timeIn: "08:15 AM", timeOut: "10:00 AM", date: "06/23/2025" },
  { name: "Lucy Smith", id: "20215125", host: "Emma White", purpose: "Delivery", timeIn: "12:30 PM", timeOut: "01:00 PM", date: "06/23/2025" },
  { name: "Tom Baker", id: "20215219", host: "John Doe", purpose: "Interview", timeIn: "05:15 PM", timeOut: "", date: "06/23/2025" },
  { name: "Rita Patel", id: "20215327", host: "Angela Moss", purpose: "Consulting", timeIn: "11:00 AM", timeOut: "12:00 PM", date: "06/23/2025" },
  { name: "Sam Johnson", id: "20225341", host: "Emma White", purpose: "Support", timeIn: "09:25 AM", timeOut: "11:12 AM", date: "06/23/2025" },
  { name: "Priya Kumar", id: "20215789", host: "John Doe", purpose: "Delivery", timeIn: "09:45 AM", timeOut: "", date: "06/23/2025" },
  { name: "Victor Chen", id: "20216661", host: "Angela Moss", purpose: "Vendor", timeIn: "12:15 PM", timeOut: "", date: "06/23/2025" },
  { name: "Emily Brown", id: "20218999", host: "Emma White", purpose: "Meeting", timeIn: "01:00 PM", timeOut: "", date: "06/23/2025" },
  { name: "Ahmed Hassan", id: "20213222", host: "John Doe", purpose: "Interview", timeIn: "01:45 PM", timeOut: "02:30 PM", date: "06/23/2025" },
  { name: "Anna Müller", id: "20219900", host: "Angela Moss", purpose: "Support", timeIn: "02:15 PM", timeOut: "", date: "06/23/2025" },
  { name: "James Lee", id: "20218881", host: "Emma White", purpose: "Vendor", timeIn: "03:00 PM", timeOut: "", date: "06/23/2025" },
  { name: "Elena Petrova", id: "20211234", host: "John Doe", purpose: "Delivery", timeIn: "03:30 PM", timeOut: "", date: "06/23/2025" },
  { name: "David Smith", id: "20214321", host: "Angela Moss", purpose: "Meeting", timeIn: "04:00 PM", timeOut: "", date: "06/23/2025" },
  { name: "Yusuf Adeyemi", id: "20215555", host: "Emma White", purpose: "Consulting", timeIn: "04:25 PM", timeOut: "", date: "06/23/2025" },
  { name: "Sofia Gonzalez", id: "20216666", host: "John Doe", purpose: "Support", timeIn: "04:55 PM", timeOut: "05:30 PM", date: "06/23/2025" },
];

const periods = [
  { label: "All", value: "All" },
  { label: "Morning", value: "Morning" },
  { label: "Afternoon", value: "Afternoon" },
  { label: "Evening", value: "Evening" },
];

export default function VisitorsLog() {
  const [filters, setFilters] = useState({
    period: "All",
    date: "",
    host: "",
    purpose: ""
  });

  const [page, setPage] = useState(1);
  const perPage = 10;
  const pageCount = Math.ceil(sampleVisitors.length / perPage);

  const filteredVisitors = sampleVisitors.filter(v => {
    let pass = true;
    if (filters.date) pass = pass && v.date === filters.date;
    if (filters.host) pass = pass && v.host === filters.host;
    if (filters.purpose) pass = pass && v.purpose === filters.purpose;
    if (filters.period !== "All") {
      const hour = parseInt(v.timeIn.split(":")[0], 10);
      const isPM = v.timeIn.includes("PM");
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      if (filters.period === "Morning" && (hour < 0 || hour >= 12)) pass = false;
      if (filters.period === "Afternoon" && (hour < 12 || hour >= 17)) pass = false;
      if (filters.period === "Evening" && (hour < 17)) pass = false;
    }
    return pass;
  });

  const pagedVisitors = filteredVisitors.slice((page - 1) * perPage, page * perPage);

  React.useEffect(() => {
    setPage(1);
  }, [filters.date, filters.host, filters.purpose, filters.period]);

  return (
    <div className="visitorslog-content">
      <div className="visitorslog-header-center">
        <div>
          <h2>Visitors Log</h2>
          <p>View and filter all visitor activity records</p>
        </div>
      </div>
      <form className="visitorslog-filters-row">
        <select
          value={filters.period}
          onChange={e => setFilters(f => ({ ...f, period: e.target.value }))}
        >
          {periods.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <input
          type="date"
          value={filters.date}
          onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
          placeholder="mm/dd/yyyy"
        />
        <select
          value={filters.host}
          onChange={e => setFilters(f => ({ ...f, host: e.target.value }))}
        >
          <option value="">Host (Select)</option>
          {/* No options, backend will populate */}
        </select>
        <select
          value={filters.purpose}
          onChange={e => setFilters(f => ({ ...f, purpose: e.target.value }))}
        >
          <option value="">Purpose (Select)</option>
          {/* No options, backend will populate */}
        </select>
      </form>
      <div className="visitorslog-table-section">
        <table className="visitorslog-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>ID Number</th>
              <th>Host</th>
              <th>Purpose</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {pagedVisitors.length === 0 ? (
              <tr>
                <td colSpan={7} style={{textAlign: "center", color: "#888"}}>No records found.</td>
              </tr>
            ) : (
              pagedVisitors.map((v, i) => (
                <tr key={i}>
                  <td>{v.name}</td>
                  <td>{v.id}</td>
                  <td>{v.host || "-"}</td>
                  <td>{v.purpose || "-"}</td>
                  <td>{v.timeIn}</td>
                  <td>{v.timeOut || "-"}</td>
                  <td>{v.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="visitorslog-pagination">
          <span>
            Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filteredVisitors.length)} of {filteredVisitors.length}
          </span>
          <div className="visitorslog-pagination-controls">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>{"<"}</button>
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i + 1}
                className={page === i + 1 ? "active" : ""}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={page === pageCount} onClick={() => setPage(page + 1)}>{">"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}