import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";  // ✅ correct


export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
}
