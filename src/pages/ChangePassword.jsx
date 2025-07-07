import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

// Dummy implementations for demonstration. Replace with your actual logic.
async function verifyPassword(password) {
  // Simulate backend check (replace with real API call)
  // For demo, accept "oldpassword" as valid password
  await new Promise(res => setTimeout(res, 500));
  return password === "oldpassword";
}
async function changePassword(newPassword) {
  // Simulate backend update (replace with real API call)
  await new Promise(res => setTimeout(res, 500));
  return true;
}

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Verify current password
    try {
      const isCurrentCorrect = await verifyPassword(oldPassword);
      if (!isCurrentCorrect) {
        setError("Current password is incorrect.");
        setLoading(false);
        return;
      }
    } catch (err) {
      setError("Error verifying current password.");
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
    } catch (err) {
      setError("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <div className="change-password-error">
              {error}
            </div>
          )}
          {success && (
            <div className="change-password-success">
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
        <button className="change-password-back-btn" onClick={goToDashboard}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}