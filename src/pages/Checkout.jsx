import "./Checkout.css";
import { useState } from "react";
import { format } from "date-fns/format";
import { toast } from "react-hot-toast";
import { FaCheck, FaXmark } from "react-icons/fa6";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axiosInstance from "../api/axiosInstance";
import Snackbar from "../components/Snackbar";

const checkOutVisitor = async (url, { arg }) => {
  const { visitId, body } = arg;
  url = url.replace(":visitId", visitId);

  const res = await axiosInstance.patch(url, body);
  return res.data;
};

export default function Checkout() {
  const [search, setSearch] = useState("");
  const [checkingOutID, setcheckingOutID] = useState(null);

  // Get the data for todays visitors who we can checkout
  const { data, isLoading, mutate } = useSWR("/visits/today", async (url) => {
    const res = await axiosInstance.get(url);
    return res.data;
  });

  // Mutation to check out a visitor
  const { trigger: checkOut } = useSWRMutation(
    "/visits/check-out/:visitId",
    checkOutVisitor
  );

  // Handle search term changes
  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  // Function to check out a user
  const handleCheckOut = async (id) => {
    setcheckingOutID(id);
    try {
      const result = await checkOut({
        visitId: id,
        body: { status: "checked-out" },
      });

      if (result.success) {
        toast.custom(
          <Snackbar
            icon={FaCheck}
            message="Checkout was successful"
            type="success"
          />
        );
        await mutate();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Check out failed";
      toast.custom(
        <Snackbar icon={FaXmark} message={errorMessage} type="error" />
      );
      console.error("Error: ", error);
    } finally {
      setcheckingOutID(null);
    }
  };

  // Filter the visitor info on every re-render
  const filtered = data?.visits?.filter((v) =>
    [v.firstname, v.lastname, v.national_id]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div>
        <p>Loading visitor info....</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Centered header section */}
      <div className="checkout-header-center">
        <h2>Check Out Visitor</h2>
        <p>Search a visitor to check them out of the premises.</p>
      </div>

      {filtered.length > 0 && (
        <form
          className="checkout-form"
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            className="checkout-search-input"
            placeholder="Search by Name or ID..."
            value={search}
            onChange={handleChange}
          />
        </form>
      )}

      <div className="checkout-records-section">
        {filtered.length === 0 ? (
          <div
            style={{
              backgroundColor: "#ffffffff",
              border: "1px dashed #ccc",
              padding: "2rem",
              borderRadius: "8px",
              textAlign: "center",
              marginTop: "2rem",
              color: "#555",
              fontSize: "1.1rem",
              fontStyle: "italic",
            }}
          >
            <p>No visitors have checked in today</p>
          </div>
        ) : (
          <table className="checkout-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID Number</th>
                <th>Host</th>
                <th>Time In</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((v, i) => (
                <tr key={i}>
                  <td>
                    {v.firstname} {v.lastname}
                  </td>
                  <td>{v.national_id}</td>
                  <td>
                    {v.host.firstname} {v.host.lastname}
                  </td>
                  <td>{format(new Date(v.time_in), "hh:mm a")}</td>
                  <td>
                    <button
                      className="checkout-btn-small"
                      disabled={
                        v.status === "checked-out" || checkingOutID === v._id
                      }
                      onClick={() => handleCheckOut(v._id)}
                    >
                      {checkingOutID === v._id
                        ? "checking out..."
                        : v.status === "checked-out"
                        ? "Checked Out"
                        : "Check Out"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
