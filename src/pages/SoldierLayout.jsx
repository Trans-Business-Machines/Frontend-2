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
      path: "/",
    },
    {
      label: "Check In",
      icon: (
        <span role="img" aria-label="check-in">
          <LuMapPinCheckInside />
        </span>
      ),
      path: "/check-in",
    },
    {
      label: "Check Out",
      icon: (
        <span role="img" aria-label="check-out">
          <MdOutlineShoppingCartCheckout />
        </span>
      ),
      path: "/check-out",
    },
    {
      label: "Visitors Log",
      icon: (
        <span role="img" aria-label="visitors-log">
          <LuFolderSearch />
        </span>
      ),
      path: "/visitors-log",
    },
  ];

  // Get user's actual name, fallback to "Soldier User"
  const soldierName =
    user?.name || user?.fullName || user?.displayName || "Soldier";

  return (
    <div className="soldier-root-layout">
      <aside className="soldier-sidebar">
        <div className="soldier-logo">
          <img src={logo} alt="VMS Logo" className="soldier-logo-img" />
        </div>
        <nav>
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
        <button
          className="soldier-logout-btn"
          onClick={async () => {
            await logout();
            toast.custom(
              <Snackbar type="success" message="Logged out" icon={FaCheck} />
            );
            navigate("/login");
          }}
        >
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
            onClick={() => navigate("/profile")}
            title="View Profile"
          >
            <span
              role="img"
              aria-label="soldier"
              style={{ fontSize: 24, marginRight: 10 }}
            >
              <CgProfile />
            </span>
            {soldierName}
          </div>
        </header>
        <div className="soldier-content-panel">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
