import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isLikelyEmail(value) {
  return value.includes('@');
}
function isValidPhone(phone) {
  return /^(\+?\d{7,})$/.test(phone) && !isLikelyEmail(phone);
}

function useToast() {
  return {
    showToast: (msg, type) => alert(msg)
  };
}

export default function Login() {
  const [authMode, setAuthMode] = useState("phone");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAuthMode = (mode) => {
    setAuthMode(mode);
    setErrorMsg("");
    setPassword("");
    if (mode === "phone") setEmail("");
    else setPhone("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (authMode === "phone") {
      if (!phone.trim() || email.trim()) {
        setErrorMsg("Please enter your phone number only.");
        setLoading(false);
        return;
      }
      if (!isValidPhone(phone)) {
        setErrorMsg("Please enter a valid phone number (digits only).");
        setLoading(false);
        return;
      }
    } else {
      if (!email.trim() || phone.trim()) {
        setErrorMsg("Please enter your email only.");
        setLoading(false);
        return;
      }
      if (!isValidEmail(email)) {
        setErrorMsg("Please enter a valid email address.");
        setLoading(false);
        return;
      }
    }

    try {
      let user;
      if (authMode === "phone") {
        user = await login(phone, password, undefined, "phone");
      } else {
        user = await login(email, password, undefined, "email");
      }

      showToast("Login successful!", "success");

      if (user.role === "soldier") {
        navigate("/", { state: { toast: "Login successful!" } });
      } else if (user.role === "admin") {
        navigate("/admin/dashboard", { state: { toast: "Login successful!" } });
      } else if (user.role === "host") {
        navigate("/host/dashboard", { state: { toast: "Login successful!" } });
      } else {
        setErrorMsg("You are not authorized for this dashboard.");
        showToast("You are not authorized for this dashboard.", "error");
      }
    } catch {
      setErrorMsg(
        authMode === "email"
          ? "Invalid email or password. Please check and try again."
          : "Invalid phone number or password. Please check and try again."
      );
      showToast("Login failed. Please check your credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg-split">
      <div className="login-split-left">
        <div className="login-logo-circle">
          <svg width="48" height="48" fill="none"><circle cx="24" cy="24" r="24" fill="#fff" fillOpacity="0.15"/><path d="M24 13a11 11 0 1 1-11 11 11 11 0 0 1 11-11zm0 19a8 8 0 1 0-8-8 8 8 0 0 0 8 8zm0-14.5A6.5 6.5 0 1 1 17.5 24 6.5 6.5 0 0 1 24 17.5zm0 10a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 24 27.5z" fill="#fff"/></svg>
        </div>
        <h1 className="login-title-main">Visitor Management<br />System</h1>
        <div className="login-quote-main">
          "Security and elegance meet here — manage<br />your visitors with ease."
        </div>
      </div>

      <div className="login-split-right">
        <form className="login-form-box" onSubmit={handleSubmit} autoComplete="off">
          <h2 className="login-welcome">Welcome Back</h2>
          <div className="login-card-subtitle">Please sign in to your account</div>

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
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoFocus
                />
                <span className="login-input-icon">
                  <svg width="18" height="18" fill="none"><path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h9A2.5 2.5 0 0 1 16 4.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 2 13.5v-9z" stroke="#aaa" strokeWidth="1.5"/><path d="M16 4l-7 6.5L2 4" stroke="#aaa" strokeWidth="1.5"/></svg>
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
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Enter your phone Number"
                  required
                  autoFocus
                />
                <span className="login-input-icon">
                  <svg width="18" height="18" fill="none"><path d="M3 2h3l1 5-2 2a12 12 0 0 0 5 5l2-2 5 1v3a2 2 0 0 1-2 2C7.58 20 2 14.42 2 8a2 2 0 0 1 2-2z" stroke="#aaa" strokeWidth="1.5"/></svg>
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
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <span
                className="login-input-icon login-password-icon"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M3 3l18 18" stroke="#888" strokeWidth="2" strokeLinecap="round"/><path d="M10.5 10.5a2 2 0 1 1 2.5 2.5" stroke="#888" strokeWidth="2"/><path d="M17.94 17.94A10.55 10.55 0 0 1 12 19C7 19 2.73 15.11 1 12a14.26 14.26 0 0 1 4.17-5.15m3.11-1.74A9.92 9.92 0 0 1 12 5c5 0 9.27 3.89 11 7a14.47 14.47 0 0 1-4.23 5.29" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
                ) : (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="7" stroke="#888" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="2"/></svg>
                )}
              </span>
            </div>
          </div>

          <div className="login-card-forgot">
            <a href="#">Forgot password?</a>
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
                <svg height="15" width="15" viewBox="0 0 20 20" style={{marginRight: 7, verticalAlign: "-2px"}}><path d="M10 2a8 8 0 1 1 0 16A8 8 0 0 1 10 2zm1 4v4l3 3" fill="none" stroke="#fff" strokeWidth="2"/></svg>
                Sign in
              </>
            )}
          </button>

          {/* Contact Admin moved here */}
          <div className="login-card-footer login-footer-split">
            Don’t have an account? <a href="#">Contact Admin</a>
          </div>
        </form>

        <div className="login-split-footer">
          © 2024 Visitor Management System. All rights reserved.
        </div>
      </div>
    </div>
  );
}
