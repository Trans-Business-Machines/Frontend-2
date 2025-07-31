import Notification from "./Notification";

function AllNotifications({ notifications, hasNext, hasPrev, next, prev }) {
  return (
    <section>
      {notifications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2
            style={{
              color: "#333",
              fontSize: "1.5em",
              marginBottom: "10px",
              fontFamily: "'Arial', sans-serif",
            }}
          >
            No Notifications
          </h2>
          <p
            style={{
              color: "#555",
              fontSize: "1em",
              lineHeight: "1.5",
              fontFamily: "'Arial', sans-serif",
            }}
          >
            You have no notifications at this time.
          </p>
        </div>
      ) : (
        <section>
          <div className="all-notifications-container">
            {notifications.map((notification, index) => (
              <Notification
                key={index}
                parent="all"
                notification={notification}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <button
              onClick={prev}
              disabled={!hasPrev}
              className="pagination-button"
            >
              Previous
            </button>
            <button
              onClick={next}
              disabled={!hasNext}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </section>
      )}
    </section>
  );
}

export default AllNotifications;
