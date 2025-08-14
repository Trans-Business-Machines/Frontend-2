import format from "date-fns/format";
import { mutate } from "swr";

function Notification({ notification, parent, userId, update }) {
  async function markAsRead() {
    await update({
      notificationId: notification._id,
      userId,
    });

    mutate("/notifications/?type=unread");
  }

  return (
    <article
      style={{
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "#FFFFFF",
        width: "100%",
      }}
    >
      {parent === "unread" && (
        <h2
          style={{
            color: "black",
            fontSize: "1.25rem",
            marginBottom: "8px",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {notification?.title}
        </h2>
      )}
      <p
        style={{
          color: "#555",
          fontSize: "1em",
          lineHeight: "1.5",
          marginBottom: "16px",
          fontFamily: "'Arial', sans-serif",
          wordWrap: "break-word",
        }}
      >
        {notification?.message}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {parent === "unread" && (
          <button className="mark-as-read-btn" onClick={markAsRead}>
            Marks as Read
          </button>
        )}
        <p
          style={{
            color: "#888",
            fontSize: "0.875em",
            margin: 0,
            fontStyle: "italic",
            textAlign: "right",
            flexShrink: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {format(new Date(notification.createdAt), "PPPp")}
        </p>
      </div>
    </article>
  );
}

export default Notification;
