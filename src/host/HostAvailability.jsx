import "./HostAvailability.css";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { formatInTimeZone } from "date-fns-tz";
import axiosInstance from "../api/axiosInstance";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import MySchedule from "../components/MySchedule";
import toast from "react-hot-toast";
import Snackbar from "../components/Snackbar";

const postAvailability = async (url, { arg }) => {
  const { schedule } = arg;
  const res = await axiosInstance.post(url, schedule);
  return res.data;
};

const getAvailability = async (url) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

const deleteAvailability = async (url, { arg }) => {
  const { scheduleId } = arg;
  url = `${url}/${scheduleId}`;
  const res = await axiosInstance.delete(url);
  return res.data;
};

const updateAvailability = async (url, { arg }) => {
  const { scheduleId, schedule } = arg;
  url = `${url}/${scheduleId}`;
  const res = await axiosInstance.patch(url, schedule);
  return res.data;
};

export default function HostAvailability() {
  const { user } = useAuth();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Get available schedules
  const { data, mutate, isLoading } = useSWR(
    `/users/schedule/${user.userId}`,
    getAvailability
  );

  // Create a schedule
  const { trigger: createSchedule, isMutating } = useSWRMutation(
    `/users/schedule/${user.userId}`,
    postAvailability
  );

  // Delete a schedule
  const { trigger: deleteSchedule } = useSWRMutation(
    `/users/schedule/${user.userId}`,
    deleteAvailability
  );

  // Update a schedule
  const { trigger: updateSchedule } = useSWRMutation(
    `/users/schedule/${user.userId}`,
    updateAvailability
  );

  // Get the user's local time zone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Prefill form whenever it's opened
  useEffect(() => {
    if (!showForm) return;

    if (isEditing && selectedSchedule) {
      // Editing: prefill with the exact schedule the user clicked
      const startLocal = formatInTimeZone(
        selectedSchedule.start_date,
        timeZone,
        "yyyy-MM-dd'T'HH:mm"
      );
      const endLocal = formatInTimeZone(
        selectedSchedule.end_date,
        timeZone,
        "yyyy-MM-dd'T'HH:mm"
      );
      setStart(startLocal);
      setEnd(endLocal);
    } else {
      // Only auto fill the start time with the current time
      const nowLocal = formatInTimeZone(
        new Date(),
        timeZone,
        "yyyy-MM-dd'T'HH:mm"
      );
      setStart(nowLocal);
      setEnd("");
    }
  }, [showForm, isEditing, selectedSchedule, timeZone]);

  // Save handler (create or update depending on isEditing)
  const handleSave = async (e) => {
    e.preventDefault();

    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate < now) {
      return toast.custom(
        <Snackbar
          type="error"
          message="Start date cannot be in the past"
          icon={FaXmark}
        />
      );
    }

    if (startDate >= endDate) {
      return toast.custom(
        <Snackbar
          type="error"
          message="Start date must be before end date"
          icon={FaXmark}
        />
      );
    }

    const schedule = {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    };

    if (!isEditing) {
      try {
        await createSchedule({ schedule });

        toast.custom(
          <Snackbar
            type="success"
            message="Availability set successfully."
            icon={FaCheck}
          />
        );
      } catch (err) {
        const message = err.response.data?.message || "Availability not set!";
        return toast.custom(
          <Snackbar type="error" message={message} icon={FaXmark} />
        );
      }
    } else {
      if (!selectedSchedule?._id) {
        return toast.custom(
          <Snackbar
            type="error"
            message="No schedule selected for update."
            icon={FaXmark}
          />
        );
      } else {
        try {
          await updateSchedule({
            scheduleId: selectedSchedule._id,
            schedule,
          });

          toast.custom(
            <Snackbar
              type="success"
              message="Update successfully."
              icon={FaCheck}
            />
          );
        } catch (err) {
          const message = err.response.data?.message || "Update failed !";
          return toast.custom(
            <Snackbar type="error" message={message} icon={FaXmark} />
          );
        }
      }
    }

    // refresh list
    await mutate();

    // reset states
    setStart("");
    setEnd("");
    setShowForm(false);
    setIsEditing(false);
    setSelectedSchedule(null);
  };

  // Open / close helpers
  const openForm = (editing = false, schedule = null) => {
    setIsEditing(editing);
    setSelectedSchedule(schedule);
    setShowForm(true);
  };

  const closeForm = () => {
    setStart("");
    setEnd("");
    setIsEditing(false);
    setSelectedSchedule(null);
    setShowForm(false);
  };

  return (
    <section className="host-scrollable-content">
      <div className="host-availability-wrapper">
        {showForm ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5rem",
              background: "#E5E4E2",
              padding: "1rem",
              borderRadius: "6px",
              minHeight: "80vh",
              boxShadow: "4px 4px 0px 3px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              style={{
                alignSelf: "stretch",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "1.125rem",
              }}
            >
              <p
                style={{
                  color: "#1B4D3E",
                  fontSize: "1.3rem",
                  fontWeight: "500",
                }}
              >
                {isEditing
                  ? "Update your availability."
                  : "Let visitors know when you are available."}
              </p>
              <button className="availability-back-btn" onClick={closeForm}>
                Back
              </button>
            </div>

            <form className="host-availability-fields" onSubmit={handleSave}>
              <div className="host-availability-field">
                <div style={{ width: "30%" }}>
                  <p>Start Time</p>
                </div>
                <input
                  className="host-availability-input"
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  required
                  disabled={isMutating}
                />
              </div>
              <div className="host-availability-field">
                <div style={{ width: "30%" }}>
                  <p>End Time</p>
                </div>
                <input
                  className="host-availability-input"
                  type="datetime-local"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  required
                  disabled={isMutating}
                />
              </div>
              <button
                type="submit"
                className="host-availability-save-btn"
                disabled={isMutating}
              >
                {isMutating ? "Saving..." : isEditing ? "Update" : "Save"}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="schedule-btn-continaer">
              <button
                className="availability-back-btn"
                style={{ padding: ".8rem 3rem" }}
                onClick={() => openForm(false, null)}
              >
                Add Availability
              </button>
            </div>

            {!data?.schedules || data?.schedules.length === 0 ? (
              <div
                style={{
                  padding: "1.5rem",
                  width: "100%",
                  borderRadius: "8px",
                  fontSize: "1.5rem",
                  color: "#285E61",
                  fontWeight: "500",
                  marginTop: ".25rem",
                }}
              >
                <p style={{ textAlign: "center" }}>No availability set ...</p>
              </div>
            ) : (
              <section>
                <h3
                  style={{
                    color: "#1B4D3E",
                    fontSize: "1.3rem",
                    maxWidth: "55%",
                  }}
                >
                  View and manage your availability
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: ".6rem",
                    width: "100%",
                  }}
                >
                  {data.schedules.map((schedule) => (
                    <MySchedule
                      key={schedule._id}
                      schedule={schedule}
                      openForm={openForm}
                      deleteSchedule={() =>
                        deleteSchedule({ scheduleId: schedule._id }).then(
                          mutate
                        )
                      }
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
