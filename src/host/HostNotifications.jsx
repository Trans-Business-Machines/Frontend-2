import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "./HostNotifications.css";
import { useAuth } from "../context/AuthContext";

export default function HostNotifications() {
  const { user } = useAuth(); // to get the host ID
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get(`/notifications?type=all`);
      const backendNotifications = res.data?.result?.notifications || [];
      setNotifications(
        backendNotifications.map((n) => ({
          ...n,
          isUnread: !n.isRead, // backend uses isRead, frontend expects isUnread
          meta: `${n.title} | ${new Date(n.createdAt).toLocaleString()}`,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  //  Mark one notification as read (permanent)
  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}`, {
        userId: user?.userId, //  required by backend to verify ownership
      });

      // Update local state immediately
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isUnread: false } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  // Filter + search
  const filtered = notifications.filter((n) => {
    const matchesSearch =
      n.message.toLowerCase().includes(search.toLowerCase()) ||
      n.meta.toLowerCase().includes(search.toLowerCase()) ||
      (n.createdAt || "").includes(search);
    const matchesFilter =
      filter === "all" || (filter === "unread" && n.isUnread);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  return (
    <div className="host-scrollable-content">
      <div className="host-notifications-wrapper">
        <div className="host-notifications-title">Your Notifications</div>

        {/* Search + Filter Row */}
        <div className="host-notifications-filter-row">
          <input
            type="text"
            className="host-notifications-date-filter"
            placeholder="Search by message or date (e.g. 2025-06-03)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="host-notifications-filter-btns">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={filter === "unread" ? "active" : ""}
              onClick={() => setFilter("unread")}
            >
              Unread
              {unreadCount > 0 && (
                <span className="host-notifications-badge">{unreadCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="host-notification-list">
          {loading && <div>Loading notifications...</div>}

          {!loading && filtered.length === 0 && (
            <div className="host-notifications-empty">
              No notifications found.
            </div>
          )}

          {!loading &&
            filtered.map((n) => (
              <div
                className={
                  "host-notification-card" +
                  (n.isUnread ? " unread" : " read")
                }
                key={n._id}
                onClick={() => n.isUnread && markAsRead(n._id)}
                tabIndex={0}
                title={n.isUnread ? "Mark as read" : "Already read"}
              >
                <div className="host-notification-msg">
                  {n.message}
                  {n.isUnread && (
                    <span
                      className="host-notification-unread-dot"
                      title="Unread"
                    ></span>
                  )}
                </div>
                <div className="host-notification-meta">{n.meta}</div>
              </div>
            ))}
        </div>

        {/* Load More Placeholder */}
        <div className="host-notification-load-btn-row">
          <button className="host-notification-load-btn" disabled>
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}
