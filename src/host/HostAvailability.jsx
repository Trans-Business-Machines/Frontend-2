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
  const [hasSchedule, setHasSchedule] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //  Fetch existing availability when component mounts
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!user?.userId) return;
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/users/${user.userId}`);
        const availability = res.data?.availability;
        if (availability?.startDate && availability?.endDate) {
          // Convert ISO/timestamp to YYYY-MM-DD
          const startDate = new Date(availability.startDate);
          const endDate = new Date(availability.endDate);
          setStart(startDate.toISOString().split("T")[0]);
          setEnd(endDate.toISOString().split("T")[0]);
          setHasSchedule(true);
        }
      } catch (err) {
        console.log("No existing schedule or failed to fetch:", err);
      } finally {
        setIsLoading(false);
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

    //  Client-side validation
    if (!start || !end) {
      toast.custom(<Snackbar type="error" message="Please select both start and end dates." />);
      return;
    }

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDateObj > endDateObj) {
      toast.custom(<Snackbar type="error" message="Start date cannot be after end date." />);
      return;
    }

    if (startDateObj < today) {
      toast.custom(<Snackbar type="error" message="Start date cannot be in the past." />);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        start_date: new Date(start).setHours(0, 0, 0, 0),
        end_date: new Date(end).setHours(23, 59, 59, 999),
      };

      let res;
      if (!hasSchedule) {
        // POST new schedule
        res = await axiosInstance.post(`/users/schedule/${user.userId}`, payload);
        setHasSchedule(true);
      } else {
        // PATCH existing schedule
        res = await axiosInstance.patch(`/users/schedule/${user.userId}`, payload);
      }

      toast.custom(
        <Snackbar type="success" message="Availability saved successfully!" icon={FaCheck} />
      );
      console.log("✅ Availability saved:", res.data);
    } catch (error) {
      console.error("❌ Failed to save availability:", error);
      const errorMessage = error.response?.data?.message || "Failed to save availability.";
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
              onChange={(e) => setStart(e.target.value)}
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
              onChange={(e) => setEnd(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="host-availability-save-btn"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : hasSchedule ? "Update Availability" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
