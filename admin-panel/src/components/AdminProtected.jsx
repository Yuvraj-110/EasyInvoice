import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuthContext";

export default function AdminProtected({ children }) {
  const { admin, loading } = useContext(AdminAuthContext);

  if (loading) return <p className="text-center p-6">Loading...</p>;

  if (!admin) return <Navigate to="/admin/login" replace />;

  return children;
}
