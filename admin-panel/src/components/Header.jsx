import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuthContext";

export default function Header() {
  const { logout } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear token + user
    navigate("/admin/login"); // redirect
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
      <button
        onClick={handleLogout}
        className="text-sm px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
      >
        Logout
      </button>
    </header>
  );
}
