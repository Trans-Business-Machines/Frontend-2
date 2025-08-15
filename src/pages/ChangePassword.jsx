import "./ChangePassword.css";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { IoIosWarning } from "react-icons/io";
import { FaXmark, FaCheck } from "react-icons/fa6";
import { isValidPassword } from "../utils";
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
  const { user } = useAuth();

  const { trigger: changePassword, isMutating } = useSWRMutation(
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
      return { valid: false, message: "Passwords do not match" };
    }

    const result = isValidPassword(newPassword);

    if (!result.isValid) {
      return { valid: false, message: result.message };
    }

    return { valid: true, message: "Valid password" };
  };

  const handleSubmit = async (id) => {
    const result = validate();

    if (!result.valid) {
      return toast.custom(
        <Snackbar icon={IoIosWarning} message={result.message} type="warning" />
      );
    }

    try {
      const body = {
        currentPassword: oldPassword.trim(),
        newPassword: newPassword.trim(),
      };

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
          <button
            type="submit"
            className="change-password-submit-btn"
            disabled={isMutating}
          >
            {isMutating ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
