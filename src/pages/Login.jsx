import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { FaXmark, FaCheck } from "react-icons/fa6";
import Snackbar from "../components/Snackbar";
import axiosInstance from "../api/axiosInstance";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidTenDigitPhone,
} from "../utils/index";

export default function Login() {
  // Login form states
  const [authMode, setAuthMode] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Get the login and navigate functions
  const { login } = useAuth();
  const navigate = useNavigate();

  // Forgot Password States
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");
  const [resetToken, setResetToken] = useState("");

  // Contact Admin States
  const [showContactAdminModal, setShowContactAdminModal] = useState(false);
  const [contactAdminForm, setContactAdminForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    phone: "",
  });

  const [contactAdminErrors, setContactAdminErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    role: "",
  });

  const [contactAdminLoading, setContactAdminLoading] = useState(false);
  const [contactAdminError, setContactAdminError] = useState("");
  const [contactAdminSuccess, setContactAdminSuccess] = useState("");

  const handleAuthMode = (mode) => {
    setAuthMode(mode);
    setErrorMsg("");
    if (mode === "phone") setEmail("");
    else setPhone("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg("");

    if (authMode === "phone") {
      if (!isValidPhone(phone)) {
        setErrorMsg("Please enter a valid phone number (digits only).");
        setLoading(false);
        return;
      }
    } else {
      if (!isValidEmail(email)) {
        setErrorMsg("Please enter a valid email address.");
        setLoading(false);
        return;
      }
    }

    try {
      // Declare user variable
      let user = null;

      // Login with email or password
      if (authMode === "phone") {
        user = await login({ phone, password });
      } else {
        user = await login({ email, password });
      }

      //  Redirect based on role
      if (user?.role === "soldier") {
        navigate("/");
        toast.custom(
          <Snackbar type="success" message="Login successful!" icon={FaCheck} />
        );
      } else if (user?.role === "host" || user?.role === "receptionist") {
        navigate("/host/dashboard");
        toast.custom(
          <Snackbar type="success" message="Login successful!" icon={FaCheck} />
        );
      } else if (user?.role === "admin" || user.role === "super admin") {
        navigate("/admin/dashboard");
        toast.custom(
          <Snackbar type="success" message="Login successful!" icon={FaCheck} />
        );
      } else {
        navigate("/login");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.custom(<Snackbar type="error" message={message} icon={FaXmark} />);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Handlers
  const handleForgotPasswordEmailSubmit = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordError("");
    setForgotPasswordSuccess("");
    if (!isValidEmail(forgotEmail)) {
      setForgotPasswordError("Please enter a valid email address.");
      setForgotPasswordLoading(false);
      return;
    }
    try {
      // Corrected API endpoint for sending OTP
      const response = await axiosInstance.post("/auth/forgot-password", {
        email: forgotEmail,
      });
      setForgotPasswordSuccess(
        response.data.message || "OTP sent to your email."
      );
      setForgotPasswordStep("otp");
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to send OTP. Please try again.";
      setForgotPasswordError(message);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordError("");
    setForgotPasswordSuccess("");
    if (!isValidOTP(otp)) {
      setForgotPasswordError("Please enter a valid 6-digit OTP.");
      setForgotPasswordLoading(false);
      return;
    }
    try {
      const { data } = await axiosInstance.post("/auth/verify-otp", {
        email: forgotEmail,
        otp,
      });
      setForgotPasswordSuccess("OTP verified successfully.");
      setResetToken(data?.resetToken);
      setForgotPasswordStep("newPassword");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "OTP verification failed. Please try again.";
      setForgotPasswordError(message);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordError("");
    setForgotPasswordSuccess("");

    // Check if the new and confirm passwords match
    if (newPassword !== confirmPassword) {
      setForgotPasswordError("Passwords do not match.");
      setForgotPasswordLoading(false);
      return;
    }

    const { message, isValid } = isValidPassword(newPassword);

    if (!isValid) {
      setForgotPasswordError(message);
      setForgotPasswordLoading(false);
      return;
    }

    try {
      const { data } = await axiosInstance.post("/auth/reset-password", {
        password: confirmPassword,
        resetToken,
      });

      const message = data.message;
      setForgotPasswordSuccess(message);

      toast.custom(
        <Snackbar type="success" message={message} icon={FaCheck} />
      );

      // Hide the modal
      setShowForgotPasswordModal(false);

      // Clear states
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setForgotPasswordStep("email");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to update password. Please try again.";
      setForgotPasswordError(message);

      toast.custom(<Snackbar type="error" message={message} icon={FaXmark} />);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleContactAdminSubmit = async (e) => {
    e.preventDefault();
    setContactAdminLoading(true);
    setContactAdminError("");
    setContactAdminSuccess("");

    const errors = {};
    let isValid = true;

    // Validate First Name
    if (contactAdminForm.firstname.trim() === "") {
      errors.firstname = "This field is required.";
      isValid = false;
    } else if (!isValidName(contactAdminForm.firstname)) {
      errors.firstname =
        "Please enter a valid name without numbers or special characters.";
      isValid = false;
    }

    // Validate Last Name
    if (contactAdminForm.lastname.trim() === "") {
      errors.lastname = "This field is required.";
      isValid = false;
    } else if (!isValidName(contactAdminForm.lastname)) {
      errors.lastname =
        "Please enter a valid name without numbers or special characters.";
      isValid = false;
    }

    // Validate Email
    if (contactAdminForm.email.trim() === "") {
      errors.email = "This field is required.";
      isValid = false;
    } else if (!isValidEmail(contactAdminForm.email)) {
      errors.email =
        "Please enter a valid email address (e.g., user@gmail.com).";
      isValid = false;
    }

    // Validate Phone
    if (contactAdminForm.phone.trim() === "") {
      errors.phone = "This field is required.";
      isValid = false;
    } else if (!isValidTenDigitPhone(contactAdminForm.phone)) {
      errors.phone = "Phone number must have 10 digits.";
      isValid = false;
    }

    // Validate Role
    if (contactAdminForm.role.trim() === "") {
      errors.role = "This field is required.";
      isValid = false;
    }

    setContactAdminErrors(errors); // Set all collected errors

    if (!isValid) {
      setContactAdminLoading(false);
      return;
    }

    console.log("Sending Contact Admin Form Data:", contactAdminForm);

    try {
      const response = await axiosInstance.post(
        "/contact-admin",
        contactAdminForm
      );
      setContactAdminSuccess(
        response.data.message || "Your request has been sent to the admin."
      );
      toast.custom(
        <Snackbar
          type="success"
          message="Request sent successfully!"
          icon={FaCheck}
        />
      );
      setShowContactAdminModal(false);
      // Clear form
      setContactAdminForm({
        firstname: "",
        lastname: "",
        email: "",
        role: "",
        phone: "",
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to send request. Please try again.";
      setContactAdminError(message); // Use general error for API failures
    } finally {
      setContactAdminLoading(false);
    }
  };

  return (
    <div className="login-bg-split">
      <div className="login-split-left">
        <div className="login-logo-circle">
          <svg width="48" height="48" fill="none">
            <circle cx="24" cy="24" r="24" fill="#fff" fillOpacity="0.15" />
            <path
              d="M24 13a11 11 0 1 1-11 11 11 11 0 0 1 11-11zm0 19a8 8 0 1 0-8-8 8 8 0 0 0 8 8zm0-14.5A6.5 6.5 0 1 1 17.5 24 6.5 6.5 0 0 1 24 17.5zm0 10a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 24 27.5z"
              fill="#fff"
            />
          </svg>
        </div>
        <h1 className="login-title-main">
          Visitor Management
          <br />
          System
        </h1>
        <div className="login-quote-main">
          "Security and elegance meet here — manage
          <br />
          your visitors with ease."
        </div>
      </div>
      <div className="login-split-right">
        <form
          className="login-form-box"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <h2 className="login-welcome">Welcome Back</h2>
          <div className="login-card-subtitle" style={{ marginBottom: 20 }}>
            Please sign in to your account
          </div>
          {/* Show error message if login fails */}
          {errorMsg && <div className="login-error-message">{errorMsg}</div>}

          <div className="login-tab-toggle">
            <button
              type="button"
              className={authMode === "email" ? "active" : ""}
              onClick={() => handleAuthMode("email")}
            >
              Email
            </button>
            <button
              type="button"
              className={authMode === "phone" ? "active" : ""}
              onClick={() => handleAuthMode("phone")}
            >
              Phone
            </button>
          </div>

          {authMode === "email" ? (
            <div className="login-field">
              <label htmlFor="email">Email Address</label>
              <div className="login-input-icon-wrap">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoFocus
                />
                <span className="login-input-icon">
                  <svg width="18" height="18" fill="none">
                    <path
                      d="M2 4.5A2.5 2.5 0 0 1 4.5 2h9A2.5 2.5 0 0 1 16 4.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 2 13.5v-9z"
                      stroke="#aaa"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M16 4l-7 6.5L2 4"
                      stroke="#aaa"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
              </div>
            </div>
          ) : (
            <div className="login-field">
              <label htmlFor="phone">Phone Number</label>
              <div className="login-input-icon-wrap">
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone Number"
                  required
                  autoFocus
                />
                <span className="login-input-icon">
                  <svg width="18" height="18" fill="none">
                    <path
                      d="M3 2h3l1 5-2 2a12 12 0 0 0 5 5l2-2 5 1v3a2 2 0 0 1-2 2C7.58 20 2 14.42 2 8a2 2 0 0 1 2-2z"
                      stroke="#aaa"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
              </div>
            </div>
          )}

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-input-icon-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <span
                className="login-input-icon login-password-icon"
                onClick={() => setShowPassword((show) => !show)}
                style={{ cursor: "pointer" }}
                tabIndex={0}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye-off SVG
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M3 3l18 18"
                      stroke="#888"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.5 10.5a2 2 0 1 1 2.5 2.5"
                      stroke="#888"
                      strokeWidth="2"
                    />
                    <path
                      d="M17.94 17.94A10.55 10.55 0 0 1 12 19C7 19 2.73 15.11 1 12a14.26 14.26 0 0 1 4.17-5.15m3.11-1.74A9.92 9.92 0 0 1 12 5c5 0 9.27 3.89 11 7a14.47 14.47 0 0 1-4.23 5.29"
                      stroke="#888"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  // Eye SVG
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <ellipse
                      cx="12"
                      cy="12"
                      rx="10"
                      ry="7"
                      stroke="#888"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="#888"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>
          <div className="login-card-forgot">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPasswordModal(true);
                setForgotPasswordStep("email");
                setForgotPasswordError("");
                setForgotPasswordSuccess("");
              }}
            >
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="login-card-submit-btn login-submit-btn-split"
          >
            {loading ? (
              <>
                <span className="login-btn-spinner"></span> Signing in...
              </>
            ) : (
              <>
                <svg
                  height="15"
                  width="15"
                  viewBox="0 0 20 20"
                  style={{ marginRight: 7, verticalAlign: "-2px" }}
                >
                  <path
                    d="M10 2a8 8 0 1 1 0 16A8 8 0 0 1 10 2zm1 4v4l3 3"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                </svg>
                Sign in
              </>
            )}
          </button>
          {/* Contact Admin moved here */}
          <div className="login-card-footer login-footer-split">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowContactAdminModal(true);
                setContactAdminError("");
                setContactAdminSuccess("");
              }}
            >
              Contact Admin
            </a>
          </div>
        </form>
        <div className="login-split-footer">
          © 2024 Visitor Management System. All rights reserved.
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowForgotPasswordModal(false)}
            >
              <FaXmark />
            </button>
            <h3>Forgot Password</h3>
            {forgotPasswordError && (
              <div className="login-error-message">{forgotPasswordError}</div>
            )}
            {forgotPasswordSuccess && (
              <div className="login-success-message">
                {forgotPasswordSuccess}
              </div>
            )}

            {forgotPasswordStep === "email" && (
              <form onSubmit={handleForgotPasswordEmailSubmit}>
                <div className="login-field">
                  <label htmlFor="forgot-email">Email Address</label>
                  <div className="login-input-icon-wrap">
                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      autoFocus
                    />
                    <span className="login-input-icon">
                      <svg width="18" height="18" fill="none">
                        <path
                          d="M2 4.5A2.5 2.5 0 0 1 4.5 2h9A2.5 2.5 0 0 1 16 4.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 2 13.5v-9z"
                          stroke="#aaa"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M16 4l-7 6.5L2 4"
                          stroke="#aaa"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="login-card-submit-btn"
                  disabled={forgotPasswordLoading}
                >
                  {forgotPasswordLoading ? (
                    <>
                      <span className="login-btn-spinner"></span> Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            )}

            {forgotPasswordStep === "otp" && (
              <form onSubmit={handleVerifyOtpSubmit}>
                <div className="login-field">
                  <label htmlFor="otp">OTP</label>
                  <div className="login-input-icon-wrap">
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      required
                      maxLength={6}
                      autoFocus
                    />
                    <span className="login-input-icon">
                      {/* Icon for OTP, e.g., a key or lock */}
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 17.5v-5"
                          stroke="#aaa"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 12.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                          stroke="#aaa"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                          stroke="#aaa"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="login-card-submit-btn"
                  disabled={forgotPasswordLoading}
                >
                  {forgotPasswordLoading ? (
                    <>
                      <span className="login-btn-spinner"></span> Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </form>
            )}

            {forgotPasswordStep === "newPassword" && (
              <form onSubmit={handleNewPasswordSubmit}>
                <div className="login-field">
                  <label htmlFor="new-password">New Password</label>
                  <div className="login-input-icon-wrap">
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      autoFocus
                    />
                    <span
                      className="login-input-icon login-password-icon"
                      onClick={() => setShowPassword((v) => !v)}
                      style={{ cursor: "pointer" }}
                      tabIndex={0}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M3 3l18 18"
                            stroke="#888"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M10.5 10.5a2 2 0 1 1 2.5 2.5"
                            stroke="#888"
                            strokeWidth="2"
                          />
                          <path
                            d="M17.94 17.94A10.55 10.55 0 0 1 12 19C7 19 2.73 15.11 1 12a14.26 14.26 0 0 1 4.17-5.15m3.11-1.74A9.92 9.92 0 0 1 12 5c5 0 9.27 3.89 11 7a14.47 14.47 0 0 1-4.23 5.29"
                            stroke="#888"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <ellipse
                            cx="12"
                            cy="12"
                            rx="10"
                            ry="7"
                            stroke="#888"
                            strokeWidth="2"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="#888"
                            strokeWidth="2"
                          />
                        </svg>
                      )}
                    </span>
                  </div>
                </div>
                <div className="login-field">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <div className="login-input-icon-wrap">
                    <input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                    <span
                      className="login-input-icon login-password-icon"
                      onClick={() => setShowPassword((v) => !v)}
                      style={{ cursor: "pointer" }}
                      tabIndex={0}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M3 3l18 18"
                            stroke="#888"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M10.5 10.5a2 2 0 1 1 2.5 2.5"
                            stroke="#888"
                            strokeWidth="2"
                          />
                          <path
                            d="M17.94 17.94A10.55 10.55 0 0 1 12 19C7 19 2.73 15.11 1 12a14.26 14.26 0 0 1 4.17-5.15m3.11-1.74A9.92 9.92 0 0 1 12 5c5 0 9.27 3.89 11 7a14.47 14.47 0 0 1-4.23 5.29"
                            stroke="#888"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <ellipse
                            cx="12"
                            cy="12"
                            rx="10"
                            ry="7"
                            stroke="#888"
                            strokeWidth="2"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="#888"
                            strokeWidth="2"
                          />
                        </svg>
                      )}
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="login-card-submit-btn"
                  disabled={forgotPasswordLoading}
                >
                  {forgotPasswordLoading ? (
                    <>
                      <span className="login-btn-spinner"></span> Updating
                      Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Contact Admin Modal */}
      {showContactAdminModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowContactAdminModal(false)}
            >
              <FaXmark />
            </button>
            <h3>Request Account Access</h3>
            {contactAdminError && (
              <div className="login-error-message">{contactAdminError}</div>
            )}
            {contactAdminSuccess && (
              <div className="login-success-message">{contactAdminSuccess}</div>
            )}

            <form onSubmit={handleContactAdminSubmit}>
              <div className="login-field">
                <label htmlFor="contact-first-name">First Name</label>
                <input
                  id="contact-first-name"
                  type="text"
                  value={contactAdminForm.firstname}
                  onChange={(e) => {
                    const value = e.target.value;
                    setContactAdminForm({
                      ...contactAdminForm,
                      firstname: value,
                    });
                    if (value.trim() === "") {
                      setContactAdminErrors((prev) => ({
                        ...prev,
                        firstname: "This field is required.",
                      }));
                    } else if (!isValidName(value)) {
                      setContactAdminErrors((prev) => ({
                        ...prev,
                        firstname:
                          "Please enter a valid name without numbers or special characters.",
                      }));
                    } else {
                      setContactAdminErrors((prev) => ({
                        ...prev,
                        firstname: "",
                      }));
                    }
                  }}
                  placeholder="Enter your first name"
                  required
                  autoFocus
                />
                {contactAdminErrors.firstname && (
                  <div className="input-error-message">
                    {contactAdminErrors.firstname}
                  </div>
                )}
              </div>
              <div className="login-field">
                <label htmlFor="contact-last-name">Last Name</label>
                <input
                  id="contact-last-name"
                  type="text"
                  value={contactAdminForm.lastname}
                  onChange={(e) => {
                    const value = e.target.value;
                    setContactAdminForm({
                      ...contactAdminForm,
                      lastname: value,
                    });
                    if (value.trim() === "") {
                      setContactAdminErrors((prev) => ({
                        ...prev,
                        lastname: "This field is required.",
                      }));
                    } else if (!isValidName(value)) {
                      setContactAdminErrors((prev) => ({
                        ...prev,
                        lastname:
                          "Please enter a valid name without numbers or special characters.",
                      }));
                    } else {
                      setContactAdminErrors((prev) => ({
                        ...prev,
                        lastname: "",
                      }));
                    }
                  }}
                  placeholder="Enter your last name"
                  required
                />
                {contactAdminErrors.lastname && (
                  <div className="input-error-message">
                    {contactAdminErrors.lastname}
                  </div>
                )}
              </div>
              <div className="login-field">
                <label htmlFor="contact-email">Email Address</label>
                <div className="login-input-icon-wrap">
                  <input
                    id="contact-email"
                    type="email"
                    value={contactAdminForm.email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setContactAdminForm({
                        ...contactAdminForm,
                        email: value,
                      });
                      if (value.trim() === "") {
                        setContactAdminErrors((prev) => ({
                          ...prev,
                          email: "This field is required.",
                        }));
                      } else if (!isValidEmail(value)) {
                        setContactAdminErrors((prev) => ({
                          ...prev,
                          email: "Please enter a valid email address",
                        }));
                      } else {
                        setContactAdminErrors((prev) => ({
                          ...prev,
                          email: "",
                        }));
                      }
                    }}
                    placeholder="Enter your email"
                    required
                  />
                  <span className="login-input-icon">
                    <svg width="18" height="18" fill="none">
                      <path
                        d="M2 4.5A2.5 2.5 0 0 1 4.5 2h9A2.5 2.5 0 0 1 16 4.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 2 13.5v-9z"
                        stroke="#aaa"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M16 4l-7 6.5L2 4"
                        stroke="#aaa"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                </div>
                {contactAdminErrors.email && (
                  <div className="input-error-message">
                    {contactAdminErrors.email}
                  </div>
                )}
              </div>
              <div className="login-field">
                <label htmlFor="contact-phone">Phone Number</label>
                <div className="login-input-icon-wrap">
                  <input
                    id="contact-phone"
                    type="tel"
                    value={contactAdminForm.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      setContactAdminForm({
                        ...contactAdminForm,
                        phone: value,
                      });
                      if (value.trim() === "") {
                        setContactAdminErrors((prev) => ({
                          ...prev,
                          phone: "This field is required.",
                        }));
                      } else if (!isValidTenDigitPhone(value)) {
                        setContactAdminErrors((prev) => ({
                          ...prev,
                          phone: "Phone number must have 10 digits.",
                        }));
                      } else {
                        setContactAdminErrors((prev) => ({
                          ...prev,
                          phone: "",
                        }));
                      }
                    }}
                    placeholder="Enter your phone number"
                    required
                  />
                  <span className="login-input-icon">
                    <svg width="18" height="18" fill="none">
                      <path
                        d="M3 2h3l1 5-2 2a12 12 0 0 0 5 5l2-2 5 1v3a2 2 0 0 1-2 2C7.58 20 2 14.42 2 8a2 2 0 0 1 2-2z"
                        stroke="#aaa"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                </div>
                {contactAdminErrors.phone && (
                  <div className="input-error-message">
                    {contactAdminErrors.phone}
                  </div>
                )}
              </div>
              <div className="login-field">
                <label htmlFor="contact-role">Role</label>
                <select
                  name="contact-role"
                  id="contact-role"
                  value={contactAdminForm.role}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.trim() === "") {
                      setContactAdminErrors((prev) => ({
                        ...prev,
                        role: "This field is required.",
                      }));
                    } else {
                      setContactAdminForm({ ...contactAdminForm, role: value });
                    }
                  }}
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  <option value="receptionist">Receptionist</option>
                  <option value="host">Host</option>
                  <option value="soldier">Soldier</option>
                </select>

                {contactAdminErrors.role && (
                  <div className="input-error-message">
                    {contactAdminErrors.role}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="login-card-submit-btn"
                disabled={contactAdminLoading}
              >
                {contactAdminLoading ? (
                  <>
                    <span className="login-btn-spinner"></span> Sending
                    Request...
                  </>
                ) : (
                  "Send Request"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
