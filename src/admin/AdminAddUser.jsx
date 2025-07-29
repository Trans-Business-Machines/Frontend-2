import "./AdminAddUser.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { capitalize } from "../utils/index";
import { FaCheck, FaXmark } from "react-icons/fa6";
import axiosInstance from "../api/axiosInstance";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import Snackbar from "../components/Snackbar";
import toast from "react-hot-toast";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidTenDigitPhone,
} from "../utils/index";

const registerUser = async (url, { arg }) => {
  const { body } = arg;
  const response = await axiosInstance.post(url, body);
  return response.data;
};

const getRoles = async () => {
  const response = await axiosInstance.get("/users/roles");
  return response.data.roles;
};

export default function AdminAddUser() {
  const navigate = useNavigate();

  // Use useSWR hook to get the pre-loaded roles data
  const { data: roles = [] } = useSWR("/users/roles", getRoles);

  // User form state
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });

  // Individual field errors state
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });

  // Function to add the user
  const { trigger } = useSWRMutation("/auth/register", registerUser);

  function handleChange(e) {
    const { name, value } = e.target;

    let digitsOnly = 0;

    // Handle phone input - only allow digits
    if (name === "phone") {
      digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, [name]: digitsOnly });
    } else {
      setForm({ ...form, [name]: value });
    }

    // Real-time validation
    let fieldError = "";

    const valueToValidate = name === "phone" ? digitsOnly : value;

    switch (name) {
      case "firstname":
        if (!isValidName(valueToValidate))
          fieldError = "First name should only have alphabets";
        break;
      case "lastname":
        if (!isValidName(valueToValidate))
          fieldError = "Last name name should only have alphabets";
        break;
      case "email":
        if (!isValidEmail(valueToValidate))
          fieldError = "Invalid email address.";
        break;
      case "phone":
        if (!isValidTenDigitPhone(valueToValidate))
          fieldError = "Phone number is invalid";
        break;
      case "role":
        if (!valueToValidate) fieldError = "Role is required!";
        break;
      case "password":
        const { isValid, message } = isValidPassword(valueToValidate, [
          form.firstname,
          form.lastname,
        ]);

        if (!isValid) fieldError = message;
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
  }

  async function handleSubmit(e) {
    e.preventDefault();

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
              type="text"
              name="firstname"
              placeholder="First Name*"
              value={form.firstname}
              onChange={handleChange}
              className={errors.firstname ? "error" : ""}
              required
            />
            {errors.firstname && (
              <div className="field-error">{errors.firstname}</div>
            )}
          </div>
          <div className="form-field">
            <input
              type="text"
              name="lastname"
              placeholder="Last Name*"
              value={form.lastname}
              onChange={handleChange}
              className={errors.lastname ? "error" : ""}
              required
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
              required
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
        </div>

        <div className="form-row-single">
          <div className="form-field">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number*"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              className={errors.phone ? "error" : ""}
              required
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
              required
            />
            {errors.password && (
              <div className="field-error">{errors.password}</div>
            )}
          </div>
        </div>

        <div className="form-row-single">
          <div className="form-field">
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={errors.role ? "error" : ""}
              required
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
