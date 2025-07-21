"use client"

import { useState } from "react"
import useSWR from "swr"
import axiosInstance from "../api/axiosInstance" // Assuming axiosInstance is correctly configured
import "./AdminUsers.css" // Import the CSS file

const VISITORS_PER_PAGE = 10

function formatDateForTable(dateStr) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-GB") // dd/mm/yyyy
}

function formatTime(timeStr) {
  if (!timeStr) return ""
  const date = new Date(timeStr)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export default function AdminVisitorLog() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [page, setPage] = useState(1)

  // Fetch visitors directly from backend
  const fetchVisitors = async (url) => {
    const res = await axiosInstance.get(url)
    return res.data
  }

  const { data, error, isLoading } = useSWR(`/visits?page=${page}&limit=${VISITORS_PER_PAGE}`, fetchVisitors)

  // Default values
  let visitors = []
  let totalPages = 1
  let currentPage = page
  if (data) {
    visitors = data.visits || []
    totalPages = data.totalPages || 1
    currentPage = data.currentPage || page
  }

  // Filter visitors for current page
  const filteredVisitors = visitors.filter((v) => {
    const searchTerm = search.toLowerCase()
    const fullName = `${v.firstname || ""} ${v.lastname || ""}`.trim()
    const hostName =
      v.host && typeof v.host === "object" ? `${v.host.firstname || ""} ${v.host.lastname || ""}`.trim() : v.host || ""

    const searchMatch =
      !search ||
      fullName.toLowerCase().includes(searchTerm) ||
      (v.phone || "").toLowerCase().includes(searchTerm) ||
      (v.national_id || "").toLowerCase().includes(searchTerm) ||
      hostName.toLowerCase().includes(searchTerm) ||
      (v.purpose || "").toLowerCase().includes(searchTerm)

    const statusMatch = !filterStatus || v.status.toLowerCase() === filterStatus.toLowerCase()

    const dateMatch = !filterDate || new Date(v.visit_date).toISOString().split("T")[0] === filterDate

    return searchMatch && statusMatch && dateMatch
  })

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
    // Removed mutate() here as filtering is currently client-side
  }
  const handleFilterStatus = (e) => {
    setFilterStatus(e.target.value)
    setPage(1)
    // Removed mutate() here as filtering is currently client-side
  }
  const handleFilterDate = (e) => {
    setFilterDate(e.target.value)
    setPage(1)
    // Removed mutate() here as filtering is currently client-side
  }

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  // Export PDF function with token handling
  const handleExportData = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("You are not logged in. Please login to export reports.")
        return
      }

      const response = await fetch("http://localhost:3000/api/report", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Failed to export visitors data. Server response:", response.status, errorText)

        let errorMessage = "Failed to export visitors data."
        if (response.status === 401) {
          errorMessage = "Authentication failed. Please log in again."
        } else if (response.status === 403) {
          errorMessage = "Forbidden: You do not have permission to generate this report."
        } else if (response.status >= 500) {
          errorMessage = "Server error. Please try again later."
        } else if (errorText) {
          errorMessage += ` Details: ${errorText.substring(0, 100)}...`
        }
        throw new Error(errorMessage)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "monthly-visitor-report.pdf"
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      // alert("Monthly visitor report downloaded successfully!")
    } catch (error) {
      console.error("Export error:", error)
      alert(`Export failed: ${error.message || "Please check console for details."}`)
    }
  }

  if (isLoading) {
    return (
      <div className="admin-users">
        <div className="admin-users-header">
          <div className="admin-users-title">Visitor Log</div>
        </div>
        <div style={{ textAlign: "center", padding: "20px" }}>Loading visitors...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-users">
        <div className="admin-users-header">
          <div className="admin-users-title">Visitor Log</div>
        </div>
        <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
          Error loading visitors: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <div className="admin-users-title">Visitor Log</div>
      </div>
      {/* Search and filters */}
      <div className="admin-users-search" style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 10 }}>
        <input
          placeholder="Search by name, phone, ID number, host, or purpose"
          value={search}
          onChange={handleSearchChange}
          style={{ flex: 1, minWidth: 300 }}
        />
        <select
          value={filterStatus}
          onChange={handleFilterStatus}
          style={{ minWidth: 120, padding: "11px 16px", borderRadius: 20 }}
        >
          <option value="">All Statuses</option>
          <option value="checked-in">Checked In</option>
          <option value="checked-out">Checked Out</option>
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={handleFilterDate}
          style={{ minWidth: 140, padding: "11px 16px", borderRadius: 20 }}
        />
      </div>
      {/* Table */}
      <table className="admin-users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID Number</th>
            <th>Phone</th>
            <th>Host</th>
            <th>Date</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredVisitors.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
                No visitors found.
              </td>
            </tr>
          )}
          {filteredVisitors.map((v) => {
            const fullName = `${v.firstname || ""} ${v.lastname || ""}`.trim()
            const hostName =
              v.host && typeof v.host === "object"
                ? `${v.host.firstname || ""} ${v.host.lastname || ""}`.trim()
                : v.host || ""
            return (
              <tr key={v._id}>
                <td>{fullName}</td>
                <td>{v.national_id || ""}</td>
                <td>{v.phone || ""}</td>
                <td>{hostName}</td>
                <td>{formatDateForTable(v.visit_date)}</td>
                <td>{formatTime(v.time_in)}</td>
                <td>{formatTime(v.time_out) || "-"}</td>
                <td>
                  <span
                    className={v.status === "checked-in" ? "status-active" : "status-inactive"}
                    style={{ whiteSpace: "nowrap", display: "inline-block" }}
                  >
                    {v.status}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="admin-users-pagination">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          {"<"}
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          {">"}
        </button>
      </div>
      {/* Export button */}
      <div className="export-btn-container">
        <button className="export-btn" onClick={handleExportData}>
          Export Data
        </button>
      </div>
    </div>
  )
}
