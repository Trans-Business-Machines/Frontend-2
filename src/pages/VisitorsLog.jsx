import "./VisitorsLog.css";
import { useState, useMemo } from "react";
import { format } from "date-fns/format";
import { capitalize } from "../utils";
import axiosInstance from "../api/axiosInstance";
import useSWR from "swr";

const getVisitLogs = async (url) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

function VisitorsLog() {
  const [page, setPage] = useState(1);
  const [textSearch, setTextSearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");

  const { data, isLoading } = useSWR(`/visits?page=${page}`, getVisitLogs);

  const filtered = useMemo(() => {
    const visitors = data?.visits;

    if (textSearch === "" && dateSearch === "") return visitors;

    const term = textSearch.trim().toLowerCase();

    const filteredVisitors = visitors.filter((v) => {
      let dateToSearch = 0;
      let visitDate = null;

      if (dateSearch) {
        dateToSearch = new Date(dateSearch).getTime();
        visitDate = new Date(v.visit_date).getTime();
      }

      return (
        v.firstname.toLowerCase().includes(term) ||
        v.lastname.toLowerCase().includes(term) ||
        v.purpose.toLowerCase().includes(term) ||
        v.phone.toLowerCase().includes(term) ||
        dateToSearch === visitDate
      );
    });

    return filteredVisitors;
  }, [data, textSearch, dateSearch]);

  // Function to move back and forth between pages
  const moveTo = (page) => {
    setPage(page);
  };

  return (
    <div>
      <div className="visitors-log-header">
        <h1 className="visitors-log-title">Visitors Log</h1>
      </div>

      <div className="visitors-log-search-row">
        <input
          type="text"
          placeholder="Search by Name, Phone, Purpose"
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

      {isLoading && !data ? (
        <section
          style={{
            width: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              color: "#246D5A",
              padding: "1.25rem",
              borderRadius: "8px",
              background: "#ffffff",
              fontSize: "1.5rem",
              fontWeight: "semi-bold",
            }}
          >
            <p>Loading visitor info...</p>
          </div>
        </section>
      ) : (
        <section>
          {filtered.length === 0 ? (
            <article
              style={{
                width: "100%",
              }}
            >
              <div
                style={{
                  width: "100%",
                  padding: "1.25rem",
                  borderRadius: "8px",
                  background: "#ffffff",
                  fontSize: "1.5rem",
                  fontWeight: "semi-bold",
                  color: "#246D5A",
                }}
              >
                <p>No visitors found.</p>
              </div>
            </article>
          ) : (
            <>
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
                  {filtered.map((v, index) => (
                    <tr key={index}>
                      <td>
                        {v.firstname} {v.lastname}
                      </td>
                      <td>{v.phone}</td>
                      <td>{capitalize(v.purpose)}</td>
                      <td>
                        {v.host.firstname} {v.host.lastname}
                      </td>
                      <td>{format(new Date(v.visit_date), "MM/dd/yyyy")}</td>
                      <td>{format(new Date(v.time_in), "hh:mm a")}</td>
                      <td>
                        {v.time_out
                          ? format(new Date(v.time_out), "hh:mm a")
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="visitors-log-pagination">
                <button
                  className="pagination-button"
                  onClick={() => moveTo(page - 1)}
                  disabled={!data?.hasPrev}
                >
                  Previous
                </button>
                <button className="active">{page}</button>
                <button
                  className="pagination-button"
                  onClick={() => moveTo(page + 1)}
                  disabled={!data?.hasNext}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default VisitorsLog;
