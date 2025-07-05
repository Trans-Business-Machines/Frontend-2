import React, { useState } from "react";
import "./AdminUsers.css"; // reuse styles for table, search, pagination

// 40 visitors, idNumber is 8 random digits (not starting with 07), company REMOVED
const mockVisitors = [
  { name: "Alice Smith", idNumber: "38291034", phone: "0712345001", host: "Angela Moss", date: "2025-06-01", time: "Morning", purpose: "Meeting", status: "Checked In" },
  { name: "Bob John", idNumber: "57820013", phone: "0712345002", host: "Paul Black", date: "2025-06-01", time: "Afternoon", purpose: "Delivery", status: "Checked Out" },
  { name: "Carol White", idNumber: "41678390", phone: "0712345003", host: "Emma White", date: "2025-06-01", time: "Evening", purpose: "Interview", status: "Checked In" },
  { name: "David Green", idNumber: "82591037", phone: "0712345004", host: "Sam Green", date: "2025-06-09", time: "Morning", purpose: "Meeting", status: "Checked Out" },
  { name: "Eve Black", idNumber: "21983746", phone: "0712345005", host: "Angela Moss", date: "2025-06-20", time: "Afternoon", purpose: "Interview", status: "Checked In" },
  { name: "Frank Brown", idNumber: "74019283", phone: "0712345006", host: "Paul Black", date: "2025-06-04", time: "Evening", purpose: "Delivery", status: "Checked In" },
  { name: "Grace Lee", idNumber: "98371025", phone: "0712345007", host: "Emma White", date: "2025-06-04", time: "Morning", purpose: "Meeting", status: "Checked Out" },
  { name: "Henry King", idNumber: "61820374", phone: "0712345008", host: "Sam Green", date: "2025-06-05", time: "Afternoon", purpose: "Interview", status: "Checked In" },
  { name: "Ivy Stone", idNumber: "30498176", phone: "0712345009", host: "Angela Moss", date: "2025-06-05", time: "Morning", purpose: "Meeting", status: "Checked Out" },
  { name: "Jake Fox", idNumber: "47581029", phone: "0712345010", host: "Paul Black", date: "2025-06-06", time: "Afternoon", purpose: "Delivery", status: "Checked Out" },
  { name: "Kim Hunt", idNumber: "28763491", phone: "0712345011", host: "Emma White", date: "2025-06-06", time: "Evening", purpose: "Interview", status: "Checked In" },
  { name: "Leo West", idNumber: "89123740", phone: "0712345012", host: "Sam Green", date: "2025-06-07", time: "Morning", purpose: "Meeting", status: "Checked Out" },
  { name: "Mona Rose", idNumber: "16734029", phone: "0712345013", host: "Angela Moss", date: "2025-06-07", time: "Afternoon", purpose: "Interview", status: "Checked In" },
  { name: "Ned Stark", idNumber: "29081347", phone: "0712345014", host: "Paul Black", date: "2025-06-08", time: "Evening", purpose: "Delivery", status: "Checked In" },
  { name: "Olga North", idNumber: "73528491", phone: "0712345015", host: "Emma White", date: "2025-06-08", time: "Morning", purpose: "Meeting", status: "Checked Out" },
  { name: "Pete Ford", idNumber: "82193745", phone: "0712345016", host: "Sam Green", date: "2025-06-09", time: "Afternoon", purpose: "Interview", status: "Checked In" },
  { name: "Quinn Lake", idNumber: "54819730", phone: "0712345017", host: "Angela Moss", date: "2025-06-09", time: "Evening", purpose: "Delivery", status: "Checked Out" },
  { name: "Rita Moss", idNumber: "93027184", phone: "0712345018", host: "Paul Black", date: "2025-06-10", time: "Morning", purpose: "Meeting", status: "Checked In" },
  { name: "Steve Nash", idNumber: "18294736", phone: "0712345019", host: "Emma White", date: "2025-06-10", time: "Afternoon", purpose: "Interview", status: "Checked Out" },
  { name: "Tina Bell", idNumber: "45723901", phone: "0712345020", host: "Sam Green", date: "2025-06-11", time: "Evening", purpose: "Delivery", status: "Checked In" },
  { name: "Uma Price", idNumber: "79238146", phone: "0712345021", host: "Angela Moss", date: "2025-06-11", time: "Morning", purpose: "Meeting", status: "Checked In" },
  { name: "Victor Shaw", idNumber: "34981276", phone: "0712345022", host: "Paul Black", date: "2025-06-12", time: "Afternoon", purpose: "Delivery", status: "Checked Out" },
  { name: "Wendy Young", idNumber: "60931728", phone: "0712345023", host: "Emma White", date: "2025-06-12", time: "Evening", purpose: "Interview", status: "Checked In" },
  { name: "Xander Cruz", idNumber: "18572934", phone: "0712345024", host: "Sam Green", date: "2025-06-13", time: "Morning", purpose: "Meeting", status: "Checked Out" },
  { name: "Yara Lane", idNumber: "34781920", phone: "0712345025", host: "Angela Moss", date: "2025-06-13", time: "Afternoon", purpose: "Interview", status: "Checked In" },
  { name: "Zane Cook", idNumber: "90812736", phone: "0712345026", host: "Paul Black", date: "2025-06-14", time: "Evening", purpose: "Delivery", status: "Checked Out" },
  { name: "Aaron Miles", idNumber: "27390184", phone: "0712345027", host: "Emma White", date: "2025-06-14", time: "Morning", purpose: "Meeting", status: "Checked In" },
  { name: "Bella Frost", idNumber: "92038417", phone: "0712345028", host: "Sam Green", date: "2025-06-15", time: "Afternoon", purpose: "Interview", status: "Checked Out" },
  { name: "Carlos Voss", idNumber: "19482037", phone: "0712345029", host: "Angela Moss", date: "2025-06-15", time: "Evening", purpose: "Delivery", status: "Checked In" },
  { name: "Dana Grey", idNumber: "80317492", phone: "0712345030", host: "Paul Black", date: "2025-06-16", time: "Morning", purpose: "Meeting", status: "Checked Out" },
  { name: "Eli Hope", idNumber: "37481920", phone: "0712345031", host: "Emma White", date: "2025-06-16", time: "Afternoon", purpose: "Interview", status: "Checked In" },
  { name: "Faye Pike", idNumber: "61023847", phone: "0712345032", host: "Sam Green", date: "2025-06-17", time: "Evening", purpose: "Delivery", status: "Checked Out" },
  { name: "Gabe Oak", idNumber: "82374910", phone: "0712345033", host: "Angela Moss", date: "2025-06-17", time: "Morning", purpose: "Meeting", status: "Checked In" },
  { name: "Holly Reed", idNumber: "91028374", phone: "0712345034", host: "Paul Black", date: "2025-06-18", time: "Afternoon", purpose: "Interview", status: "Checked Out" },
  { name: "Irene Neal", idNumber: "18472903", phone: "0712345035", host: "Emma White", date: "2025-06-18", time: "Evening", purpose: "Delivery", status: "Checked In" },
  { name: "Jason Vale", idNumber: "83749201", phone: "0712345036", host: "Sam Green", date: "2025-06-19", time: "Morning", purpose: "Meeting", status: "Checked Out" },
  { name: "Kira Moon", idNumber: "20418397", phone: "0712345037", host: "Angela Moss", date: "2025-06-19", time: "Afternoon", purpose: "Interview", status: "Checked In" },
  { name: "Liam Ford", idNumber: "70192834", phone: "0712345038", host: "Paul Black", date: "2025-06-20", time: "Evening", purpose: "Delivery", status: "Checked Out" },
  { name: "Maya Ross", idNumber: "59183720", phone: "0712345039", host: "Emma White", date: "2025-06-20", time: "Morning", purpose: "Meeting", status: "Checked In" },
  { name: "Noah Gill", idNumber: "38294710", phone: "0712345040", host: "Sam Green", date: "2025-06-21", time: "Afternoon", purpose: "Interview", status: "Checked Out" }
];

const VISITORS_PER_PAGE = 10;

function formatDateForTable(dateStr) {
  // Accepts 'yyyy-mm-dd' and returns 'dd-mm-yyyy'
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

  // Filter and search logic
  const filteredVisitors = visitors.filter(v => {
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

  // If search/filter changes, reset page to 1
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
        <select value={filterStatus} onChange={handleFilterStatus} style={{ minWidth: 120, padding: "11px 16px", borderRadius: 20, border: "1px solid #d0d6d9" }}>
          <option value="">All Statuses</option>
          <option value="Checked In">Checked In</option>
          <option value="Checked Out">Checked Out</option>
        </select>
        <select value={filterTime} onChange={handleFilterTime} style={{ minWidth: 120, padding: "11px 16px", borderRadius: 20, border: "1px solid #d0d6d9" }}>
          <option value="">All Times</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </select>
        {/* Date filter with calendar */}
        <input
          type="date"
          value={filterDate}
          onChange={handleFilterDate}
          style={{ minWidth: 140, padding: "11px 16px", borderRadius: 20, border: "1px solid #d0d6d9" }}
        />
        <select value={filterHost} onChange={handleFilterHost} style={{ minWidth: 120, padding: "11px 16px", borderRadius: 20, border: "1px solid #d0d6d9" }}>
          <option value="">All Hosts</option>
        </select>
        <select value={filterPurpose} onChange={handleFilterPurpose} style={{ minWidth: 120, padding: "11px 16px", borderRadius: 20, border: "1px solid #d0d6d9" }}>
          <option value="">All Purposes</option>
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
          {visitorsToDisplay.length === 0 &&
            <tr><td colSpan={8} style={{textAlign:"center"}}>No visitors found.</td></tr>
          }
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
                  style={{
                    whiteSpace: "nowrap", // Ensures status stays in one line
                    display: "inline-block"
                  }}
                >
                  {visitor.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="admin-users-pagination">
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>{"<"}</button>
        {[...Array(totalPages)].map((_, idx) => (
          <button key={idx+1} onClick={() => setPage(idx+1)} className={page === idx+1 ? "active" : ""}>{idx+1}</button>
        ))}
        <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>{" > "}</button>
      </div>
    </div>
  );
}