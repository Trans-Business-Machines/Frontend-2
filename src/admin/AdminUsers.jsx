import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import "./AdminUsers.css";

const mockUsers = [
  { id: 1, name: "Angela Moss", email: "angela@company.com", phone: "0712345001", role: "Admin", status: "Active" },
  { id: 2, name: "John Doe", email: "john@company.com", phone: "0712345002", role: "Soldier", status: "Inactive" },
  { id: 3, name: "Emma White", email: "emma@company.com", phone: "0712345003", role: "Host", status: "Active" },
  { id: 4, name: "Paul Black", email: "paul@company.com", phone: "0712345004", role: "Host", status: "Active" },
  { id: 5, name: "Sam Green", email: "sam@company.com", phone: "0712345005", role: "Soldier", status: "Inactive" },
  { id: 6, name: "Zara Blue", email: "zara@company.com", phone: "0712345006", role: "Host", status: "Active" },
  { id: 7, name: "Ava Brown", email: "ava@company.com", phone: "0712345007", role: "Admin", status: "Active" },
  { id: 8, name: "Liam Lee", email: "liam@company.com", phone: "0712345008", role: "Host", status: "Active" },
  { id: 9, name: "Mia White", email: "mia@company.com", phone: "0712345009", role: "Soldier", status: "Inactive" },
  { id: 10, name: "Ethan Clark", email: "ethan@company.com", phone: "0712345010", role: "Host", status: "Active" },
  { id: 11, name: "Olivia King", email: "olivia@company.com", phone: "0712345011", role: "Admin", status: "Active" },
  { id: 12, name: "Noah Scott", email: "noah@company.com", phone: "0712345012", role: "Host", status: "Active" },
  { id: 13, name: "Sophia Adams", email: "sophia@company.com", phone: "0712345013", role: "Soldier", status: "Inactive" },
  { id: 14, name: "Mason Ward", email: "mason@company.com", phone: "0712345014", role: "Host", status: "Active" },
  { id: 15, name: "Isabella Bell", email: "isabella@company.com", phone: "0712345015", role: "Admin", status: "Active" },
  { id: 16, name: "Lucas Evans", email: "lucas@company.com", phone: "0712345016", role: "Host", status: "Active" },
  { id: 17, name: "Mila Turner", email: "mila@company.com", phone: "0712345017", role: "Soldier", status: "Inactive" },
  { id: 18, name: "James Harris", email: "james@company.com", phone: "0712345018", role: "Host", status: "Active" }
];

const USERS_PER_PAGE = 5;

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search) ||
    ("" + u.id).includes(search)
  );

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const usersToDisplay = filteredUsers.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

  function handleEdit(idx) {
    setEditIdx(idx);
    setEditUser({ ...filteredUsers[idx] });
  }

  function handleEditSave() {
    const realIdx = users.findIndex(u => u.id === filteredUsers[editIdx].id);
    const updated = [...users];
    updated[realIdx] = { ...editUser, id: Number(editUser.id) };
    setUsers(updated);
    setEditUser(null);
    setEditIdx(null);
  }

  function handleDelete(idx) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const realIdx = users.findIndex(u => u.id === filteredUsers[idx].id);
      setUsers(users => users.filter((_, i) => i !== realIdx));
      if ((filteredUsers.length - 1) % USERS_PER_PAGE === 0 && page > 1) {
        setPage(page - 1);
      }
    }
  }

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <div className="admin-users-title">Manage System Users</div>
        <button className="admin-add-user-btn" onClick={() => navigate("/admin/users/new")}>+ Add New User</button>
      </div>

      <div className="admin-users-search">
        <input
          placeholder="Enter ID, name, email or phone"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <table className="admin-users-table">
        <thead>
          <tr>
            <th>Id Number</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersToDisplay.length === 0 ? (
            <tr><td colSpan={7} style={{ textAlign: "center" }}>No users found.</td></tr>
          ) : usersToDisplay.map((user, idx) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td>
                <span className={user.status === "Active" ? "status-active" : "status-inactive"}>
                  {user.status}
                </span>
              </td>
              <td>
                <span className="action-icon" title="Edit" onClick={() => handleEdit(idx)}><FaUserEdit color="green" /></span>
                <span className="action-icon" title="Delete" onClick={() => handleDelete(idx)}><AiFillDelete color="red" /></span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="admin-users-pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>{"<"}</button>
        {[...Array(totalPages)].map((_, idx) => (
          <button key={idx + 1} onClick={() => setPage(idx + 1)} className={page === idx + 1 ? "active" : ""}>
            {idx + 1}
          </button>
        ))}
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>{">"}</button>
      </div>

      {editUser && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <h3>Edit User</h3>
            <div className="modal-field"><label>Id Number</label><input type="text" value={editUser.id} onChange={e => setEditUser({ ...editUser, id: e.target.value })} /></div>
            <div className="modal-field"><label>Name</label><input value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })} /></div>
            <div className="modal-field"><label>Email</label><input value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} /></div>
            <div className="modal-field"><label>Phone</label><input value={editUser.phone} onChange={e => setEditUser({ ...editUser, phone: e.target.value })} /></div>
            <div className="modal-field"><label>Role</label><input value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })} /></div>
            <div className="modal-field"><label>Status</label><input value={editUser.status} onChange={e => setEditUser({ ...editUser, status: e.target.value })} /></div>

            <div className="modal-actions">
              <button onClick={handleEditSave} className="modal-save-btn">Save</button>
              <button onClick={() => { setEditUser(null); setEditIdx(null); }} className="modal-cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
