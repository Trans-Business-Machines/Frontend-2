import "./AdminUsers.css";
import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import useSWR, { preload } from "swr";
import { capitalize } from "../utils/index";
import { FaChevronRight, FaChevronLeft, FaXmark } from "react-icons/fa6";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import Snackbar from "../components/Snackbar";

// Fetcher function for roles
const getRoles = async () => {
  const response = await axiosInstance.get("/users/roles");
  return response.data.roles;
};

// Fetcher function to get users (e.g admin, hosts, soldiers....)
const getUsers = async (url) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

// prelaod the roles
preload("/users/roles", getRoles);

export default function AdminUsers() {
  // Get all the roles for this user from the backend
  const { data: roles = [], isLoading } = useSWR("/users/roles", getRoles);

  // state to track the current page
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [editIdx, setEditIdx] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Get the user data for the current page
  const { data: userData = [], mutate } = useSWR(
    `/users?page=${currentPage}`,
    getUsers
  );

  const filtedUsers = useMemo(() => {
    let appUsers = userData?.users || [];

    // if there is no search return appUsers
    if (!search) return appUsers;

    const term = search.toLowerCase();

    appUsers = appUsers?.filter(
      ({ _id: id, firstname, lastname, email, phone }) =>
        id.includes(term) ||
        firstname.includes(term) ||
        lastname.includes(term) ||
        email.includes(term) ||
        phone.includes(term)
    );

    return appUsers;
  }, [userData, search]);

  function handleEdit(user) {
    const userIndex = filtedUsers.findIndex((u) => u._id === user._id);
    setEditIdx(userIndex);
    setEditUser({ ...user });
  }

  function cancelEdit() {
    setEditIdx(null);
    setEditUser(null);
  }

  async function saveEdit() {
    if (
      !editUser.firstname ||
      !editUser.lastname ||
      !editUser.email ||
      !editUser.phone
    )
      return;

    setIsSaving(true);
    try {
      // Try to call the api endpoint to update the user
      await axiosInstance.patch(`/users/${editUser._id}`, {
        firstname: editUser.firstname,
        lastname: editUser.lastname,
        email: editUser.email,
        phone: editUser.phone,
        role: editUser.role,
      });

      // call mutate ti update cache and UI
      mutate();

      setEditIdx(null);
      setEditUser(null);
    } catch (error) {
      // show the error
      const message = error?.response.data.message || "Failed to update user!";
      toast.custom(<Snackbar type="error" message={message} icon={FaXmark} />);
    } finally {
      setIsSaving(false);
    }
  }

  function confirmDelete(user) {
    setUserToDelete(user);
  }

  function cancelDelete() {
    setUserToDelete(null);
  }

  async function deleteUserConfirmed() {
    try {
      // Try to  call API to delete user
      await axiosInstance.delete(`/users/${userToDelete._id}`);

      // Set userToDelete to null
      setUserToDelete(null);

      // Call mutate the data in cache and UI
      mutate();
    } catch (error) {
      const message = error?.response.data?.message || "Failed to delete user";
      toast.custom(<Snackbar type="error" message={message} icon={FaXmark} />);
    }
  }

  const handleAddUser = () => {
    navigate("/admin/users/new", {
      state: { returnTo: "/admin/users", refreshUsers: true },
    });
  };

  /*   if (isLoading) {
    return (
      <div className="admin-users">
        <div className="admin-users-header">
          <div className="admin-users-title">Manage System Users</div>
        </div>
        <div style={{ textAlign: "center", padding: "50px", fontSize: "16px" }}>
          Loading all users...
        </div>
      </div>
    );
  } */

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <div className="admin-users-title">Manage System Users</div>
        <button className="admin-add-user-btn" onClick={handleAddUser}>
          + Add New User
        </button>
      </div>

      <div className="admin-users-search">
        <input
          placeholder="Search by User ID, Name, Email, or Phone"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            width: "55%",
          }}
        />
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "50px", fontSize: "16px" }}>
          Loading all users...
        </div>
      ) : (
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtedUsers?.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  {filtedUsers.length === 0
                    ? "No users found."
                    : "No users to display on this page."}
                </td>
              </tr>
            )}
            {filtedUsers?.map((user, idx) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>
                  {editIdx === idx ? (
                    <div style={{ display: "flex", gap: "5px" }}>
                      <input
                        type="text"
                        value={editUser.firstname}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            firstname: e.target.value,
                          })
                        }
                        style={{
                          width: "80px",
                          padding: "4px",
                          border: "1px solid #ccc",
                          borderRadius: "3px",
                        }}
                        disabled={isSaving}
                      />
                      <input
                        type="text"
                        value={editUser.lastname}
                        onChange={(e) =>
                          setEditUser({ ...editUser, lastname: e.target.value })
                        }
                        style={{
                          width: "80px",
                          padding: "4px",
                          border: "1px solid #ccc",
                          borderRadius: "3px",
                        }}
                        disabled={isSaving}
                      />
                    </div>
                  ) : (
                    `${user.firstname} ${user.lastname}`
                  )}
                </td>
                <td>
                  {editIdx === idx ? (
                    <input
                      type="email"
                      value={editUser.email}
                      onChange={(e) =>
                        setEditUser({ ...editUser, email: e.target.value })
                      }
                      style={{
                        width: "150px",
                        padding: "4px",
                        border: "1px solid #ccc",
                        borderRadius: "3px",
                      }}
                      disabled={isSaving}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editIdx === idx ? (
                    <input
                      type="text"
                      value={editUser.phone}
                      onChange={(e) =>
                        setEditUser({ ...editUser, phone: e.target.value })
                      }
                      style={{
                        width: "100px",
                        padding: "4px",
                        border: "1px solid #ccc",
                        borderRadius: "3px",
                      }}
                      disabled={isSaving}
                    />
                  ) : (
                    user.phone
                  )}
                </td>
                <td>
                  {editIdx === idx ? (
                    <select
                      value={editUser.role}
                      onChange={(e) =>
                        setEditUser({ ...editUser, role: e.target.value })
                      }
                      style={{
                        width: "100px",
                        padding: "4px",
                        border: "1px solid #ccc",
                        borderRadius: "3px",
                      }}
                      disabled={isSaving}
                    >
                      {roles?.map((role, idx) => (
                        <option key={idx} value={role}>
                          {capitalize(role)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  {editIdx === idx ? (
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button
                        onClick={saveEdit}
                        disabled={isSaving}
                        style={{
                          backgroundColor: isSaving ? "#ccc" : "#4CAF50",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: isSaving ? "not-allowed" : "pointer",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={isSaving}
                        style={{
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: isSaving ? "not-allowed" : "pointer",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className="action-icon"
                        title="Edit"
                        onClick={() => handleEdit(user)}
                      >
                        <FaUserEdit color="green" />
                      </span>
                      <span
                        className="action-icon"
                        title="Delete"
                        onClick={() => confirmDelete(user)}
                      >
                        <AiFillDelete color="red" />
                      </span>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="admin-users-pagination">
        <button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          className="pagination-button"
          disabled={!userData?.hasPrev}
        >
          <FaChevronLeft />
        </button>
        <button className="active">{currentPage}</button>
        <button
          className="pagination-button"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={!userData?.hasNext}
        >
          <FaChevronRight />
        </button>
      </div>

      {userToDelete && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <h3>Delete user?</h3>
            <p>
              Are you sure you want to delete
              <strong>
                {userToDelete.firstname} {userToDelete.lastname}
              </strong>
              ?
            </p>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="modal-cancel-btn">
                Cancel
              </button>
              <button
                onClick={deleteUserConfirmed}
                className="modal-save-btn"
                style={{ backgroundColor: "#F45B47" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
