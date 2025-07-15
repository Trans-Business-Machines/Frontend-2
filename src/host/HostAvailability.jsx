import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Snackbar from "../components/Snackbar";
import { FaCheck } from "react-icons/fa";
import "./HostAvailability.css";

export default function HostAvailability() {
  const { user } = useAuth();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Optional: Fetch current availability when component mounts
  useEffect(() => {
    const fetchAvailability = async () => {
      if (user?.userId) {
        try {
          setIsLoading(true);
          // Assuming a GET endpoint like /api/users/:userId to fetch current availability
          const response = await axiosInstance.get(`/users/${user.userId}`);
          const userData = response.data;
          if (userData.availability && userData.availability.startDate && userData.availability.endDate) {
            // Format dates from backend (which might be timestamps or ISO strings) to YYYY-MM-DD for input type="date"
            const startDate = typeof userData.availability.startDate === 'number'
                              ? new Date(userData.availability.startDate)
                              : new Date(userData.availability.startDate);
            const endDate = typeof userData.availability.endDate === 'number'
                            ? new Date(userData.availability.endDate)
                            : new Date(userData.availability.endDate);

            setStart(startDate.toISOString().split('T')[0]);
            setEnd(endDate.toISOString().split('T')[0]);
          }
        } catch (error) {
          console.error("Failed to fetch availability:", error);
          if (error.response?.status !== 404) {
            toast.custom(<Snackbar type="error" message="Failed to load availability." />);
          }
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchAvailability();
  }, [user?.userId]);


  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.userId) {
      toast.custom(<Snackbar type="error" message="User not logged in." />);
      return;
    }

    // --- Client-side Validation (kept for better user experience) ---
    if (!start || !end) {
      toast.custom(<Snackbar type="error" message="Please select both start and end dates." />);
      return;
    }

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day for comparison

    if (startDateObj > endDateObj) {
      toast.custom(<Snackbar type="error" message="Start date cannot be after end date." />);
      return;
    }

    if (startDateObj < today) {
      toast.custom(<Snackbar type="error" message="Start date cannot be in the past." />);
      return;
    }
    // --- End Client-side Validation ---

    setIsLoading(true);
    try {
      // Convert YYYY-MM-DD strings to Unix timestamps (milliseconds since epoch)
      // This aligns with the 'Number' type error you previously received,
      // and Mongoose 'Date' type can also accept numbers.
      const startDateTimestamp = new Date(start).setHours(0, 0, 0, 0); // Start of day in local timezone
      const endDateTimestamp = new Date(end).setHours(23, 59, 59, 999); // End of day in local timezone

      const response = await axiosInstance.post(
        `/users/schedule/${user.userId}`,
        {
          // IMPORTANT: Changed keys to match backend schema (start_date, end_date)
          start_date: startDateTimestamp,
          end_date: endDateTimestamp,
        }
      );
      toast.custom(<Snackbar type="success" message="Availability saved successfully!" icon={FaCheck} />);
      console.log("Availability saved:", response.data);
    } catch (error) {
      console.error("Failed to save availability:", error);
      const errorMessage = error.response?.data?.message || "Failed to save availability. Please try again.";
      toast.custom(<Snackbar type="error" message={errorMessage} />);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="host-scrollable-content">
      <div className="host-availability-wrapper">
        <div className="host-availability-title">Set your availability</div>
        <div className="host-availability-desc">
          Let guests know when you’re available. You can adjust your schedule anytime.
        </div>
        <form className="host-availability-fields" onSubmit={handleSave}>
          <div className="host-availability-field">
            <span role="img" aria-label="calendar" className="host-availability-icon">📅</span>
            <input
              className="host-availability-input"
              type="date"
              value={start}
              onChange={e => setStart(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="host-availability-field">
            <span role="img" aria-label="calendar" className="host-availability-icon">📅</span>
            <input
              className="host-availability-input"
              type="date"
              value={end}
              onChange={e => setEnd(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="host-availability-save-btn" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}