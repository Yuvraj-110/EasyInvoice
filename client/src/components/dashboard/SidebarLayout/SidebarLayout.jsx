// SidebarLayout.jsx
import { useState } from "react";
import BusinessDashboard from "../BusinessDashboard";
import InvoiceList from "../Invoices/InvoicesList";

export default function SidebarLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-red-600">My Dashboard</h2>
        <nav className="space-y-4">
          <button
            className={`block w-full text-left px-4 py-2 rounded-md transition ${
              activeTab === "dashboard" ? "bg-red-100 text-red-700" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`block w-full text-left px-4 py-2 rounded-md transition ${
              activeTab === "invoices" ? "bg-red-100 text-red-700" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("invoices")}
          >
            Invoices
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "dashboard" ? <BusinessDashboard /> : <InvoiceList />}
      </main>
    </div>
  );
}
