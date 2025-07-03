import React from "react";
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
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminAddUser from "./admin/AdminAddUser";
import AdminVisitorLog from "./admin/AdminVisitorLog";
import AdminProfile from "./admin/AdminProfile";
import SoldierLayout from "./pages/SoldierLayout";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
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
      <Route
        path="/host"
        element={
          <PrivateRoute>
            <HostLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<HostDashboard />} />
        <Route path="notifications" element={<HostNotifications />} />
        <Route path="availability" element={<HostAvailability />} />
        <Route path="history" element={<HostHistory />} />
        <Route path="profile" element={<HostProfile />} />
        <Route path="profile/change-password" element={<ChangePassword />} />
      </Route>
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/new" element={<AdminAddUser />} />
        <Route path="visitor-log" element={<AdminVisitorLog />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="profile/change-password" element={<ChangePassword />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}