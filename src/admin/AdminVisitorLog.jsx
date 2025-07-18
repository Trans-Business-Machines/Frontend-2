"use client"

import { useState } from "react"
import "./AdminUsers.css" // reuse styles for table, search, pagination
import useSWR from "swr"
import axiosInstance from "../api/axiosInstance"

const VISITORS_PER_PAGE = 10

function formatDateForTable(dateStr) {
  if (!dateStr) return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-")
    return `${d}-${m}-${y}`
  }
  return dateStr
}

function formatTime(timeStr) {
  if (!timeStr) return ""
  // Handle different time formats that might come from backend
  if (timeStr.includes("T")) {
    // ISO format: extract time part
    return new Date(timeStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }
  return timeStr
}

export default function AdminVisitorLog() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [page, setPage] = useState(1)

  // Fetch visitors with pagination from backend
  const fetchVisitors = async (url) => {
    try {
      const res = await axiosInstance.get(url)
      console.log("Visitors API response:", res.data)
      return res.data
    } catch (error) {
      console.error("Failed to fetch visitors:", error)
      throw error
    }
  }

  // Use SWR with pagination
  const { data, error, isLoading, mutate } = useSWR(`/visits?page=${page}&limit=${VISITORS_PER_PAGE}`, fetchVisitors)

  // Handle different response formats from backend
  let visitors = []
  let totalPages = 1

  if (data) {
    if (Array.isArray(data)) {
      visitors = data
      totalPages = Math.ceil(visitors.length / VISITORS_PER_PAGE)
    } else if (data.visits && Array.isArray(data.visits)) {
      visitors = data.visits
      totalPages = data.totalPages || Math.ceil((data.total || visitors.length) / VISITORS_PER_PAGE)
    } else if (data.data && Array.isArray(data.data)) {
      visitors = data.data
      totalPages = data.totalPages || Math.ceil((data.total || visitors.length) / VISITORS_PER_PAGE)
    }
  }

  // Client-side filtering for search and status (since backend pagination might not include all data)
  const filteredVisitors = visitors.filter((v) => {
    const searchTerm = search.toLowerCase()
    const searchMatch =
      !search ||
      (v.name || "").toLowerCase().includes(searchTerm) ||
      (v.phone || "").toString().includes(search) ||
      (v.idNumber || "").toString().includes(search) ||
      (v.host || "").toLowerCase().includes(searchTerm) ||
      (v.purpose || "").toLowerCase().includes(searchTerm)

    const statusMatch = filterStatus === "" || v.status === filterStatus
    const dateMatch = !filterDate || v.date === filterDate

    return searchMatch && statusMatch && dateMatch
  })

  function handleSearchChange(e) {
    setSearch(e.target.value)
  }

  function handleFilterStatus(e) {
    setFilterStatus(e.target.value)
  }

  function handleFilterDate(e) {
    setFilterDate(e.target.value)
  }

  function handlePageChange(newPage) {
    setPage(newPage)
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
          <option value="Checked In">Checked In</option>
          <option value="Checked Out">Checked Out</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={handleFilterDate}
          style={{ minWidth: 140, padding: "11px 16px", borderRadius: 20 }}
        />
      </div>

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
                {isLoading ? "Loading..." : "No visitors found."}
              </td>
            </tr>
          )}
          {filteredVisitors.map((visitor) => (
            <tr key={visitor._id || visitor.id}>
              <td>{visitor.name || ""}</td>
              <td>{visitor.idNumber || ""}</td>
              <td>{visitor.phone || ""}</td>
              <td>{visitor.host || ""}</td>
              <td>{formatDateForTable(visitor.date)}</td>
              <td>{formatTime(visitor.timeIn || visitor.checkInTime)}</td>
              <td>{formatTime(visitor.timeOut || visitor.checkOutTime) || "-"}</td>
              <td>
                <span
                  className={visitor.status === "Checked In" ? "status-active" : "status-inactive"}
                  style={{ whiteSpace: "nowrap", display: "inline-block" }}
                >
                  {visitor.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="admin-users-pagination">
        <button onClick={() => handlePageChange(Math.max(1, page - 1))} disabled={page === 1}>
          {"<"}
        </button>

        {[...Array(Math.min(5, totalPages))].map((_, idx) => {
          const pageNum = Math.max(1, Math.min(totalPages, page - 2 + idx))
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={page === pageNum ? "active" : ""}
            >
              {pageNum}
            </button>
          )
        })}

        <button onClick={() => handlePageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
          {">"}
        </button>
      </div>
    </div>
  )
}
