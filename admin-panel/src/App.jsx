import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AdminAuthContext } from "./context/AdminAuthContext";
import { AdminAuthProvider } from "./context/AdminAuthProvider";

import AdminProtected from "./components/AdminProtected";

import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import Invoices from "./pages/Invoices";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import AdminTickets from "./pages/AdminTickets";

import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";

function AppRoutes() {
  const { admin } = useContext(AdminAuthContext);

  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Admin Auth Routes */}
      <Route
        path="/admin/login"
        element={admin ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />}
      />
      <Route
        path="/admin/register"
        element={admin ? <Navigate to="/admin/dashboard" replace /> : <AdminRegister />}
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminProtected>
            <AdminLayout />
          </AdminProtected>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="messages" element={<Messages />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
        <Route path="tickets" element={<AdminTickets />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <AppRoutes />
    </AdminAuthProvider>
  );
}
