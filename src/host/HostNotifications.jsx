import React, { useState } from "react";
import "./HostNotifications.css";

const initialNotifications = [
  {
    id: 1,
    message:
      "Good morning, you have a visitor John Doe. They checked-in at 8:30 am and entry was approved by Officer Brian.",
    meta: "Delivery | 3rd June, 2025 8:30am",
    isUnread: true,
    date: "2025-06-03",
  },
  {
    id: 2,
    message:
      "Good morning, you have a visitor Jane Smith. They checked-in at 9:10 am and entry was approved by Officer Brian.",
    meta: "HR | 3rd June, 2025 9:10am",
    isUnread: true,
    date: "2025-06-03",
  },
  {
    id: 3,
    message:
      "Good morning, you have a visitor Alex Lee. They checked-in at 11:00 am and entry was approved by Officer Brian.",
    meta: "Delivery | 2nd June, 2025 11:00am",
    isUnread: false,
    date: "2025-06-02",
  },
  {
    id: 4,
    message: "Your availability was updated.",
    meta: "System | 2nd June, 2025 7:00am",
    isUnread: false,
    date: "2025-06-02",
  },
];

export default function HostNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = notifications.filter((n) => {
    const matchesSearch =
      n.message.toLowerCase().includes(search.toLowerCase()) ||
      n.meta.toLowerCase().includes(search.toLowerCase()) ||
      n.date.includes(search);
    const matchesFilter =
      filter === "all" || (filter === "unread" && n.isUnread);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  return (
    <div className="host-scrollable-content">
      <div className="host-notifications-wrapper">
        <div className="host-notifications-title">Your Notifications</div>
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
        <div className="host-notification-list">
          {filtered.length === 0 && (
            <div className="host-notifications-empty">
              No notifications found.
            </div>
          )}
          {filtered.map((n) => (
            <div
              className={
                "host-notification-card" + (n.isUnread ? " unread" : " read")
              }
              key={n.id}
              onClick={() => n.isUnread && markAsRead(n.id)}
              tabIndex={0}
              title={n.isUnread ? "Mark as read" : ""}
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
        <div className="host-notification-load-btn-row">
          <button className="host-notification-load-btn" disabled>
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}