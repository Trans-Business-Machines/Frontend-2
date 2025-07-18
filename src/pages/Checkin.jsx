import "./Checkin.css";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { capitalize } from "../utils";
import Snackbar from "../components/Snackbar";
import axiosInstance from "../api/axiosInstance";

// ✅ Fetch hosts with schedules (updated endpoint)
const getHostsWithSchedules = () => {
  return axiosInstance.get("/users/hosts-with-schedules");
};

const getVisitPurposes = () => {
  return axiosInstance.get("/purposes");
};

export default function Checkin() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    national_id: "",
    phone: "",
    host: "",
    purpose: "",
  });

  const [data, setData] = useState({});
  const [checkingIn, setCheckingIn] = useState(false);
  const { user } = useAuth();

  // ✅ Fetch hosts (with schedules) + purposes
  useEffect(() => {
    async function fetchHostsAndPurposes() {
      try {
        const [hostsResponse, purposesResponse] = await Promise.all([
          getHostsWithSchedules(),
          getVisitPurposes(),
        ]);

        const hosts = hostsResponse.data.hosts; // includes schedule info
        const purposes = purposesResponse.data.purposes;
        setData({ hosts, purposes });
      } catch (err) {
        console.error("Error getting hosts and purposes", err);
      }
    }
    fetchHostsAndPurposes();
  }, []);

  const clearForm = () => {
    setForm({
      firstname: "",
      lastname: "",
      national_id: "",
      phone: "",
      host: "",
      purpose: "",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCheckingIn(true);

    try {
      const res = await axiosInstance.post("/visits/new", {
        ...form,
        checkin_officer: user.userId,
      });

      if (res.data.success) {
        toast.custom(
          <Snackbar
            icon={FaCheck}
            message="Visitor checked in successfully!"
            type="success"
          />
        );
        clearForm();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Check-in failed";
      toast.custom(
        <Snackbar icon={FaXmark} message={errorMessage} type="error" />
      );
    } finally {
      setCheckingIn(false);
    }
  };

  // ✅ Helper to check if host is currently available
  const isHostAvailable = (schedule) => {
    if (!schedule) return false;
    const now = new Date();
    const start = new Date(schedule.start_date);
    const end = new Date(schedule.end_date);
    return now >= start && now <= end;
  };

  return (
    <div className="checkin-form-outer">
      <form className="checkin-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="checkin-title">New Visitor Check-In</h2>
        <hr className="checkin-divider" />

        {/* Visitor Details */}
        <div className="checkin-fields-row">
          <div className="checkin-field">
            <label>
              First Name<span className="checkin-req">*</span>
            </label>
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={form.firstname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="checkin-field">
            <label>
              Last Name<span className="checkin-req">*</span>
            </label>
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={form.lastname}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="checkin-field">
          <label>
            ID Number<span className="checkin-req">*</span>
          </label>
          <input
            type="text"
            name="national_id"
            placeholder="ID Number"
            value={form.national_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="checkin-field">
          <label>
            Phone Number<span className="checkin-req">*</span>
          </label>
          <input
            type="text"
            name="phone"
            placeholder="07xxxxxxxx"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* ✅ Host Dropdown */}
        <div className="checkin-field">
          <label>
            Host<span className="checkin-req">*</span>
          </label>
          <div className="checkin-host-row">
            <select
              className="checkin-select"
              name="host"
              value={form.host}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select a host
              </option>
              {data?.hosts?.map((host) => {
                const available = isHostAvailable(host.schedule);
                return (
                  <option key={host._id} value={host._id}>
                    {capitalize(host.firstname)} {capitalize(host.lastname)}{" "}
                    {/* ✅ Show status in color */}
                    {available ? " - ✅ Available" : " - ❌ Unavailable"}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Purpose */}
        <div className="checkin-field">
          <label>
            Purpose of Visit<span className="checkin-req">*</span>
          </label>
          <select
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a purpose
            </option>
            {data?.purposes?.map((p, idx) => (
              <option key={idx} value={p}>
                {capitalize(p)}
              </option>
            ))}
          </select>
        </div>

        <button className="checkin-btn" type="submit" disabled={checkingIn}>
          Check In Visitor
        </button>
      </form>
    </div>
  );
}
