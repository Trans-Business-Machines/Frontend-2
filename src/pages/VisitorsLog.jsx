import "./VisitorsLog.css";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { capitalize } from "../utils";
import format from "date-fns/format";
import useSWR from "swr";
import axiosInstance from "../api/axiosInstance";

const getVisitorsLog = async (url) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

export default function VisitorsLog() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    host: "",
    purpose: "",
    visitDate: "",
  });

  const [debouncedFilters] = useDebounce(filters, 1000);

  const getURL = () => {
    const params = new URLSearchParams();

    if (page) params.append("page", page);
    if (debouncedFilters.host !== "all")
      params.append("host", debouncedFilters.host);
    if (debouncedFilters.purpose)
      params.append("purpose", debouncedFilters.purpose);
    if (debouncedFilters.visitDate)
      params.append("date", debouncedFilters.visitDate);

    return `/visits?${params.toString()}`;
  };

  const { data, isLoading } = useSWR(getURL(), getVisitorsLog);

  function nextPage() {
    setPage((prevPage) => prevPage + 1);
  }

  function prevPage() {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  }

  if (isLoading) {
    return (
      <div>
        <p>Loading visitor log info....</p>
      </div>
    );
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
            {data?.visits?.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "#888" }}>
                  No records found.
                </td>
              </tr>
            ) : (
              data?.visits?.map((v, i) => (
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
          <button
            className="pagination-button"
            onClick={prevPage}
            disabled={!data?.hasPrev}
          >
            <FaChevronLeft size={14} />
          </button>
          <button className="current-page-btn">{page}</button>
          <button
            className="pagination-button"
            onClick={nextPage}
            disabled={!data?.hasNext}
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
