import React from "react";
import "./Toast.css";

export default function Toast({ type = "success", message, show, onClose }) {
  if (!show) return null;
  return (
    <div className={`toast-notification${type === "error" ? " toast-notification--error" : ""}`}>
      <span className="toast-icon">
        {type === "success" ? (
          <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="12" fill="#27ae60"/><path d="M7 13.5l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ) : (
          <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="12" fill="#b80020"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
        )}
      </span>
      <span className="toast-message">{message}</span>
      {onClose && (
        <button className="toast-close-btn" onClick={onClose} aria-label="Close notification">&times;</button>
      )}
    </div>
  );
}