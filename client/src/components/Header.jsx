import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Bell,
  LogOut,
  Settings as Cog,
  Menu,
  ChevronDown,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

// Dummy notifications
const notificationMessages = [
  "New invoice generated",
  "Client XYZ has paid the invoice",
  "Your subscription will expire in 3 days",
  "Reminder: Send invoice to ABC Ltd.",
  "A new user signed up",
  "Invoice #1234 was viewed",
  "New message from customer",
  "Invoice payment failed",
];

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const solutionsRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (solutionsRef.current && !solutionsRef.current.contains(e.target)) {
        setSolutionsOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (!e.target.closest("#profile-dropdown")) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate random notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * notificationMessages.length);
      const newNotification = {
        id: Date.now(),
        message: notificationMessages[randomIndex],
        time: new Date().toLocaleTimeString(),
      };
      setNotifications((prev) => [newNotification, ...prev.slice(0, 4)]);
    }, 10000); // every 10 sec

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-2xl md:text-3xl font-bold">
          <FileText className="w-7 h-7 text-green-600" />
          <span>
            <span className="text-green-600">Easy</span>
            <span className="text-black">Invoice</span>
            <span className="text-red-500">.</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Solutions Dropdown */}
          <div className="relative" ref={solutionsRef}>
            <button
              onClick={() => {
                setSolutionsOpen(!solutionsOpen);
                setProfileOpen(false);
              }}
              className="flex items-center text-gray-700 hover:text-green-600 transition"
            >
              Solutions
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform ${solutionsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {solutionsOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-md z-50 border border-gray-200">
                {["invoices", "crm", "reports", "branding", "notifications", "settings", "payments", "preferences"].map((item) => (
                  <Link
                    key={item}
                    to={`/${item}`}
                    className="block px-4 py-2 hover:bg-gray-100 capitalize text-gray-700"
                  >
                    {item.replace("-", " ").replace("_", " ")}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" className="text-gray-700 hover:text-green-600">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-green-600">Contact</Link>
          {user && <Link to="/dashboard" className="text-gray-700 hover:text-green-600">Dashboard</Link>}

          {/* Notification */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative text-gray-600 hover:text-green-600 transition"
            >
              <Bell className="w-6 h-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md z-50 border border-gray-200">
                <div className="px-4 py-2 border-b text-sm font-medium text-gray-700">Notifications</div>
                <ul className="max-h-60 overflow-y-auto divide-y">
                  {notifications.length === 0 ? (
                    <li className="px-4 py-3 text-gray-500 text-sm">No notifications</li>
                  ) : (
                    notifications.map((note) => (
                      <li key={note.id} className="px-4 py-2 text-sm text-gray-700">
                        <div className="font-medium">{note.message}</div>
                        <div className="text-xs text-gray-400">{note.time}</div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          {user ? (
            <div className="relative" id="profile-dropdown">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="focus:outline-none ml-4"
              >
                <img
                  src="/user.png"
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-green-600"
                />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center space-x-3">
                    <img src="/user.png" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
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
            <Link
              to="/auth"
              className="ml-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-600 hover:text-green-600 transition"
        >
          <Menu className="w-8 h-8" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg px-6 py-4 space-y-3 border-t border-gray-200">
          <button
            onClick={() => setSolutionsOpen(!solutionsOpen)}
            className="flex justify-between w-full text-gray-700 hover:text-green-600"
          >
            Solutions
            <ChevronDown className={`w-4 h-4 transition ${solutionsOpen ? "rotate-180" : ""}`} />
          </button>
          {solutionsOpen && (
            <div className="ml-4 space-y-1">
              {["invoices", "crm", "reports", "branding"].map((item) => (
                <Link
                  key={item}
                  to={`/${item}`}
                  className="block text-gray-700 hover:text-green-600"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              ))}
            </div>
          )}
          <Link to="/about" className="block text-gray-700 hover:text-green-600">About</Link>
          <Link to="/contact" className="block text-gray-700 hover:text-green-600">Contact</Link>
          {user && <Link to="/dashboard" className="block text-gray-700 hover:text-green-600">Dashboard</Link>}
          {user ? (
            <>
              <div className="border-t border-gray-200 pt-2 text-sm text-gray-600">
                <p>{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
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
