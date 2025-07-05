import React, { useState } from "react";
import "./Checkout.css";

// Example static visitor records
const visitors = [
  { id: "20215234", name: "John Doe", host: "Angela Moss", checkedIn: "08:15 AM" },
  { id: "20215125", name: "Lucy Smith", host: "Emma White", checkedIn: "08:50 AM" },
  { id: "20215219", name: "Tom Baker", host: "John Doe", checkedIn: "10:45 AM" }
];

export default function Checkout() {
  // State for search field
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(visitors);

  // Filter records as user types
  const handleChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (!val.trim()) {
      setFiltered(visitors);
    } else {
      setFiltered(
        visitors.filter(
          v =>
            v.name.toLowerCase().includes(val.toLowerCase()) ||
            v.id.toLowerCase().includes(val.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="checkout-content">
      {/* Centered header section */}
      <div className="checkout-header-center">
        <h2>Check Out Visitor</h2>
        <p>Search a visitor to check them out of the premises.</p>
      </div>
      <form className="checkout-form" autoComplete="off" onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          className="checkout-search-input"
          placeholder="Search by Name or ID..."
          value={search}
          onChange={handleChange}
        />
      </form>
      <div className="checkout-records-section">
        {filtered.length === 0 ? (
          <div className="checkout-no-records">
            <p>No records found.</p>
          </div>
        ) : (
          <table className="checkout-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID Number</th>
                <th>Host</th>
                <th>Time In</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <tr key={i}>
                  <td>{v.name}</td>
                  <td>{v.id}</td>
                  <td>{v.host}</td>
                  <td>{v.checkedIn}</td>
                  <td>
                    <button
                      className="checkout-btn-small"
                      onClick={() => alert(`Checked out ${v.name} (mock)`)}
                    >
                      Check Out
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}