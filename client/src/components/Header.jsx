import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Bell, User, LogOut, Settings as Cog, Menu, ChevronDown } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const solutionsRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (solutionsRef.current && !solutionsRef.current.contains(e.target)) {
        setSolutionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/auth");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        <Link to="/" className="flex items-center space-x-2 text-3xl font-bold">
          <FileText className="w-8 h-8 text-green-600" />
          <span>
            <span className="text-green-600">Easy</span>
            <span className="text-black">invoice</span>
            <span className="text-red-500">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <div className="relative" ref={solutionsRef}>
            <button
              onClick={() => {
                setSolutionsOpen(!solutionsOpen);
                setProfileOpen(false);
              }}
              className="flex items-center text-gray-700 hover:text-green-600 transition"
            >
              Solutions
              <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${solutionsOpen ? "rotate-180" : ""}`} />
            </button>
            {solutionsOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-md z-50">
                <Link to="/invoices" className="block px-4 py-2 hover:bg-gray-100">Invoices & Payments</Link>
                <Link to="/crm" className="block px-4 py-2 hover:bg-gray-100">CRM & Customers</Link>
                <Link to="/reports" className="block px-4 py-2 hover:bg-gray-100">Reports & Dashboards</Link>
                <Link to="/branding" className="block px-4 py-2 hover:bg-gray-100">Custom Branding</Link>
                <Link to="/notifications" className="block px-4 py-2 hover:bg-gray-100">Notifications</Link>
                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Secure Settings</Link>
                <Link to="/payments" className="block px-4 py-2 hover:bg-gray-100">Multiple Payments</Link>
                <Link to="/preferences" className="block px-4 py-2 hover:bg-gray-100">Preferences</Link>
              </div>
            )}
          </div>

          <Link to="/about" className="text-gray-700 hover:text-green-600">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-green-600">Contact Us</Link>

          {user && (
            <Link to="/dashboard" className="text-gray-700 hover:text-green-600">Dashboard</Link>
          )}

          <button className="relative text-gray-600 hover:text-green-600 transition">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {user ? (
            <div className="relative ml-4">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setSolutionsOpen(false);
                }}
                className="focus:outline-none"
              >
                <img 
                  src="/user.png" 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border-2 border-green-600"
                />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                  <Link to="/welcome" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <User className="w-4 h-4 mr-2" /> Profile
                  </Link>
                  <Link to="/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <Cog className="w-4 h-4 mr-2" /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="ml-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full">
              Login
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-600 hover:text-green-600 transition"
        >
          <Menu className="w-8 h-8" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg px-8 py-4 space-y-4">
          <button
            onClick={() => setSolutionsOpen(!solutionsOpen)}
            className="flex justify-between w-full text-gray-700 hover:text-green-600"
          >
            Solutions
            <ChevronDown className={`w-4 h-4 transition ${solutionsOpen ? "rotate-180" : ""}`} />
          </button>
          {solutionsOpen && (
            <div className="ml-4 space-y-2">
              <Link to="/invoices" className="block text-gray-700 hover:text-green-600">Invoices & Payments</Link>
              <Link to="/crm" className="block text-gray-700 hover:text-green-600">CRM & Customers</Link>
              <Link to="/reports" className="block text-gray-700 hover:text-green-600">Reports & Dashboards</Link>
              <Link to="/branding" className="block text-gray-700 hover:text-green-600">Custom Branding</Link>
              <Link to="/notifications" className="block text-gray-700 hover:text-green-600">Notifications</Link>
              <Link to="/settings" className="block text-gray-700 hover:text-green-600">Secure Settings</Link>
              <Link to="/payments" className="block text-gray-700 hover:text-green-600">Multiple Payments</Link>
              <Link to="/preferences" className="block text-gray-700 hover:text-green-600">Preferences</Link>
            </div>
          )}
          <Link to="/about" className="block text-gray-700 hover:text-green-600">About</Link>
          <Link to="/contact" className="block text-gray-700 hover:text-green-600">Contact Us</Link>
          {user && (
            <Link to="/dashboard" className="block text-gray-700 hover:text-green-600">Dashboard</Link>
          )}
          {user ? (
            <>
              <Link to="/profile" className="block text-gray-700 hover:text-green-600">Profile</Link>
              <Link to="/settings" className="block text-gray-700 hover:text-green-600">Settings</Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-gray-700 hover:text-green-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="block text-gray-700 hover:text-green-600">Login</Link>
          )}
        </div>
      )}
    </header>
  );
}
