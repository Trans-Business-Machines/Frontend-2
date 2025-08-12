import { formatInTimeZone } from "date-fns-tz";
import { FaRegEdit, FaTrash } from "react-icons/fa";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import Snackbar from "./Snackbar";

function MySchedule({ schedule = {}, openForm, deleteSchedule }) {
  if (!schedule?.start_date || !schedule?.end_date) return null;

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const startLocal = formatInTimeZone(schedule.start_date, timeZone, "PPPp");
  const endLocal = formatInTimeZone(schedule.end_date, timeZone, "PPPp");

  const handleDelete = async () => {
    try {
      await deleteSchedule(); // parent wired deleteSchedule to call trigger + mutate
      toast.custom(
        <Snackbar type="success" icon={FaCheck} message="Delete successful." />
      );
    } catch (error) {
      toast.custom(
        <Snackbar type="error" icon={FaXmark} message="Delete failed!" />
      );
    }
  };

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
          <strong>Start Time: </strong>
          {startLocal}
        </p>
        <p>
          <strong>End Time: </strong>
          {endLocal}
        </p>
      </div>
      <div
        style={{ display: "flex", justifyContent: "flex-end", gap: ".5rem" }}
      >
        <button
          className="schedule-btn"
          style={{
            border: "none",
            padding: ".6rem 2rem",
            borderRadius: "8px",
            background: "#EC5800",
          }}
          onClick={() => openForm(true, schedule)} // <-- pass schedule up
        >
          <FaRegEdit color="#fff" />
        </button>
        <button
          className="schedule-btn"
          style={{
            border: "none",
            padding: ".6rem 2rem",
            borderRadius: "8px",
            background: "#ED1B24",
          }}
          onClick={handleDelete}
        >
          <FaTrash color="#fff" />
        </button>
      </div>
    </article>
  );
}

export default MySchedule;
