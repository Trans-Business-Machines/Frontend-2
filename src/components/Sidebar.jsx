import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png"; // Import your logo image
import "./Sidebar.css";

export default function Sidebar({ active }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="VMS Logo" className="app-logo" />
      </div>
      <div className="sidebar-menu">
        <button
          className={active === "dashboard" ? "active" : ""}
          onClick={() => navigate("/")}
        >
          <span>🏠</span> Dashboard
        </button>
        <button
          className={active === "checkin" ? "active" : ""}
          onClick={() => navigate("/check-in")}
        >
          <span>✍️</span>Check-in
        </button>
        <button
          className={active === "checkout" ? "active" : ""}
          onClick={() => navigate("/check-out")}
        >
          <span>🚶‍♂️</span> Check-out
        </button>
        <button
          className={active === "log" ? "active" : ""}
          onClick={() => navigate("/visitors-log")}
        >
          <span>📄</span> Visitors Log
        </button>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        <span>🧍‍♂️➡️</span> Log Out
      </button>
    </div>
  );
}