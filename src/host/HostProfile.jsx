import "./HostProfile.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import useSWR from "swr";
import axiosInstance from "../api/axiosInstance";

const getProfile = async (url) => {
  const { data } = await axiosInstance.get(url);
  return data;
};

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: profile, isLoading } = useSWR(
    `/users/${user.userId}`,
    getProfile
  );

  return (
    <section>
      {isLoading ? (
        <div>
          <p>Loading your profile...</p>
        </div>
      ) : (
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-avatar">
              <svg width="64" height="64" fill="none">
                <circle cx="32" cy="32" r="32" fill="#E8E8E8" />
                <circle
                  cx="32"
                  cy="27"
                  r="16"
                  fill="#fff"
                  stroke="#aaa"
                  strokeWidth="2"
                />
                <circle cx="32" cy="27" r="10" fill="#E8E8E8" />
                <path
                  d="M14 56c0-7 9-12 18-12s18 5 18 12"
                  fill="#fff"
                  stroke="#aaa"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h3 className="profile-title">Your Profile</h3>
            <div className="profile-updated">
              Last updated:&nbsp;
              {format(new Date(profile.updatedAt), "do MMM, yyyy hh:mm a")}
            </div>
            <div className="profile-details">
              <div className="profile-row">
                <span className="profile-icon">
                  <svg width="18" height="18" fill="none">
                    <circle
                      cx="9"
                      cy="6"
                      r="3.5"
                      stroke="#888"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M2 15c0-2.5 3-4 7-4s7 1.5 7 4"
                      stroke="#888"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
                <span className="profile-label">Full Name</span>
                <span className="profile-value">
                  {profile.firstname} {profile.lastname}
                </span>
              </div>
              <div className="profile-row">
                <span className="profile-icon">
                  <svg width="18" height="18" fill="none">
                    <rect
                      x="2.5"
                      y="4.5"
                      width="13"
                      height="9"
                      rx="2"
                      stroke="#888"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M4.5 6.5l5.5 3 5.5-3"
                      stroke="#888"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="profile-label">Email Address</span>
                <span className="profile-value">{profile.email}</span>
              </div>
              <div className="profile-row">
                <span className="profile-icon">
                  <svg width="18" height="18" fill="none">
                    <rect
                      x="5"
                      y="2"
                      width="8"
                      height="14"
                      rx="2"
                      stroke="#888"
                      strokeWidth="1.5"
                    />
                    <circle cx="9" cy="14" r="0.8" fill="#888" />
                  </svg>
                </span>
                <span className="profile-label">Phone Number</span>
                <span className="profile-value">{profile.phone}</span>
              </div>
              <div className="profile-row">
                <span className="profile-icon">
                  <svg width="18" height="18" fill="none">
                    <rect
                      x="3.5"
                      y="2.5"
                      width="11"
                      height="13"
                      rx="2"
                      stroke="#888"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M7 6h4M7 9h4M7 12h2"
                      stroke="#888"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="profile-label">Role</span>
                <span
                  className="profile-value"
                  style={{ textTransform: "capitalize" }}
                >
                  {profile.role}
                </span>
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
      )}
    </section>
  );
}
