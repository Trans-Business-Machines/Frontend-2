import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import image from "/unauthorized.jpg";

function Unauthorized() {
  const { user } = useAuth();

  let redirectPath = "";

  if (!user) {
    redirectPath = "/";
  } else if (user.role === "soldier") {
    redirectPath = "/soldier";
  } else if (["host", "receptionist"].includes(user.role)) {
    redirectPath = "/host";
  } else if (["super admin", "admin"].includes(user.role)) {
    redirectPath = "/admin";
  }
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "white",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <img
          src={image}
          alt="Unauthorized illustration"
          width={200}
          className="unauthorized-image"
        />
        <h2
          style={{
            fontSize: "1.5rem",
            color: "#333",
          }}
        >
          You are not authorized to access this route
        </h2>
      </div>

      <div style={{ marginTop: "0.8rem" }}>
        <Link
          to={redirectPath}
          style={{
            textDecoration: "none",
            backgroundColor: "#1D528E",
            color: "#fff",
            padding: "0.85rem 1.2rem",
            borderRadius: "8px",
            fontWeight: "bold",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#163f6b")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#1D528E")}
        >
          Back to {!user ? "Login" : "Dashboard"}
        </Link>
      </div>
    </section>
  );
}

export default Unauthorized;
