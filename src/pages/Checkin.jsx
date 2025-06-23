import React, { useState } from "react";
<<<<<<< HEAD
=======
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
>>>>>>> 1b39092 (complete Soldier User Interface)
import "./Checkin.css";

export default function Checkin() {
  // State for form fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    phone: "",
    host: "",
    purpose: ""
  });

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send form data to backend
    alert("Visitor checked in (mock).");
    setForm({
      firstName: "",
      lastName: "",
      idNumber: "",
      phone: "",
      host: "",
      purpose: ""
    });
  };

  return (
<<<<<<< HEAD
    <div className="checkin-form-outer">
      <form className="checkin-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="checkin-title">New Visitor Check-In</h2>
        <hr className="checkin-divider" />
        <div className="checkin-fields-row">
          <div className="checkin-field">
            <label>
              First Name<span className="checkin-req">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="checkin-field">
            <label>
              Last Name<span className="checkin-req">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="checkin-field">
          <label>
            ID Number<span className="checkin-req">*</span>
          </label>
          <input
            type="text"
            name="idNumber"
            placeholder="ID Number"
            value={form.idNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="checkin-field">
          <label>
            Phone Number<span className="checkin-req">*</span>
          </label>
          <input
            type="text"
            name="phone"
            placeholder="+254 0712 345 678"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="checkin-field">
          <label>
            Host<span className="checkin-req">*</span>
          </label>
          <div className="checkin-host-row">
            <input
              type="text"
              name="host"
              placeholder="Search host..."
              value={form.host}
              onChange={handleChange}
              required
              autoComplete="off"
              // In real use, this should be a dropdown/autocomplete from backend
              readOnly
            />
            <span className="checkin-available-dot">
              <span className="dot" /> Available
            </span>
            <select
              className="checkin-select"
              name="host"
              value={form.host}
              onChange={handleChange}
              disabled
            >
              <option value="">Select</option>
              {/* Real options come from backend */}
            </select>
          </div>
        </div>
        <div className="checkin-field">
          <label>
            Purpose of Visit<span className="checkin-req">*</span>
          </label>
          <select
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            required
          >
            <option value="">E.g., Meeting, Interview, Delivery...</option>
            {/* Real options come from backend */}
          </select>
        </div>
        <button className="checkin-btn" type="submit">
          Check In Visitor
        </button>
      </form>
=======
    <div className="main-app">
      <Sidebar active="checkin" />
      <div className="main-content">
        <Topbar />
        <div className="checkin-form-outer">
          <form className="checkin-form" onSubmit={handleSubmit} autoComplete="off">
            <h2 className="checkin-title">New Visitor Check-In</h2>
            <hr className="checkin-divider" />
            <div className="checkin-fields-row">
              <div className="checkin-field">
                <label>
                  First Name<span className="checkin-req">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="checkin-field">
                <label>
                  Last Name<span className="checkin-req">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="checkin-field">
              <label>
                ID Number<span className="checkin-req">*</span>
              </label>
              <input
                type="text"
                name="idNumber"
                placeholder="ID Number"
                value={form.idNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="checkin-field">
              <label>
                Phone Number<span className="checkin-req">*</span>
              </label>
              <input
                type="text"
                name="phone"
                placeholder="+254 0712 345 678"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="checkin-field">
              <label>
                Host<span className="checkin-req">*</span>
              </label>
              <div className="checkin-host-row">
                <input
                  type="text"
                  name="host"
                  placeholder="Search host..."
                  value={form.host}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  // In real use, this should be a dropdown/autocomplete from backend
                  readOnly
                />
                <span className="checkin-available-dot">
                  <span className="dot" /> Available
                </span>
                <select
                  className="checkin-select"
                  name="host"
                  value={form.host}
                  onChange={handleChange}
                  disabled
                >
                  <option value="">Select</option>
                  {/* Real options come from backend */}
                </select>
              </div>
            </div>
            <div className="checkin-field">
              <label>
                Purpose of Visit<span className="checkin-req">*</span>
              </label>
              <select
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                required
              >
                <option value="">E.g., Meeting, Interview, Delivery...</option>
                {/* Real options come from backend */}
              </select>
            </div>
            <button className="checkin-btn" type="submit">
              Check In Visitor
            </button>
          </form>
        </div>
      </div>
>>>>>>> 1b39092 (complete Soldier User Interface)
    </div>
  );
}