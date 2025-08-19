import { useState, useEffect } from "react";
import { AdminAuthContext } from "./AdminAuthContext";

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("adminToken") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("adminUser");
    if (token && savedUser) {
      setAdmin(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  // Login → saves user + token
  const login = (user, token) => {
    if (token) {
      localStorage.setItem("adminToken", token);
      setToken(token);
    }
    localStorage.setItem("adminUser", JSON.stringify(user));
    setAdmin(user);
  };

  // Logout → clears everything
  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
