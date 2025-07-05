import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminUsers.css";

const mockUsers = [
  { id: 1, name: "Angela Moss", email: "angela@company.com", phone: "+1 555 123 456", role: "Admin", status: "Active" },
  { id: 2, name: "John Doe", email: "john@company.com", phone: "+1 555 987 789", role: "Soldier", status: "Inactive" },
  { id: 3, name: "Emma White", email: "emma@company.com", phone: "+1 555 654 321", role: "Host", status: "Active" },
  { id: 4, name: "Paul Black", email: "paul@company.com", phone: "+1 555 111 111", role: "Host", status: "Active" },
  { id: 5, name: "Sam Green", email: "sam@company.com", phone: "+1 555 222 222", role: "Soldier", status: "Inactive" },
  { id: 6, name: "Zara Blue", email: "zara@company.com", phone: "+1 555 333 333", role: "Host", status: "Active" },
  { id: 7, name: "Ava Brown", email: "ava@company.com", phone: "+1 555 444 444", role: "Admin", status: "Active" },
  { id: 8, name: "Liam Lee", email: "liam@company.com", phone: "+1 555 555 555", role: "Host", status: "Active" },
  { id: 9, name: "Mia White", email: "mia@company.com", phone: "+1 555 666 666", role: "Soldier", status: "Inactive" },
  { id: 10, name: "Ethan Clark", email: "ethan@company.com", phone: "+1 555 777 777", role: "Host", status: "Active" },
  { id: 11, name: "Olivia King", email: "olivia@company.com", phone: "+1 555 888 888", role: "Admin", status: "Active" },
  { id: 12, name: "Noah Scott", email: "noah@company.com", phone: "+1 555 999 999", role: "Host", status: "Active" },
  { id: 13, name: "Sophia Adams", email: "sophia@company.com", phone: "+1 555 101 010", role: "Soldier", status: "Inactive" },
  { id: 14, name: "Mason Ward", email: "mason@company.com", phone: "+1 555 121 212", role: "Host", status: "Active" },
  { id: 15, name: "Isabella Bell", email: "isabella@company.com", phone: "+1 555 131 313", role: "Admin", status: "Active" },
  { id: 16, name: "Lucas Evans", email: "lucas@company.com", phone: "+1 555 141 414", role: "Host", status: "Active" },
  { id: 17, name: "Mila Turner", email: "mila@company.com", phone: "+1 555 151 515", role: "Soldier", status: "Inactive" },
  { id: 18, name: "James Harris", email: "james@company.com", phone: "+1 555 161 616", role: "Host", status: "Active" }
];

const USERS_PER_PAGE = 5;

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();

  // Filter users by search
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search) ||
    ("" + u.id).includes(search)
  );

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const usersToDisplay = filteredUsers.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

  // Open edit modal
  function handleEdit(idx) {
    setEditIdx(idx);
    setEditUser({ ...filteredUsers[idx] });
  }
  // Save edited user
  function handleEditSave() {
    // Find user by original ID
    const realIdx = users.findIndex(u => u.id === filteredUsers[editIdx].id);
    const updatedUser = { ...editUser, id: editUser.id };
    const updated = [...users];
    updated[realIdx] = updatedUser;
    setUsers(updated);
    setEditIdx(null);
    setEditUser(null);
  }
  // Delete with confirmation
  function handleDelete(idx) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const realIdx = users.findIndex(u => u.id === filteredUsers[idx].id);
      setUsers(users => users.filter((_, i) => i !== realIdx));
      if ((filteredUsers.length - 1) % USERS_PER_PAGE === 0 && page > 1) setPage(page - 1);
    }
  }

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <div className="admin-users-title">Manage System Users</div>
        <button
          className="admin-add-user-btn"
          onClick={() => navigate("/admin/users/new")}
        >+ Add New User</button>
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
            <th>ID</th>
            <th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersToDisplay.length === 0 &&
            <tr><td colSpan={7} style={{textAlign:"center"}}>No users found.</td></tr>
          }
          {usersToDisplay.map((user, idx) => (
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
                <span className="action-icon" title="Edit" onClick={() => handleEdit(idx)}>✏️</span>
                <span className="action-icon" title="Delete" onClick={() => handleDelete(idx)}>🗑️</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="admin-users-pagination">
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>{"<"}</button>
        {[...Array(totalPages)].map((_, idx) => (
          <button key={idx+1} onClick={() => setPage(idx+1)} className={page === idx+1 ? "active" : ""}>{idx+1}</button>
        ))}
        <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>{" > "}</button>
      </div>
      {/* Edit modal */}
      {editUser && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <h3>Edit User</h3>
            <div className="modal-field">
              <label>ID</label>
              <input
                type="text"
                value={editUser.id}
                onChange={e => setEditUser({ ...editUser, id: e.target.value })}
              />
            </div>
            <div className="modal-field">
              <label>Name</label>
              <input value={editUser.name} onChange={e => setEditUser({...editUser, name: e.target.value})} />
            </div>
            <div className="modal-field">
              <label>Email</label>
              <input value={editUser.email} onChange={e => setEditUser({...editUser, email: e.target.value})} />
            </div>
            <div className="modal-field">
              <label>Phone</label>
              <input value={editUser.phone} onChange={e => setEditUser({...editUser, phone: e.target.value})} />
            </div>
            <div className="modal-field">
              <label>Role</label>
              <input value={editUser.role} onChange={e => setEditUser({...editUser, role: e.target.value})} />
            </div>
            <div className="modal-field">
              <label>Status</label>
              <input value={editUser.status} onChange={e => setEditUser({...editUser, status: e.target.value})} />
            </div>
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