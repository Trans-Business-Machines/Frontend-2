import "./HostNotifications.css";
import { useState, useMemo } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axiosInstance from "../api/axiosInstance";
import AllNotifications from "../components/AllNotifications";
import UnreadNotifications from "../components/UnreadNotifications";

const getAllNotifications = async (url) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

const getUnreadNotifications = async (url) => {
  const res = await axiosInstance.get(url);
  return res.data;
};

const updateNotification = async (url, { arg }) => {
  const { notificationId, userId } = arg;

  url = url.replace(":id", notificationId);
  const body = { userId };
  const res = await axiosInstance.patch(url, body);
  return res.data;
};

export default function HostNotifications() {
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data: allnotifications } = useSWR(
    `/notifications/?type=${type}&page=${page}`,
    getAllNotifications
  );

  const { data: unreadnotifications } = useSWR(
    `/notifications/?type=${type}`,
    getUnreadNotifications
  );

  const { trigger: update } = useSWRMutation(
    "/notifications/:id",
    updateNotification
  );

  const filtered = useMemo(() => {
    let notifications = null;

    if (type === "all") {
      notifications = allnotifications?.result?.notifications;
    } else if (type === "unread") {
      notifications = unreadnotifications?.result?.notifications;
    }

    let term = search.toLowerCase();

    if (!term) {
      return notifications;
    }

    notifications = notifications.filter((n) => {
      if (
        n.message.toLowerCase().includes(term) ||
        n.message.toLowerCase().includes(term)
      ) {
        return n;
      }
    });

    return notifications;
  }, [unreadnotifications, search]);

  function nextPage() {
    setPage((page) => page + 1);
  }

  function prevPage() {
    setPage((page) => Math.max(page - 1, 1));
  }

  return (
    <div className="host-scrollable-content">
      <div className="host-notifications-wrapper">
        <div className="host-notifications-title">Your Notifications</div>
        <div className="host-notifications-filter-row">
          <input
            type="text"
            className="host-notifications-date-filter"
            placeholder="Search by purpose or name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="host-notifications-filter-btns">
            <button
              className={type === "all" ? "active" : ""}
              onClick={() => setType("all")}
            >
              All
            </button>
            <button
              className={type === "unread" ? "active" : ""}
              onClick={() => setType("unread")}
            >
              Unread
            </button>
          </div>
        </div>
        <div style={{ width: "80%" }}>
          {type === "all" ? (
            <AllNotifications
              notifications={filtered || []}
              hasNext={allnotifications?.result?.hasNext}
              hasPrev={allnotifications?.result?.hasPrev}
              next={nextPage}
              prev={prevPage}
            />
          ) : (
            <UnreadNotifications
              notifications={filtered || []}
              update={update}
            />
          )}
        </div>
      </div>
    </div>
  );
}
