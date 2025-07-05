import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAddUser.css";

export default function AdminAddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    phone: "",
    role: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.idNumber || !form.phone || !form.role) {
      setError("All fields are required.");
      return;
    }
    // submit logic here
    navigate("/admin/users");
  }

  return (
    <div className="admin-add-user">
      <div className="admin-add-user-title">Add New User</div>
      <div className="admin-add-user-desc">Fill in the form below to create a new system user.</div>
      <form className="admin-add-user-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input name="firstName" placeholder="First Name*" value={form.firstName} onChange={handleChange} />
          <input name="lastName" placeholder="Last Name*" value={form.lastName} onChange={handleChange} />
        </div>
        <div className="form-row">
          <input name="idNumber" placeholder="ID Number*" value={form.idNumber} onChange={handleChange} />
          <input name="phone" placeholder="Phone Number*" value={form.phone} onChange={handleChange} />
        </div>
        <div className="form-row">
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="">Role</option>
            <option value="Admin">Admin</option>
            <option value="Host">Host</option>
            <option value="Soldier">Soldier</option>
          </select>
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="form-actions">
          <button type="submit" className="submit-btn">Submit</button>
          <button type="button" className="cancel-btn" onClick={() => navigate("/admin/users")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}