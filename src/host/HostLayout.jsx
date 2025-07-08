import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./HostLayout.css";
import { AiOutlineDashboard } from "react-icons/ai";
import { MdNotificationsActive } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { FaHistory } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";

export default function HostLayout({ hostName = "Host User" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Sidebar menu matching your screenshot
  const menu = [
    { label: "Dashboard", icon: <span style={{ fontSize: 18 }}><AiOutlineDashboard /></span>, path: "/host/dashboard" },
    {
      label: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 18, marginRight: 5 }}><MdNotificationsActive />
</span>
          Notifications
          <span className="host-notification-badge"
            style={{
              background: "#e53e3e",
              color: "#fff",
              borderRadius: "50%",
              fontSize: 12,
              marginLeft: 8,
              padding: "2px 7px",
              fontWeight: 700,
              display: "inline-block"
            }}
          >2</span>
        </span>
      ),
      icon: null,
      path: "/host/notifications"
    },
    { label: "Availability", icon: <span style={{ fontSize: 18 }}><SlCalender />
</span>, path: "/host/availability" },
    { label: "History", icon: <span style={{ fontSize: 18 }}><FaHistory />
</span>, path: "/host/history" },
  ];

  return (
    <div className="host-root-layout">
      <aside className="host-sidebar">
        <div className="host-logo">LOGO</div>
        <nav>
          {menu.map(item => (
            <div
              key={typeof item.label === "string" ? item.label : item.path}
              className={`host-sidebar-link${location.pathname === item.path ? " active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon && <span className="host-sidebar-icon">{item.icon}</span>}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <button
          className="host-logout-btn"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <span style={{ fontSize: 20, marginRight: 8 }}><HiOutlineLogout /></span>
          Log Out
        </button>
      </aside>
      <main className="host-main-panel">
        <header className="host-header">
          <div></div>
          <div className="host-header-title">
            {menu.find(item => location.pathname === item.path)?.label ??
              menu.find(item => location.pathname.startsWith(item.path))?.label
            }
          </div>
          <div
            className="host-header-profile"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/host/profile")}
            title="View Profile"
          >
            <span role="img" aria-label="host" style={{ fontSize: 24, marginRight: 10 }}><CgProfile /></span>
            {hostName}
          </div>
        </header>
        <div className="host-content-panel">
          <Outlet />
        </div>
      </main>
    </div>
  );
}