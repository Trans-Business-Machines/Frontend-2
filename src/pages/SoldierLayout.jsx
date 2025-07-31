import "./SoldierLayout.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { AiOutlineDashboard } from "react-icons/ai";
import { LuMapPinCheckInside } from "react-icons/lu";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { LuFolderSearch } from "react-icons/lu";
import { HiOutlineLogout } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";
import Snackbar from "../components/Snackbar";
import { capitalize } from "../utils";

export default function SoldierLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // the menu array
  const menu = [
    {
      label: "Dashboard",
      icon: (
        <span role="img" aria-label="dashboard">
          <AiOutlineDashboard />
        </span>
      ),
      path: "/soldier",
    },
    {
      label: "Check In",
      icon: (
        <span role="img" aria-label="check-in">
          <LuMapPinCheckInside />
        </span>
      ),
      path: "/soldier/check-in",
    },
    {
      label: "Check Out",
      icon: (
        <span role="img" aria-label="check-out">
          <MdOutlineShoppingCartCheckout />
        </span>
      ),
      path: "/soldier/check-out",
    },
    {
      label: "Visitors Log",
      icon: (
        <span role="img" aria-label="visitors-log">
          <LuFolderSearch />
        </span>
      ),
      path: "/soldier/visitors-log",
    },
  ];

  const userRole = user?.role || "user";

  // sign out function
  const signOut = async () => {
    await logout();
    toast.custom(
      <Snackbar type="success" message="Logged out" icon={FaCheck} />
    );
    navigate("/");
  };

  return (
    <div className="soldier-root-layout">
      <aside className="soldier-sidebar">
        <div className="soldier-logo">
          <img src={logo} alt="VMS Logo" className="soldier-logo-img" />
        </div>
        <nav style={{ width: "100%" }}>
          {menu.map((item) => (
            <div
              key={item.label}
              className={`soldier-sidebar-link${
                location.pathname === item.path ? " active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <span className="soldier-sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <button className="soldier-logout-btn" onClick={signOut}>
          <span
            role="img"
            aria-label="logout"
            style={{ fontSize: 20, marginRight: 8 }}
          >
            <HiOutlineLogout />
          </span>
          Log Out
        </button>
      </aside>
      <main className="soldier-main-panel">
        <header className="soldier-header">
          <div className="soldier-header-title">
            {menu.find((item) => location.pathname === item.path)?.label ??
              menu.find((item) => location.pathname.startsWith(item.path))
                ?.label}
          </div>
          <div
            className="soldier-header-profile"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/soldier/profile")}
            title="View Profile"
          >
            <span
              role="img"
              aria-label="soldier"
              style={{ fontSize: 24, marginRight: 10 }}
            >
              <CgProfile />
            </span>
            {capitalize(userRole)}
          </div>
        </header>
        <div className="soldier-content-panel">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
