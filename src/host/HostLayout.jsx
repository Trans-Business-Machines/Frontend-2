import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import "./HostLayout.css";

export default function SoldierLayout({ soldierName = "Soldier User" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Remove "Profile" from the menu array
  const menu = [
    { label: "Dashboard", icon: <span role="img" aria-label="dashboard">🏠</span>, path: "/" },
    { label: "Check In", icon: <span role="img" aria-label="check-in">🟢</span>, path: "/check-in" },
    { label: "Check Out", icon: <span role="img" aria-label="check-out">🔴</span>, path: "/check-out" },
    { label: "Visitors Log", icon: <span role="img" aria-label="visitors-log">📋</span>, path: "/visitors-log" },
  ];

  return (
    <div className="soldier-root-layout">
      <aside className="soldier-sidebar">
        <div className="soldier-logo">
          <img src={logo} alt="VMS Logo" className="soldier-logo-img" />
        </div>
        <nav>
          {menu.map(item => (
            <div
              key={item.label}
              className={`soldier-sidebar-link${location.pathname === item.path ? " active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="soldier-sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <button
          className="soldier-logout-btn"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <span role="img" aria-label="logout" style={{ fontSize: 20, marginRight: 8 }}>↪️</span>
          Log Out
        </button>
      </aside>
      <main className="soldier-main-panel">
        <header className="soldier-header">
          <div></div>
          <div className="soldier-header-title">
            {menu.find(item => location.pathname === item.path)?.label ??
              menu.find(item => location.pathname.startsWith(item.path))?.label}
          </div>
          <div
            className="soldier-header-profile"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/profile")}
            title="View Profile"
          >
            <span role="img" aria-label="soldier" style={{ fontSize: 24, marginRight: 10 }}>👤</span>
            {soldierName}
          </div>
        </header>
        <div className="soldier-content-panel">
          <Outlet />
        </div>
      </main>
    </div>
  );
}