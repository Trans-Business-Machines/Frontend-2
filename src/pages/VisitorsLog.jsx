import { useState, useEffect } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import { capitalize } from "../utils"
import format from "date-fns/format"
import axiosInstance from "../api/axiosInstance"
import "./VisitorsLog.css"

const ITEMS_PER_PAGE = 10

export default function VisitorsLog() {
  const [allVisits, setAllVisits] = useState([])
  const [filteredVisits, setFilteredVisits] = useState([])
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ host: "", purpose: "", visitDate: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVisits() {
      try {
        const res = await axiosInstance.get("/visits?limit=10000")
        const visits = Array.isArray(res.data.visits) ? res.data.visits : []
        setAllVisits(visits)
        setFilteredVisits(visits)
      } catch (err) {
        console.error("Error fetching visits:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchVisits()
  }, [])

  useEffect(() => {
    let results = Array.isArray(allVisits) ? [...allVisits] : []

    if (filters.host.trim()) {
      const searchHost = filters.host.toLowerCase()
      results = results.filter((v) => {
        const fullName = `${v.host?.firstname || ''} ${v.host?.lastname || ''}`.toLowerCase()
        return fullName.includes(searchHost)
      })
    }

    if (filters.purpose.trim()) {
      const searchPurpose = filters.purpose.toLowerCase()
      results = results.filter((v) => v.purpose?.toLowerCase().includes(searchPurpose))
    }

    if (filters.visitDate) {
      results = results.filter((v) => {
        const visitDate = new Date(v.visit_date)
        const formatted = `${visitDate.getFullYear()}-${String(
          visitDate.getMonth() + 1
        ).padStart(2, "0")}-${String(visitDate.getDate()).padStart(2, "0")}`
        return formatted === filters.visitDate
      })
    }

    setFilteredVisits(results)
    setPage((prev) => {
      const totalPages = Math.max(1, Math.ceil(results.length / ITEMS_PER_PAGE))
      return prev > totalPages ? totalPages : 1
    })
  }, [filters, allVisits])

  const totalPages = Math.max(1, Math.ceil(filteredVisits.length / ITEMS_PER_PAGE))
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const currentPageVisits = filteredVisits.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  useEffect(() => {
    console.log("Pagination state:", {
      page,
      totalPages,
      filteredVisitsLength: filteredVisits.length,
      currentPageVisitsLength: currentPageVisits.length,
      startIndex,
    })
  }, [page, filteredVisits.length, totalPages, currentPageVisits.length, startIndex])

  const nextPage = () => {
    console.log("Next button clicked, current page:", page, "totalPages:", totalPages)
    if (page < totalPages) {
      setPage(page + 1)
      console.log("Moving to page:", page + 1)
    } else {
      console.log("Cannot move to next page, already at last page")
    }
  }

  const prevPage = () => {
    console.log("Prev button clicked, current page:", page)
    if (page > 1) {
      setPage(page - 1)
      console.log("Moving to page:", page - 1)
    }
  }

  const goToPage = (num) => {
    console.log("Go to page:", num)
    if (num >= 1 && num <= totalPages) {
      setPage(num)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, page - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  if (loading) return <p>Loading visitor log...</p>

  return (
    <div className="main-content">
      <div className="visitorslog-header-center">
        <h2>Visitors Log</h2>
        <p>View and filter all visitor activity records</p>
      </div>

      <div className="visitorslog-filters-row">
        <input
          type="date"
          value={filters.visitDate}
          onChange={(e) => setFilters((prev) => ({ ...prev, visitDate: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Search Host"
          value={filters.host}
          onChange={(e) => setFilters((prev) => ({ ...prev, host: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Search Purpose"
          value={filters.purpose}
          onChange={(e) => setFilters((prev) => ({ ...prev, purpose: e.target.value }))}
        />
      </div>

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
            {currentPageVisits.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "#888" }}>
                  No records found.
                </td>
              </tr>
            ) : (
              currentPageVisits.map((v) => (
                <tr key={v._id}>
                  <td>{v.firstname} {v.lastname}</td>
                  <td>{v.national_id}</td>
                  <td>{v.host?.firstname} {v.host?.lastname}</td>
                  <td style={{ textTransform: "capitalize" }}>{capitalize(v.purpose)}</td>
                  <td>{format(new Date(v.time_in), "hh:mm a")}</td>
                  <td>{v.time_out ? format(new Date(v.time_out), "hh:mm a") : "-"}</td>
                  <td>{format(new Date(v.visit_date), "MMMM do, yyyy")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filteredVisits.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginTop: "20px",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button onClick={prevPage} disabled={page === 1}>
              <FaChevronLeft /> Prev
            </button>

            {getPageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => goToPage(num)}
                style={{
                  background: num === page ? "#219150" : "#fff",
                  color: num === page ? "#fff" : "#000",
                  border: "1px solid #ccc",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {num}
              </button>
            ))}

            <button onClick={nextPage} disabled={page >= totalPages}>
              Next <FaChevronRight />
            </button>

            <span style={{ marginLeft: "1rem", color: "#555" }}>
              Page {page} of {totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}