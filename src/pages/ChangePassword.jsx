import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { AuthProvider } from "../context/AuthContext"; // <-- import useAuth
=======
>>>>>>> 1b39092 (complete Soldier User Interface)
import "./ChangePassword.css";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
<<<<<<< HEAD
  const { user } = AuthProvider(); // <-- get user from Auth
=======
>>>>>>> 1b39092 (complete Soldier User Interface)

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    // Add your password change logic here
    setTimeout(() => {
      setLoading(false);
      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1200);
  };

  const goToDashboard = () => {
<<<<<<< HEAD
    if (user?.role === "host") {
      navigate("/host/dashboard");
    } else {
      navigate("/");
    }
=======
    navigate("/");
>>>>>>> 1b39092 (complete Soldier User Interface)
  };

  return (
    <div className="change-password-bg">
      <div className="change-password-container">
        <button className="back-to-dashboard-btn" onClick={goToDashboard}>
          ← Back to Dashboard
        </button>
        <h2>Change Password</h2>
        <form className="change-password-form" onSubmit={handleSubmit}>
          <div className="change-password-field">
            <label htmlFor="oldPassword">Current Password</label>
            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="change-password-field">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="change-password-field">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="change-password-submit-btn"
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}