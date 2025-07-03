import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";
import { IoMdContacts } from "react-icons/io";
import { RiContactsLine } from "react-icons/ri";
import { TiInputCheckedOutline } from "react-icons/ti";

function getFormattedDate() {
  const dateObj = new Date();
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = dateObj.toLocaleString("default", { month: "long" });
>>>>>>> 1b39092 (complete Soldier User Interface)
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
}

const allVisitors = [
  { name: "John Doe", id: "20215234", host: "Angela Moss", in: "08:15 AM", out: "", status: "Checked In" },
  { name: "Lucy Smith", id: "20215125", host: "Emma White", in: "08:50 AM", out: "10:33 AM", status: "Checked Out" },
  { name: "Tom Baker", id: "20215219", host: "John Doe", in: "10:45 AM", out: "", status: "Checked In" },
  { name: "Rita Patel", id: "20215327", host: "Angela Moss", in: "11:05 AM", out: "", status: "Checked In" },
  { name: "Sam Johnson", id: "20225341", host: "Emma White", in: "09:25 AM", out: "11:12 AM", status: "Checked Out" },
  { name: "Priya Kumar", id: "20215789", host: "John Doe", in: "09:45 AM", out: "", status: "Checked In" },
  { name: "Victor Chen", id: "20216661", host: "Angela Moss", in: "12:15 PM", out: "", status: "Checked In" },
  { name: "Emily Brown", id: "20218999", host: "Emma White", in: "01:00 PM", out: "", status: "Checked In" },
  { name: "Ahmed Hassan", id: "20213222", host: "John Doe", in: "01:45 PM", out: "02:30 PM", status: "Checked Out" },
  { name: "Anna Müller", id: "20219900", host: "Angela Moss", in: "02:15 PM", out: "", status: "Checked In" },
  { name: "James Lee", id: "20218881", host: "Emma White", in: "03:00 PM", out: "", status: "Checked In" },
  { name: "Elena Petrova", id: "20211234", host: "John Doe", in: "03:30 PM", out: "", status: "Checked In" },
  { name: "David Smith", id: "20214321", host: "Angela Moss", in: "04:00 PM", out: "", status: "Checked In" },
  { name: "Yusuf Adeyemi", id: "20215555", host: "Emma White", in: "04:25 PM", out: "", status: "Checked In" },
  { name: "Sofia Gonzalez", id: "20216666", host: "John Doe", in: "04:55 PM", out: "05:30 PM", status: "Checked Out" },
];

<<<<<<< HEAD
const allVisitors = [
  { name: 'John Doe', id: '20215234', host: 'Angela Moss', in: '08:15 AM', out: '', status: 'Checked In' },
  { name: 'Lucy Smith', id: '20215125', host: 'Emma White', in: '08:50 AM', out: '10:33 AM', status: 'Checked Out' },
  { name: 'Tom Baker', id: '20215219', host: 'John Doe', in: '10:45 AM', out: '', status: 'Checked In' },
  { name: 'Rita Patel', id: '20215327', host: 'Angela Moss', in: '11:05 AM', out: '', status: 'Checked In' },
  { name: 'Sam Johnson', id: '20225341', host: 'Emma White', in: '09:25 AM', out: '11:12 AM', status: 'Checked Out' },
  { name: 'Priya Kumar', id: '20215789', host: 'John Doe', in: '09:45 AM', out: '', status: 'Checked In' },
  { name: 'Victor Chen', id: '20216661', host: 'Angela Moss', in: '12:15 PM', out: '', status: 'Checked In' },
  { name: 'Emily Brown', id: '20218999', host: 'Emma White', in: '01:00 PM', out: '', status: 'Checked In' },
  { name: 'Ahmed Hassan', id: '20213222', host: 'John Doe', in: '01:45 PM', out: '02:30 PM', status: 'Checked Out' },
  { name: 'Anna Müller', id: '20219900', host: 'Angela Moss', in: '02:15 PM', out: '', status: 'Checked In' },
  { name: 'James Lee', id: '20218881', host: 'Emma White', in: '03:00 PM', out: '', status: 'Checked In' },
  { name: 'Elena Petrova', id: '20211234', host: 'John Doe', in: '03:30 PM', out: '', status: 'Checked In' },
  { name: 'David Smith', id: '20214321', host: 'Angela Moss', in: '04:00 PM', out: '', status: 'Checked In' },
  { name: 'Yusuf Adeyemi', id: '20215555', host: 'Emma White', in: '04:25 PM', out: '', status: 'Checked In' },
  { name: 'Sofia Gonzalez', id: '20216666', host: 'John Doe', in: '04:55 PM', out: '05:30 PM', status: 'Checked Out' },
];

export default function Dashboard() {
=======
export default function Dashboard() {
  // Show toast if we navigated here after login (see Login.jsx)
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    show: !!location.state?.toast,
<<<<<<< HEAD
    type: 'success',
    message: location.state?.toast || '',
  });

  const [page, setPage] = useState(1);
  const perPage = 10;
  const pageCount = Math.ceil(allVisitors.length / perPage);
  const pagedVisitors = useMemo(
    () => allVisitors.slice((page - 1) * perPage, page * perPage),
    [page]
  );

  useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
=======
    type: "success",
    message: location.state?.toast || ""
  });

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 10;
  const pageCount = Math.ceil(allVisitors.length / perPage);
  const pagedVisitors = useMemo(
    () => allVisitors.slice((page - 1) * perPage, page * perPage),
    [page]
  );

  useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
>>>>>>> 1b39092 (complete Soldier User Interface)
      return () => clearTimeout(t);
    }
  }, [toast.show]);

  // For greeting (optional)
  const { user } = useAuth();

  const todayStats = useMemo(() => {
    let total = allVisitors.length;
    let active = allVisitors.filter(v => v.status === "Checked In").length;
    let checkedOut = allVisitors.filter(v => v.status === "Checked Out").length;
    return { total, active, checkedOut };
  }, []);

  return (
    <div className="dashboard-content soldier-dashboard-bg">
      <Toast type={toast.type} message={toast.message} show={toast.show} />

      {/* Welcome Banner */}
      <div className="soldier-welcome-banner soldier-welcome-banner-centered">
        <div className="soldier-banner-center">
          <div className="soldier-banner-title">Welcome to your dashboard</div>
          <div className="soldier-banner-desc">Here's an overview of today's activities</div>
        </div>
        <div className="soldier-banner-date">{getFormattedDate()}</div>
      </div>

      {/* Stat Cards - exact layout */}
      <div className="soldier-stat-card-row">
        <div className="soldier-stat-card">
          <div className="soldier-stat-card-content">
            <div className="soldier-stat-card-label">Today's Total Visitors</div>
            <div className="soldier-stat-card-value">{todayStats.total}</div>
          </div>
          <div className="soldier-stat-card-icon">
            <IoMdContacts />
          </div>
        </div>
        <div className="soldier-stat-card">
          <div className="soldier-stat-card-content">
            <div className="soldier-stat-card-label">Active Visitors</div>
            <div className="soldier-stat-card-value">{todayStats.active}</div>
          </div>
          <div className="soldier-stat-card-icon">
            <RiContactsLine />
          </div>
        </div>
        <div className="soldier-stat-card">
          <div className="soldier-stat-card-content">
            <div className="soldier-stat-card-label">Checked-Out Visitors</div>
            <div className="soldier-stat-card-value">{todayStats.checkedOut}</div>
          </div>
          <div className="soldier-stat-card-icon">
            <TiInputCheckedOutline />
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
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID Number</th>
                <th>Host</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {todayVisitors.map((v, i) => (
                <tr key={i}>
                  <td>{v.name}</td>
                  <td>{v.id}</td>
                  <td>{v.host}</td>
                  <td>{v.in}</td>
                  <td>{v.out || "-"}</td>
                  <td>
                    <span
                      className={`status-label ${
                        v.status === "Checked Out" ? "checked-out" : "checked-in"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="dashboard-pagination">
            Showing 1-5 of 20
            <button className="dashboard-page-btn">1</button>
            <button className="dashboard-page-btn">2</button>
            <button className="dashboard-page-btn">3</button>
          </div>
        </div>
      </div>
    </div>
  );
}