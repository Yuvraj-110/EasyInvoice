// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initial load from local storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Login & store to local
  const loginUser = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    navigate("/welcome");
  };

  // Logout & clear local
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth");
  };

  // Refresh user from localStorage
  const reloadUser = () => {
    const userData = localStorage.getItem("user");
    setUser(userData ? JSON.parse(userData) : null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loginUser,
      logout,
      loading,
      reloadUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}
