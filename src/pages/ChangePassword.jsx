import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Check if new password and confirmation match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Verify current password
    try {
      const isCurrentCorrect = await verifyPassword(oldPassword);
      if (!isCurrentCorrect) {
        setError("Current Password is Incorrect");
        setLoading(false);
        return;
      }
    } catch (err) {
      setError("Current Password is Incorrect");
      setLoading(false);
      return;
    }

    // Change password
    try {
      await changePassword(newPassword);
      setSuccess("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1200);
  };

  const goToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="change-password-bg">
      <div className="change-password-container">
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
              autoComplete="current-password"
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
              autoComplete="new-password"
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
              autoComplete="new-password"
            />
          </div>
          {error && (
            <div className="change-password-error" style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </div>
          )}
          {success && (
            <div className="change-password-success" style={{ color: "green", marginBottom: "10px" }}>
              {success}
            </div>
          )}
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