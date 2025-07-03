import React, { useState } from "react";
import "./HostAvailability.css";

export default function HostAvailability() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    // Replace this with real save logic if needed
    alert(`Availability saved:\nStart: ${start}\nEnd: ${end}`);
  };

  return (
    <div className="host-scrollable-content">
      <div className="host-availability-wrapper">
        <div className="host-availability-title">Set your availability</div>
        <div className="host-availability-desc">
          Let guests know when you’re available. You can adjust your schedule anytime.
        </div>
        <form className="host-availability-fields" onSubmit={handleSave}>
          <div className="host-availability-field">
            <span role="img" aria-label="calendar" className="host-availability-icon">📅</span>
            <input
              className="host-availability-input"
              type="date"
              value={start}
              onChange={e => setStart(e.target.value)}
              required
            />
          </div>
          <div className="host-availability-field">
            <span role="img" aria-label="calendar" className="host-availability-icon">📅</span>
            <input
              className="host-availability-input"
              type="date"
              value={end}
              onChange={e => setEnd(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="host-availability-save-btn">Save</button>
        </form>
      </div>
    </div>
  );
}
