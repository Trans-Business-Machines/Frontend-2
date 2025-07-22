import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HostProfile.css";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function HostProfile() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get logged-in user info
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.userId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/users/${user.userId}`);
        setProfile(response.data); // Expecting user data from backend
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.userId]);

  if (loading) {
    return <div className="host-scrollable-content">Loading profile...</div>;
  }

  if (error) {
    return <div className="host-scrollable-content" style={{ color: "red" }}>{error}</div>;
  }

  if (!profile) {
    return <div className="host-scrollable-content">No profile data found.</div>;
  }

  return (
    <div className="host-scrollable-content">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar">
            <svg width="64" height="64" fill="none">
              <circle cx="32" cy="32" r="32" fill="#E8E8E8" />
              <circle cx="32" cy="27" r="16" fill="#fff" stroke="#aaa" strokeWidth="2" />
              <circle cx="32" cy="27" r="10" fill="#E8E8E8" />
              <path d="M14 56c0-7 9-12 18-12s18 5 18 12" fill="#fff" stroke="#aaa" strokeWidth="2" />
            </svg>
          </div>
          <h3 className="profile-title">Your Profile</h3>
          <div className="profile-updated">
            Last updated: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "N/A"}
          </div>

          <div className="profile-details">
            <div className="profile-row">
              <span className="profile-label">User ID</span>
              <span className="profile-value">{profile._id}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Full Name</span>
              <span className="profile-value">{profile.firstname} {profile.lastname}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Email Address</span>
              <span className="profile-value">{profile.email}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Phone Number</span>
              <span className="profile-value">{profile.phone}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Role</span>
              <span className="profile-value">{profile.role}</span>
            </div>
          </div>

          <button
            className="profile-change-btn"
            onClick={() => navigate("/host/profile/change-password")}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
