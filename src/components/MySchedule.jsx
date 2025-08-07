import { format } from "date-fns/format";

function MySchedule({ schedule = {} }) {
  if (!schedule?.start_date || !schedule?.end_date) return null;

  // Since your API stores times as UTC but they were originally local times,
  // we need to display them as local times without timezone conversion
  const startUTC = new Date(schedule.start_date);
  const endUTC = new Date(schedule.end_date);

  // Convert UTC time to local time by adding the timezone offset
  const timezoneOffset = startUTC.getTimezoneOffset() * 60000;
  const startLocal = new Date(startUTC.getTime() + timezoneOffset);
  const endLocal = new Date(endUTC.getTime() + timezoneOffset);

  return (
    <article
      style={{
        borderRadius: "8px",
        maxWidth: "500px",
        margin: "16px",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#ffffff",
        boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.18)",
      }}
    >
      <div style={{ display: "grid", gap: "0.5rem", marginBottom: "1rem" }}>
        <p>
          <strong>Start Date: </strong>
          {format(startLocal, "PPPp")}
        </p>
        <p>
          <strong>End Date: </strong>
          {format(endLocal, "PPPp")}
        </p>
      </div>

      <div style={{ width: "max-content", marginLeft: "auto" }}>
        <button
          style={{
            padding: ".6rem 1.6rem",
            backgroundColor: "#007bff",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
            marginRight: "0.5rem",
          }}
        >
          Update
        </button>
        <button
          style={{
            padding: ".6rem 1.6rem",
            backgroundColor: "#dc3545",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default MySchedule;
