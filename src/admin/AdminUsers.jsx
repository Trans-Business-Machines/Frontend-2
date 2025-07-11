"use client"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FaUserEdit } from "react-icons/fa"
import { AiFillDelete } from "react-icons/ai"
import "./AdminUsers.css"
import axiosInstance from "../api/axiosInstance"
import jsPDF from "jspdf"
import "jspdf-autotable"

const USERS_PER_PAGE = 9

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [editIdx, setEditIdx] = useState(null)
  const [editUser, setEditUser] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Fetch ALL users function
  const fetchAllUsers = async () => {
    try {
      setIsLoading(true)

      console.log("🔄 Fetching ALL users from backend...")

      // Strategy 1: Try to get all users with a high limit
      let allUsers = []
      const attempts = [
        // Try with very high limit to get all users at once
        { url: "/users", params: { limit: 10000 } },
        { url: "/users", params: { per_page: 10000 } },
        { url: "/users", params: { size: 10000 } },
        { url: "/users", params: { limit: 10000, page: 1 } },
        // Try without any parameters
        { url: "/users", params: {} },
      ]

      let success = false

      for (const attempt of attempts) {
        try {
          console.log(`🔄 Trying: ${attempt.url} with params:`, attempt.params)

          const response = await axiosInstance.get(attempt.url, { params: attempt.params })

          console.log("📊 Response received:", {
            status: response.status,
            dataType: typeof response.data,
            isArray: Array.isArray(response.data),
            keys: Object.keys(response.data || {}),
          })

          // Handle different response formats
          if (Array.isArray(response.data)) {
            allUsers = response.data
            console.log(`✅ Got ${allUsers.length} users directly as array`)
            success = true
            break
          } else if (response.data.users && Array.isArray(response.data.users)) {
            allUsers = response.data.users
            console.log(`✅ Got ${allUsers.length} users from 'users' property`)
            success = true
            break
          } else if (response.data.data && Array.isArray(response.data.data)) {
            allUsers = response.data.data
            console.log(`✅ Got ${allUsers.length} users from 'data' property`)
            success = true
            break
          }
        } catch (error) {
          console.log(`❌ Attempt failed:`, error.message)
          continue
        }
      }

      // Strategy 2: If single request didn't work, try pagination
      if (!success || allUsers.length <= 10) {
        console.log("🔄 Single request didn't get all users, trying pagination...")
        allUsers = await fetchUsersPaginated()
      }

      console.log(`✅ Final result: ${allUsers.length} users fetched`)
      setUsers(allUsers)

      // Adjust page if necessary
      const newTotalPages = Math.ceil(allUsers.length / USERS_PER_PAGE)
      if (page > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages)
      }
    } catch (error) {
      console.error("❌ Failed to fetch users:", error)
      // Don't clear existing users on error
      if (users.length === 0) {
        setUsers([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch users with pagination (fallback method)
  const fetchUsersPaginated = async () => {
    let allUsers = []
    let currentPage = 1
    let hasMore = true
    const maxPages = 100 // Safety limit

    console.log("🔄 Starting paginated fetch...")

    while (hasMore && currentPage <= maxPages) {
      try {
        console.log(`📄 Fetching page ${currentPage}...`)

        const response = await axiosInstance.get("/users", {
          params: {
            page: currentPage,
            limit: 100,
          },
        })

        let pageUsers = []
        let totalPages = 1

        if (Array.isArray(response.data)) {
          pageUsers = response.data
          // If we get less than 100, we're probably at the end
          hasMore = pageUsers.length === 100
        } else if (response.data.users && Array.isArray(response.data.users)) {
          pageUsers = response.data.users
          totalPages = response.data.totalPages || response.data.pages || 1
          hasMore = currentPage < totalPages || response.data.hasMore === true
        } else if (response.data.data && Array.isArray(response.data.data)) {
          pageUsers = response.data.data
          totalPages = response.data.totalPages || response.data.pages || 1
          hasMore = currentPage < totalPages || response.data.hasMore === true
        }

        if (pageUsers.length === 0) {
          console.log(`📄 Page ${currentPage}: No users found, stopping`)
          hasMore = false
          break
        }

        allUsers = [...allUsers, ...pageUsers]
        console.log(`📄 Page ${currentPage}: ${pageUsers.length} users (Total: ${allUsers.length})`)

        currentPage++
      } catch (error) {
        console.error(`❌ Error fetching page ${currentPage}:`, error)
        hasMore = false
      }
    }

    console.log(`✅ Paginated fetch complete: ${allUsers.length} users from ${currentPage - 1} pages`)
    return allUsers
  }

  // Initial load
  useEffect(() => {
    fetchAllUsers()
  }, [])

  // Refresh when returning from other pages
  useEffect(() => {
    if (location.state?.refreshUsers) {
      console.log("🔄 Refreshing users after navigation")
      fetchAllUsers()
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const filteredUsers = Array.isArray(users)
    ? users.filter((u) => {
        const searchTerm = search.toLowerCase()
        const fullName = `${u.firstname} ${u.lastname}`.toLowerCase()
        const userId = (u._id || "").toLowerCase()
        const email = (u.email || "").toLowerCase()
        const phone = (u.phone || "").toString()
        return (
          userId.includes(searchTerm) ||
          fullName.includes(searchTerm) ||
          email.includes(searchTerm) ||
          phone.includes(search)
        )
      })
    : []

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)
  const usersToDisplay = filteredUsers.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE)

  function handleEdit(user) {
    const userIndex = usersToDisplay.findIndex((u) => u._id === user._id)
    setEditIdx(userIndex)
    setEditUser({ ...user })
  }

  function cancelEdit() {
    setEditIdx(null)
    setEditUser(null)
  }

  async function saveEdit() {
    if (!editUser.firstname || !editUser.lastname || !editUser.email || !editUser.phone) {
      return
    }

    setIsSaving(true)
    try {
      const response = await axiosInstance.patch(`/users/${editUser._id}`, {
        firstname: editUser.firstname,
        lastname: editUser.lastname,
        email: editUser.email,
        phone: editUser.phone,
        role: editUser.role,
      })

      console.log("✅ Update response:", response.data)

      const updatedUsers = users.map((user) => (user._id === editUser._id ? { ...user, ...editUser } : user))
      setUsers(updatedUsers)

      setEditIdx(null)
      setEditUser(null)

      console.log("✅ User updated successfully")
    } catch (error) {
      console.error("❌ Failed to update user:", error)
      // Refresh all users after error to ensure consistency
      fetchAllUsers()
    } finally {
      setIsSaving(false)
    }
  }

  function confirmDelete(user) {
    setUserToDelete(user)
  }

  function cancelDelete() {
    setUserToDelete(null)
  }

  async function deleteUserConfirmed() {
    try {
      const response = await axiosInstance.delete(`/users/${userToDelete._id}`)
      console.log("✅ Delete response:", response.data)

      const updatedUsers = users.filter((u) => u._id !== userToDelete._id)
      setUsers(updatedUsers)
      setUserToDelete(null)

      // Adjust page if necessary
      const newFilteredUsers = updatedUsers.filter((u) => {
        const searchTerm = search.toLowerCase()
        const fullName = `${u.firstname} ${u.lastname}`.toLowerCase()
        const userId = (u._id || "").toLowerCase()
        const email = (u.email || "").toLowerCase()
        const phone = (u.phone || "").toString()
        return (
          userId.includes(searchTerm) ||
          fullName.includes(searchTerm) ||
          email.includes(searchTerm) ||
          phone.includes(search)
        )
      })

      const newTotalPages = Math.ceil(newFilteredUsers.length / USERS_PER_PAGE)
      if (page > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages)
      }

      console.log("✅ User deleted successfully")
    } catch (error) {
      console.error("❌ Failed to delete user:", error)
      // Refresh all users after error
      fetchAllUsers()
    }
  }

  function exportPDF() {
    const doc = new jsPDF()
    const tableColumn = ["User ID", "Name", "Email", "Phone", "Role"]
    const tableRows = users.map((user) => [
      user._id,
      `${user.firstname} ${user.lastname}`,
      user.email,
      user.phone,
      user.role,
    ])

    doc.text("System Users Report", 14, 15)
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    })
    doc.save("system_users.pdf")
  }

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleAddUser = () => {
    navigate("/admin/users/new", {
      state: {
        returnTo: "/admin/users",
        refreshUsers: true,
      },
    })
  }

  if (isLoading) {
    return (
      <div className="admin-users">
        <div className="admin-users-header">
          <div className="admin-users-title">Manage System Users</div>
        </div>
        <div style={{ textAlign: "center", padding: "50px", fontSize: "16px" }}>Loading all users...</div>
      </div>
    )
  }

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
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>

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
          {usersToDisplay.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                {filteredUsers.length === 0 ? "No users found." : "No users to display on this page."}
              </td>
            </tr>
          )}
          {usersToDisplay.map((user, idx) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>
                {editIdx === idx ? (
                  <div style={{ display: "flex", gap: "5px" }}>
                    <input
                      type="text"
                      value={editUser.firstname}
                      onChange={(e) => setEditUser({ ...editUser, firstname: e.target.value })}
                      style={{ width: "80px", padding: "4px", border: "1px solid #ccc", borderRadius: "3px" }}
                      placeholder="First Name"
                      disabled={isSaving}
                    />
                    <input
                      type="text"
                      value={editUser.lastname}
                      onChange={(e) => setEditUser({ ...editUser, lastname: e.target.value })}
                      style={{ width: "80px", padding: "4px", border: "1px solid #ccc", borderRadius: "3px" }}
                      placeholder="Last Name"
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
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    style={{ width: "150px", padding: "4px", border: "1px solid #ccc", borderRadius: "3px" }}
                    placeholder="Email"
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
                    onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                    style={{ width: "100px", padding: "4px", border: "1px solid #ccc", borderRadius: "3px" }}
                    placeholder="Phone"
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
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                    style={{ width: "100px", padding: "4px", border: "1px solid #ccc", borderRadius: "3px" }}
                    disabled={isSaving}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="host">Host</option>
                    <option value="soldier">Soldier</option>
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
                        backgroundColor: isSaving ? "#cccccc" : "#4CAF50",
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
                    <span className="action-icon" title="Edit" onClick={() => handleEdit(user)}>
                      <FaUserEdit color="green" />
                    </span>
                    <span className="action-icon" title="Delete" onClick={() => confirmDelete(user)}>
                      <AiFillDelete color="red" />
                    </span>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="admin-users-pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          style={{
            opacity: page === 1 ? 0.5 : 1,
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
        >
          {"<"}
        </button>

        <button className="active">{page}</button>

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          style={{
            opacity: page === totalPages || totalPages === 0 ? 0.5 : 1,
            cursor: page === totalPages || totalPages === 0 ? "not-allowed" : "pointer",
          }}
        >
          {">"}
        </button>
      </div>

      <div className="export-btn-container">
        <button className="export-btn" onClick={exportPDF}>
          Export Data
        </button>
      </div>

      {userToDelete && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <h3>Delete user?</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>
                {userToDelete.firstname} {userToDelete.lastname}
              </strong>
              ?
            </p>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="modal-cancel-btn">
                Cancel
              </button>
              <button onClick={deleteUserConfirmed} className="modal-save-btn" style={{ backgroundColor: "#F45B47" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
