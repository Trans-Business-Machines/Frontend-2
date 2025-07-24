import "./AdminAddUser.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { capitalize } from "../utils/index";
import { FaCheck, FaXmark } from "react-icons/fa6";
import axiosInstance from "../api/axiosInstance";
import useSWRMutation from "swr/mutation";
import Snackbar from "../components/Snackbar";
import toast from "react-hot-toast";

const registerUser = async (url, { arg }) => {
  const { body } = arg;
  const response = await axiosInstance.post(url, body);
  return response.data;
};

const getRoles =  () => {
  return axiosInstance.get("/users/roles");
};

export default function AdminAddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });

  // Individual field errors
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [roles, setRoles] = useState([]);
  const [existingEmails, setExistingEmails] = useState([]);

  useEffect(() => {
    async function getAppRoles() {
      try {
        const [response] = await Promise.all([getRoles()]);
        setRoles(response.data.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setError("Failed to load roles. Please try again later.");
      }
    }
    getAppRoles();
  }, []);

  // Fetch existing emails for duplicate check
  useEffect(() => {
    const fetchExistingEmails = async () => {
      try {
        const response = await axiosInstance.get("/users");
        let userData = [];
        if (Array.isArray(response.data)) {
          userData = response.data;
        } else if (response.data.users && Array.isArray(response.data.users)) {
          userData = response.data.users;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          userData = response.data.data;
        }
        const emails = userData.map((user) => user.email.toLowerCase());
        setExistingEmails(emails);
      } catch (error) {
        console.error("Failed to fetch existing emails:", error);
      }
    };
    fetchExistingEmails();
  }, []);

  // Validation functions
  const validateFirstName = (name) => {
    if (!name.trim()) {
      return "First name is required.";
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      return "Only letters are allowed.";
    }
    return "";
  };

  const validateLastName = (name) => {
    if (!name.trim()) {
      return "Last name is required.";
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      return "Only letters are allowed.";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email is required.";
    }
    if (!email.includes("@gmail.com")) {
      return "Invalid email format.";
    }
    if (existingEmails.includes(email.toLowerCase())) {
      return "This email is already in use.";
    }
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) {
      return "Phone number is required.";
    }
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length !== 10) {
      return "Phone number must be exactly 10 digits";
    }
    return "";
  };

  const validateRole = (role) => {
    if (!role) {
      return "Please select a role.";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password.trim()) {
      return "Password is required.";
    }
    return "";
  };

  const { trigger } = useSWRMutation("/auth/register", registerUser);

  function handleChange(e) {
    const { name, value } = e.target;

    // Handle phone input - only allow digits
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, [name]: digitsOnly });
    } else {
      setForm({ ...form, [name]: value });
    }

    setError("");

    // Real-time validation
    let fieldError = "";
    const valueToValidate =
      name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;

    switch (name) {
      case "firstname":
        fieldError = validateFirstName(valueToValidate);
        break;
      case "lastname":
        fieldError = validateLastName(valueToValidate);
        break;
      case "email":
        fieldError = validateEmail(valueToValidate);
        break;
      case "phone":
        fieldError = validatePhone(valueToValidate);
        break;
      case "role":
        fieldError = validateRole(valueToValidate);
        break;
      case "password":
        fieldError = validatePassword(valueToValidate);
        break;
      default:
        break;
    }

    // Update individual field error
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  }

  // Validate all fields
  const validateForm = () => {
    const newErrors = {
      firstname: validateFirstName(form.firstname),
      lastname: validateLastName(form.lastname),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      role: validateRole(form.role),
      password: validatePassword(form.password),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  function clearform() {
    setForm({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      role: "",
      password: "",
    });
    setErrors({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      role: "",
      password: "",
    });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await trigger({
        body: {
          firstname: form.firstname.trim(),
          lastname: form.lastname.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          role: form.role.trim(),
          password: form.password.trim(),
        },
      });
      if (result.success) {
        clearform();
        toast.custom(
          <Snackbar icon={FaCheck} message={result.message} type="success" />
        );
      }
      navigate("/admin/users");
    } catch (error) {
      console.log("Error submitting form:", error);

      // Handle specific API errors
      if (error.response?.status === 400) {
        const apiError = error.response.data;
        if (apiError.message?.includes("email")) {
          setErrors((prev) => ({
            ...prev,
            email: "This email is already in use.",
          }));
        } else {
          setError(
            "Failed to create user. Please check your input and try again."
          );
        }
      } else {
        setError("Failed to create user. Please try again later.");
      }

      toast.custom(
        <Snackbar
          icon={FaXmark}
          message={error.response?.data?.message || "Failed to create user"}
          type="error"
        />
      );
    }
  }

  return (
    <div className="admin-add-user">
      <div className="admin-add-user-title">Add New User</div>
      <div className="admin-add-user-desc">
        Fill in the form below to create a new system user.
      </div>
      <form className="admin-add-user-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <input
              name="firstname"
              placeholder="First Name*"
              value={form.firstname}
              onChange={handleChange}
              className={errors.firstname ? "error" : ""}
            />
            {errors.firstname && (
              <div className="field-error">{errors.firstname}</div>
            )}
          </div>
          <div className="form-field">
            <input
              name="lastname"
              placeholder="Last Name*"
              value={form.lastname}
              onChange={handleChange}
              className={errors.lastname ? "error" : ""}
            />
            {errors.lastname && (
              <div className="field-error">{errors.lastname}</div>
            )}
          </div>
        </div>

        <div className="form-row-single">
          <div className="form-field">
            <input
              name="email"
              type="email"
              placeholder="Email*"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
        </div>

        <div className="form-row-single">
          <div className="form-field">
            <input
              name="phone"
              placeholder="Phone Number*"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              className={errors.phone ? "error" : ""}
            />
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>
        </div>

        <div className="form-row-single">
          <div className="form-field">
            <input
              name="password"
              type="password"
              placeholder="Password*"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <div className="field-error">{errors.password}</div>
            )}
          </div>
        </div>

        {error && (
          <div className="form-warning">
            <span className="warning-icon">⚠</span>
            <span className="warning-text">{error}</span>
          </div>
        )}

        <div className="form-row-single">
          <div className="form-field">
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={errors.role ? "error" : ""}
            >
              <option value="" disabled>
                Select a role
              </option>
              {roles?.map((role) => (
                <option key={role} value={role}>
                  {capitalize(role)}
                </option>
              ))}
            </select>
            {errors.role && <div className="field-error">{errors.role}</div>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Submit
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/admin/users")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
