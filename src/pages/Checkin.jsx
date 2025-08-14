import "./Checkin.css";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { capitalize } from "../utils";
import { formatInTimeZone } from "date-fns-tz";
import {
  isValidName,
  isValidNationalId,
  isValidTenDigitPhone,
  prepareUTCDateString,
} from "../utils/index";
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

  // State to keep track of error
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    national_id: "",
    phone: "",
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

  // Timezone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Validate individual field on change
    let error = "";

    if (name === "firstname" || name === "lastname") {
      if (!isValidName(value)) {
        error = `${capitalize(name)} should only contain letters`;
      }
    }

    if (name === "national_id") {
      if (!isValidNationalId(value)) {
        error = "National ID should be 8 digits";
      }
    }

    if (name === "phone") {
      if (!isValidTenDigitPhone(value)) {
        error = "Phone should be 10 digits";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Function to validate Form data
  const validateFormData = (formData) => {
    const newErrors = {};

    if (!isValidName(formData.firstname)) {
      newErrors.firstname = "Firstname should only have alphabets";
    }
    if (!isValidName(formData.lastname)) {
      newErrors.lastname = "Lastname should only have alphabets";
    }
    if (!isValidNationalId(formData.national_id)) {
      newErrors.national_id = "National ID should be 8 digits";
    }
    if (!isValidTenDigitPhone(formData.phone)) {
      newErrors.phone = "Phone should be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle submission of check in form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCheckingIn(true);

    const trimmedForm = {
      ...form,
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      national_id: form.national_id.trim(),
      phone: form.phone.trim(),
      time_in: prepareUTCDateString(new Date()),
    };

    const isValid = validateFormData(trimmedForm);

    if (!isValid) {
      toast.custom(
        <Snackbar
          type="error"
          message="Please fix validation errors before submitting."
          icon={FaXmark}
        />
      );
      setCheckingIn(false);
      return;
    }

    try {
      const res = await axiosInstance.post("/visits/new", {
        ...trimmedForm,
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
        setErrors({});
      }
    } catch (error) {
      let message = "";
      if (error.response.data?.details?.availableAt) {
        message = `Host is currently unavailable, check by ${formatInTimeZone(
          error.response.data.details.availableAt,
          timeZone,
          "do MMM yyyy, h:mm a"
        )}`;
      } else {
        message = error.response.data.message || "Check in failed !";
      }

      toast.custom(<Snackbar icon={FaXmark} message={message} type="error" />);
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

            {errors.firstname && (
              <p className="error-message">{errors.firstname}</p>
            )}
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
            {errors.lastname && (
              <p className="error-message">{errors.lastname}</p>
            )}
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
          {errors.national_id && (
            <p className="error-message">{errors.national_id}</p>
          )}
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
          {errors.phone && <p className="error-message">{errors.phone}</p>}
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
              required
            >
              <option value="" disabled>
                Select a host
              </option>
              {data?.hosts?.map((host) => (
                <option key={host._id} value={host._id}>
                  {capitalize(host.firstname)} {capitalize(host.lastname)}{" "}
                  &nbsp;
                  {host.role === "receptionist" && (
                    <span>-({capitalize(host.role)})</span>
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
