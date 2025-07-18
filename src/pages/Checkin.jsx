import "./Checkin.css";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { capitalize } from "../utils";
import Snackbar from "../components/Snackbar";
import axiosInstance from "../api/axiosInstance";

const getAllHosts = () => {
  return axiosInstance.get("/hosts");
};

const getVisitPurposes = () => {
  return axiosInstance.get("/purposes");
};

export default function Checkin() {
  // State for form fields
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

  // Parallel fetch the Hosts and Purposes from the backend on component mount
  useEffect(() => {
    async function getHostsAndPurposes() {
      try {
        const [hostsResponse, purposesResponse] = await Promise.all([
          getAllHosts(),
          getVisitPurposes(),
        ]);
        const hosts = hostsResponse.data.hosts;
        const purposes = purposesResponse.data.purposes;
        setData((prevData) => ({ ...prevData, hosts, purposes }));
      } catch (err) {
        console.log("Error getting hosts and purposes", err);
      }
    }
    getHostsAndPurposes();
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

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCheckingIn(true);
    try {
      // IMPORTANT: Trim whitespace from string fields before sending to backend
      const trimmedForm = {
        ...form,
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        national_id: form.national_id.trim(), // Also trim ID if it's strictly numeric
        phone: form.phone.trim(),             // Also trim phone if it's strictly numeric
      };

      const res = await axiosInstance.post("/visits/new", {
        ...trimmedForm, // Use the trimmed form data
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

  return (
    <div className="checkin-form-outer">
      <form className="checkin-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="checkin-title">New Visitor Check-In</h2>
        <hr className="checkin-divider" />
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
              {data?.hosts?.map((host) => (
                <option key={host._id} value={host._id}>
                  {capitalize(host.firstname)} {capitalize(host.lastname)}{" "}
                  &nbsp;
                  {host.role === "receptionist" && (
                    <span>- ({capitalize(host.role)})</span>
                  )}
                </option>
              ))}
            </select>
          </div>
        </div>
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