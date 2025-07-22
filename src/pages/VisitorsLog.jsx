"use client"

import { useState, useEffect, useCallback } from "react"
import "./VisitorsLog.css"
import axiosInstance from "../api/axiosInstance" // Assuming axiosInstance is available here

const RECORDS_PER_PAGE = 10 // This will be the 'limit' parameter for your API

// Helper function to format ISO date string to "YYYY-MM-DD"
const formatDate = (isoString) => {
  if (!isoString) return "N/A"
  try {
    const date = new Date(isoString)
    return date.toISOString().split("T")[0] // Extracts "YYYY-MM-DD"
  } catch (e) {
    console.error("Error formatting date:", e)
    return "Invalid Date"
  }
}

// Helper function to format ISO time string to "HH:MM AM/PM"
const formatTime = (isoString) => {
  if (!isoString) return "N/A"
  try {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
  } catch (e) {
    console.error("Error formatting time:", e)
    return "Invalid Time"
  }
}

export default function VisitorsLog() {
  const [visits, setVisits] = useState([])
  const [textSearch, setTextSearch] = useState("")
  const [dateSearch, setDateSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPrevPage, setHasPrevPage] = useState(false)

  const fetchVisits = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params = {
        page: currentPage,
        limit: RECORDS_PER_PAGE,
      }

      // Add search parameters if they exist
      if (textSearch) {
        // Assuming your backend can search across multiple fields with a single 'search' param
        params.search = textSearch
      }
      if (dateSearch) {
        // Assuming your backend filters by 'visit_date' using a 'date' param
        params.date = dateSearch
      }

      console.log("Fetching visits with params:", params)
      const response = await axiosInstance.get("/visits", { params })

      const { visits: fetchedVisits, hasNext, hasPrev } = response.data

      // Map the fetched data to match your table's expected structure
      const mappedVisits = fetchedVisits.map((visit) => ({
        name: `${visit.firstname || ""} ${visit.lastname || ""}`.trim(),
        phone: visit.phone || "N/A",
        purpose: visit.purpose || "N/A",
        host: `${visit.host?.firstname || ""} ${visit.host?.lastname || ""}`.trim(),
        dateIn: formatDate(visit.visit_date), // Use visit_date for Date In
        timeIn: formatTime(visit.time_in), // Use time_in for Time In
        timeOut: visit.time_out ? formatTime(visit.time_out) : "-", // Changed from "N/A" to "-"
      }))

      setVisits(mappedVisits)
      setHasNextPage(hasNext)
      setHasPrevPage(hasPrev)
    } catch (err) {
      console.error("Failed to fetch visits:", err)
      setError("Failed to load visitor records. Please try again.")
      setVisits([]) // Clear visits on error
      setHasNextPage(false)
      setHasPrevPage(false)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, textSearch, dateSearch])

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchVisits()
  }, [fetchVisits])

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  // Reset page to 1 when search terms change
  useEffect(() => {
    setCurrentPage(1)
  }, [textSearch, dateSearch])

  if (isLoading) {
    return (
      <div className="visitors-log-container">
        <div className="visitors-log-header">
          <h1 className="visitors-log-title">Visitors Log</h1>
        </div>
        <div style={{ textAlign: "center", padding: "50px", fontSize: "16px", color: "#555" }}>
          Loading visitor records...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="visitors-log-container">
        <div className="visitors-log-header">
          <h1 className="visitors-log-title">Visitors Log</h1>
        </div>
        <div style={{ textAlign: "center", padding: "50px", fontSize: "16px", color: "red" }}>{error}</div>
      </div>
    )
  }

  return (
    <div className="visitors-log-container">
      <div className="visitors-log-header">
        <h1 className="visitors-log-title">Visitors Log</h1>
      </div>

      <div className="visitors-log-search-row">
        <input
          type="text"
          placeholder="Search by Name, Phone, Purpose, Host"
          value={textSearch}
          onChange={(e) => setTextSearch(e.target.value)}
        />
        <input
          type="date"
          placeholder="Search by Date"
          value={dateSearch}
          onChange={(e) => setDateSearch(e.target.value)}
        />
      </div>

      <table className="visitors-log-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Purpose</th>
            <th>Host</th>
            <th>Date In</th>
            <th>Time In</th>
            <th>Time Out</th>
          </tr>
        </thead>
        <tbody>
          {visits.length === 0 ? (
            <tr>
              <td colSpan={7} className="no-records-message">
                No records found.
              </td>
            </tr>
          ) : (
            visits.map((visitor, index) => (
              <tr key={index}>
                <td>{visitor.name}</td>
                <td>{visitor.phone}</td>
                <td>{visitor.purpose}</td>
                <td>{visitor.host}</td>
                <td>{visitor.dateIn}</td>
                <td>{visitor.timeIn}</td>
                <td>{visitor.timeOut}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="visitors-log-pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={!hasPrevPage}>
          Previous
        </button>
        <button className="active">{currentPage}</button>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNextPage}>
          Next
        </button>
      </div>
    </div>
  )
}
