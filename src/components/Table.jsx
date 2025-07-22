import format from "date-fns/format";

function Table({ visitors = [] }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        marginTop: "0.25rem",
        borderRadius: "0.5rem",
      }}
    >
      <thead
        style={{
          backgroundColor: "#285E61",
          color: "white",
          fontWeight: "bold",
          fontSize: "1.2rem",
          textAlign: "left",
        }}
      >
        <tr>
          <th style={{ paddingBlock: "0.625rem", paddingInline: "1.125rem" }}>
            Name
          </th>
          <th style={{ paddingBlock: "0.625rem", paddingInline: "1.125rem" }}>
            ID
          </th>
          <th style={{ paddingBlock: "0.625rem", paddingInline: "1.125rem" }}>
            Host
          </th>
          <th style={{ paddingBlock: "0.625rem", paddingInline: "1.125rem" }}>
            Time in
          </th>
          <th style={{ paddingBlock: "0.625rem", paddingInline: "1.125rem" }}>
            Time out
          </th>
          <th style={{ paddingBlock: "0.625rem", paddingInline: "1.125rem" }}>
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {visitors.map((v, i) => (
          <tr
            key={i}
            style={{
              fontSize: "1rem",
              color: "#333",
              borderBottom: i === visitors.length - 1 ? "none" : "1px solid #ddd",
            }}
          >
            {/* Visitor Name */}
            <td style={{ paddingBlock: "0.8rem", paddingInline: "0.625rem" }}>
              {v.firstname || ""} {v.lastname || ""}
            </td>

            {/* National ID */}
            <td style={{ paddingBlock: "0.8rem", paddingInline: "0.625rem" }}>
              {v.national_id || "N/A"}
            </td>

            {/* ✅ Host name with safe fallback */}
            <td style={{ paddingBlock: "0.8rem", paddingInline: "0.625rem" }}>
              {v.host ? `${v.host.firstname || ""} ${v.host.lastname || ""}` : "N/A"}
            </td>

            {/* Time In */}
            <td style={{ paddingBlock: "0.8rem", paddingInline: "0.625rem" }}>
              {v.time_in ? format(new Date(v.time_in), "hh:mm a") : "-"}
            </td>

            {/* Time Out */}
            <td style={{ paddingBlock: "0.8rem", paddingInline: "0.625rem" }}>
              {v.time_out ? format(new Date(v.time_out), "hh:mm a") : "-"}
            </td>

            {/* Status Badge */}
            <td style={{ paddingBlock: "0.8rem", paddingInline: "0.625rem" }}>
              <span
                style={{
                  display: "inline-block",
                  borderRadius: "0.25rem",
                  backgroundColor:
                    v.status === "checked-out" ? "#F44336" : "#4CAF50",
                  color: "white",
                  padding: "0.5rem 0.65rem",
                  textTransform: "capitalize",
                }}
              >
                {v.status || "unknown"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
