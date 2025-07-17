"use client"
import "./VisitorsLog.css"
import { useState, useEffect } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import { capitalize } from "../utils" // Assuming this utility exists
import format from "date-fns/format"
import useSWR from "swr"
import axiosInstance from "../api/axiosInstance" // Assuming axiosInstance is correctly configured

const getVisitorsLog = async (url) => {
  const res = await axiosInstance.get(url)
  return res.data
}

export default function VisitorsLog() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    host: "",
    purpose: "",
    visitDate: "",
  })

  // Load ALL visits data once (no filters in the URL)
  const { data: allVisitsData, isLoading } = useSWR(`/visits?page=1&limit=1000`, getVisitorsLog)

  // State to hold filtered visits
  const [filteredVisits, setFilteredVisits] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const ITEMS_PER_PAGE = 10 // Adjust as needed

  // Apply filters on the frontend whenever filters or allVisitsData changes
  useEffect(() => {
    if (!allVisitsData?.visits) return

    // Apply all filters on the frontend
    let results = [...allVisitsData.visits]

    // Filter by host (case-insensitive partial match)
    if (filters.host) {
      const hostLower = filters.host.toLowerCase()
      results = results.filter((visit) => {
        const hostFullName = `${visit.host.firstname} ${visit.host.lastname}`.toLowerCase()
        return hostFullName.includes(hostLower)
      })
    }

    // Filter by purpose (case-insensitive partial match)
    if (filters.purpose) {
      const purposeLower = filters.purpose.toLowerCase()
      results = results.filter((visit) => visit.purpose.toLowerCase().includes(purposeLower))
    }

    // Filter by date (exact match)
    if (filters.visitDate) {
      const dateStr = filters.visitDate // Format: YYYY-MM-DD
      results = results.filter((visit) => {
        const visitDate = new Date(visit.visit_date)
        const formattedVisitDate = `${visitDate.getFullYear()}-${String(visitDate.getMonth() + 1).padStart(2, "0")}-${String(visitDate.getDate()).padStart(2, "0")}`
        return formattedVisitDate === dateStr
      })
    }

    // Calculate total pages
    setTotalPages(Math.ceil(results.length / ITEMS_PER_PAGE))

    // Paginate results
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    const paginatedResults = results.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    setFilteredVisits(paginatedResults)
  }, [allVisitsData, filters, page])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [filters])

  function nextPage() {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  function prevPage() {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1))
  }

  if (isLoading) {
    return (
      <div>
        <p>Loading visitor log info....</p>
      </div>
    )
  }

  return (
    <div className="main-content">
      {/* Centered Heading */}
      <div className="visitorslog-header-center">
        <div>
          <h2>Visitors Log</h2>
          <p>View and filter all visitor activity records</p>
        </div>
      </div>
      {/* Centered Filter Row */}
      <form className="visitorslog-filters-row">
        <input
          type="date"
          placeholder="yyyy-mm-dd"
          value={filters.visitDate}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              visitDate: e.target.value.trim(),
            }))
          }
        />
        <input
          type="text"
          placeholder="Host"
          value={filters.host}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              host: e.target.value.trim(),
            }))
          }
        />
        <input
          type="text"
          placeholder="Purpose"
          value={filters.purpose}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              purpose: e.target.value.trim(),
            }))
          }
        />
      </form>
      {/* Results Table */}
      <div className="visitorslog-table-section">
        <table className="visitorslog-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>ID Number</th>
              <th>Host</th>
              <th>Purpose</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisits.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "#888" }}>
                  No records found.
                </td>
              </tr>
            ) : (
              filteredVisits.map((v, i) => (
                <tr key={i} style={{ color: "#111" }}>
                  <td
                    style={{
                      paddingBlock: "1.25rem",
                      paddingInline: "0.625rem",
                    }}
                  >
                    {v.firstname} {v.lastname}
                  </td>
                  <td
                    style={{
                      paddingBlock: "1.25rem",
                      paddingInline: "0.625rem",
                    }}
                  >
                    {v.national_id}
                  </td>
                  <td
                    style={{
                      paddingBlock: "1.25rem",
                      paddingInline: "0.625rem",
                    }}
                  >
                    {v.host.firstname} {v.host.lastname}
                  </td>
                  <td
                    style={{
                      textTransform: "capitalize",
                      paddingBlock: "1.25rem",
                      paddingInline: "0.625rem",
                    }}
                  >
                    {capitalize(v.purpose)}
                  </td>
                  <td
                    style={{
                      paddingBlock: "1.25rem",
                      paddingInline: "0.625rem",
                    }}
                  >
                    {format(new Date(v.time_in), "hh:mm a")}
                  </td>
                  <td
                    style={{
                      paddingBlock: "1.25rem",
                      paddingInline: "0.625rem",
                    }}
                  >
                    {v.time_out ? format(new Date(v.time_out), "hh:mm a") : "-"}
                  </td>
                  <td
                    style={{
                      paddingBlock: "1.25rem",
                      paddingInline: "0.625rem",
                    }}
                  >
                    {format(new Date(v.visit_date), "MMMM do, yyyy")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "20px",
            marginLeft: "auto",
            justifyContent: "right",
            alignItems: "center",
            width: "40%",
            maxWidth: "400px",
          }}
        >
          <button className="pagination-button" onClick={prevPage} disabled={page === 1}>
            <FaChevronLeft size={14} />
          </button>
          <button className="current-page-btn">{page}</button>
          <button className="pagination-button" onClick={nextPage} disabled={page === totalPages}>
            <FaChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
