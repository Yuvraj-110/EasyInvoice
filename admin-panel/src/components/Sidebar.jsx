import { NavLink } from "react-router-dom";
import { LayoutDashboard, Mail, FileText, Users, Settings, Ticket } from "lucide-react";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/tickets", label: "Tickets", icon: Ticket },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg hidden md:block">
      <div className="p-6 font-bold text-2xl text-teal-600">EasyInvoice Admin</div>
      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition ${
                isActive ? "bg-teal-100 text-teal-600 font-medium" : ""
              }`
            }
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
