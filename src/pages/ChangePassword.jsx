import "./ChangePassword.css";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { IoIosWarning } from "react-icons/io";
import { FaXmark, FaCheck } from "react-icons/fa6";
import useSWRMutation from "swr/mutation";
import axiosInstance from "../api/axiosInstance";
import Snackbar from "../components/Snackbar";

const updatePassword = async (url, { arg }) => {
  const { id, body } = arg;
  url = url.replace(":id", id);

  const res = await axiosInstance.patch(url, body);
  return res.data;
};

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const { trigger: changePassword } = useSWRMutation(
    "/users/:id",
    updatePassword
  );

  const clearForm = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const validate = () => {
    if (newPassword !== confirmPassword) {
      setLoading(false);
      return false;
    }
    return true;
  };

  const handleSubmit = async (id) => {
    setLoading(true);

    if (!validate()) {
      return toast.custom(
        <Snackbar
          icon={IoIosWarning}
          message="Passwords don't match"
          type="warning"
        />
      );
    }

    try {
      const body = { currentPassword: oldPassword, newPassword };
      const result = await changePassword({ id, body });

      if (result.success) {
        clearForm();
        toast.custom(
          <Snackbar
            icon={FaCheck}
            message="Password changed successfully"
            type="success"
          />
        );
      }
    } catch (err) {
      const message = err.response.data?.message || "Password change failed";
      toast.custom(<Snackbar icon={FaXmark} message={message} type="error" />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-bg">
      <div className="change-password-container">
        <h2 style={{ marginBottom: "0.8rem" }}>Change Password</h2>
        <form
          className="change-password-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(user.userId);
          }}
        >
          <div className="change-password-field">
            <label htmlFor="oldPassword">Current Password</label>
            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
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
              onChange={(e) => setNewPassword(e.target.value)}
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          {error && <div className="change-password-error">{error}</div>}
          {success && <div className="change-password-success">{success}</div>}
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
