import "./AdminLayout.css"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import logo from "../assets/logo.png"
import { AiOutlineDashboard } from "react-icons/ai"
import { FaUserCog } from "react-icons/fa"
import { LuFolderSearch } from "react-icons/lu"
import { HiOutlineLogout } from "react-icons/hi"
import { CgProfile } from "react-icons/cg"

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth() // Get user data from auth context

  const menu = [
    { label: "Dashboard", icon: <AiOutlineDashboard />, path: "/admin/dashboard" },
    { label: "User Management", icon: <FaUserCog />, path: "/admin/users" },
    { label: "Visitor Log", icon: <LuFolderSearch />, path: "/admin/visitor-log" },
  ]

  // Get user role with fallback
  const getUserRole = () => {
    if (!user) return "Loading..."

    // Handle different possible user object structures
    const role = user.role || "User"

    // Capitalize first letter of role
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
  }

  return (
    <div className="admin-root-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src={logo || "/placeholder.svg"} alt="VMS Logo" className="admin-logo-img" />
        </div>
        <nav>
          {menu.map((item) => (
            <div
              key={item.label}
              className={`admin-sidebar-link ${location.pathname.startsWith(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="admin-sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <button
          className="admin-logout-btn"
          onClick={() => {
            logout()
            navigate("/login")
          }}
        >
          <span style={{ fontSize: 20, marginRight: 8 }}>
            <HiOutlineLogout />
          </span>
          Log Out
        </button>
      </aside>
      <main className="admin-main-panel">
        <header className="admin-header">
          <div></div>
          <div className="admin-header-title">
            {menu.find((item) => location.pathname.startsWith(item.path))?.label}
          </div>
          <div
            className="admin-header-profile"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/profile")}
            title="View Profile"
          >
            <span role="img" aria-label="admin" style={{ fontSize: 24, marginRight: 10 }}>
              <CgProfile />
            </span>
            {getUserRole()}
          </div>
        </header>
        <div className="admin-content-panel">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
