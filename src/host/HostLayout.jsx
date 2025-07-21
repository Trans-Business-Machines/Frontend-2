import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import "./HostLayout.css";
import logo from "../assets/logo.png";
import { AiOutlineDashboard } from "react-icons/ai";
import { MdNotificationsActive } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { FaHistory } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";

export default function HostLayout({ hostName = "Host User" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);

  //  Fetch actual unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await axiosInstance.get("/notifications?type=all"); 
        const allNotifications = res.data?.result?.notifications || [];
        const unread = allNotifications.filter(n => !n.isRead);
        setUnreadCount(unread.length);
      } catch (error) {
        console.error("Failed to fetch unread notifications:", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  //  Mark notifications as read when visiting the notifications page
  useEffect(() => {
    const markAllAsRead = async () => {
      if (location.pathname === "/host/notifications") {
        try {
          await axiosInstance.post("/notifications/subscribe");
          setUnreadCount(0); // reset immediately in UI
        } catch (error) {
          console.error("Failed to mark notifications as read:", error);
        }
      }
    };

    markAllAsRead();
  }, [location.pathname]);

  const menu = [
    { 
      label: "Dashboard", 
      icon: <span style={{ fontSize: 18 }}><AiOutlineDashboard /></span>, 
      path: "/host/dashboard" 
    },
    {
      label: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 18, marginRight: 5 }}>
            <MdNotificationsActive />
          </span>
          Notifications
          {unreadCount > 0 && (
            <span
              className="host-notification-badge"
              style={{
                background: "#e53e3e",
                color: "#fff",
                borderRadius: "50%",
                fontSize: 12,
                marginLeft: 8,
                padding: "2px 7px",
                fontWeight: 700,
                display: "inline-block",
              }}
            >
              {unreadCount}
            </span>
          )}
        </span>
      ),
      path: "/host/notifications"
    },
    { 
      label: "Availability", 
      icon: <span style={{ fontSize: 18 }}><SlCalender /></span>, 
      path: "/host/availability" 
    },
    { 
      label: "History", 
      icon: <span style={{ fontSize: 18 }}><FaHistory /></span>, 
      path: "/host/history" 
    },
  ];

  const capitalizeRole = (role) => {
    if (!role) return hostName;
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="host-root-layout">
      {/* Sidebar */}
      <aside className="host-sidebar">
        <div className="host-logo">
          <img src={logo || "/placeholder.svg"} alt="Logo" className="host-logo-img" />
        </div>
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

      {/* Main panel */}
      <main className="host-main-panel">
        <header className="host-header">
          <div></div>
          <div className="host-header-title">
            {menu.find(item => location.pathname === item.path)?.label ??
              menu.find(item => location.pathname.startsWith(item.path))?.label
            }
          </div>

          {/* Topbar notifications count */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => navigate("/host/notifications")}
            >
              <MdNotificationsActive size={22} color="#235c56" />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -8,
                    background: "#e53e3e",
                    color: "#fff",
                    borderRadius: "50%",
                    fontSize: 11,
                    padding: "2px 6px",
                    fontWeight: 700,
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>

            <div
              className="host-header-profile"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/host/profile")}
              title="View Profile"
            >
              <span role="img" aria-label="host" style={{ fontSize: 24, marginRight: 10 }}>
                <CgProfile />
              </span>
              {capitalizeRole(user?.role)}
            </div>
          </div>
        </header>

        <div className="host-content-panel">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
