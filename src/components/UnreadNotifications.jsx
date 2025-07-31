import Notification from "./Notification";
import { useAuth } from "../context/AuthContext";

function UnreadNotifications({ notifications, update }) {
  const { user } = useAuth();
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
            No Unread Notifications
          </h2>
          <p
            style={{
              color: "#555",
              fontSize: "1em",
              lineHeight: "1.5",
              fontFamily: "'Arial', sans-serif",
            }}
          >
            You have no unread notifications at this time.
          </p>
        </div>
      ) : (
        <div className="all-notifications-container">
          {notifications.map((notification, index) => {
            return (
              <Notification
                key={index}
                notification={notification}
                parent="unread"
                userId={user.userId}
                update={update}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

export default UnreadNotifications;
