import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Checkin from "./pages/Checkin";
import Checkout from "./pages/Checkout";
import VisitorsLog from "./pages/VisitorsLog";
import ChangePassword from "./pages/ChangePassword";
import { useAuth } from "./context/AuthContext";
import HostDashboard from "./host/HostDashboard";
import HostNotifications from "./host/HostNotifications";
import HostAvailability from "./host/HostAvailability";
import HostHistory from "./host/HostHistory";
import HostProfile from "./host/HostProfile";
import HostLayout from "./host/HostLayout";

// Admin imports
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminAddUser from "./admin/AdminAddUser";
import AdminVisitorLog from "./admin/AdminVisitorLog";
import AdminProfile from "./admin/AdminProfile";

// Soldier Layout import
import SoldierLayout from "./pages/SoldierLayout";

// Unauthorized Component inmport
import Unauthorized from "./pages/Unauthorized";

function PrivateRoute({ children, allowedRoles = [] }) {
  const { user } = useAuth();

  // if there is no user go back to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Protection Routes based on user role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Otherwise return the children
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* The Login page is the home page */}
      <Route path="/" element={<Login />} />

      {/* Set up the unauthorized page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Soldier Routes */}
      <Route
        path="/soldier"
        element={
          <PrivateRoute allowedRoles={["soldier"]}>
            <SoldierLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/change-password" element={<ChangePassword />} />
        <Route path="check-in" element={<Checkin />} />
        <Route path="check-out" element={<Checkout />} />
        <Route path="visitors-log" element={<VisitorsLog />} />
      </Route>

      {/* Host routes */}
      <Route
        path="/host"
        element={
          <PrivateRoute allowedRoles={["host", "receptionist"]}>
            <HostLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<HostDashboard />} />
        <Route path="notifications" element={<HostNotifications />} />
        <Route path="availability" element={<HostAvailability />} />
        <Route path="history" element={<HostHistory />} />
        <Route path="profile" element={<HostProfile />} />
        <Route path="profile/change-password" element={<ChangePassword />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["super admin", "admin"]}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index  element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/new" element={<AdminAddUser />} />
        <Route path="visitor-log" element={<AdminVisitorLog />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="profile/change-password" element={<ChangePassword />} />
      </Route>

      {/* Redirect any unknown path to the default landing (/) */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
