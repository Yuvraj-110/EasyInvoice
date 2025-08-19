import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white shadow rounded-lg p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <label className="w-32 text-gray-600 font-medium">Name</label>
              <input
                type="text"
                placeholder="Admin Name"
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <label className="w-32 text-gray-600 font-medium">Email</label>
              <input
                type="email"
                placeholder="admin@example.com"
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition">
              Update Profile
            </button>
          </div>
        );

      case "password":
        return (
          <div className="bg-white shadow rounded-lg p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <label className="w-32 text-gray-600 font-medium">Current Password</label>
              <input
                type="password"
                placeholder="********"
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <label className="w-32 text-gray-600 font-medium">New Password</label>
              <input
                type="password"
                placeholder="********"
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <label className="w-32 text-gray-600 font-medium">Confirm Password</label>
              <input
                type="password"
                placeholder="********"
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition">
              Update Password
            </button>
          </div>
        );

      case "config":
        return (
          <div className="bg-white shadow rounded-lg p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <label className="w-32 text-gray-600 font-medium">Site Name</label>
              <input
                type="text"
                placeholder="EasyInvoice"
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <label className="w-32 text-gray-600 font-medium">Support Email</label>
              <input
                type="email"
                placeholder="support@example.com"
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition">
              Save Configurations
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 font-medium ${
            activeTab === "profile"
              ? "border-b-2 border-teal-500 text-teal-600"
              : "text-gray-600 hover:text-teal-600"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 font-medium ${
            activeTab === "password"
              ? "border-b-2 border-teal-500 text-teal-600"
              : "text-gray-600 hover:text-teal-600"
          }`}
        >
          Password
        </button>
        <button
          onClick={() => setActiveTab("config")}
          className={`px-4 py-2 font-medium ${
            activeTab === "config"
              ? "border-b-2 border-teal-500 text-teal-600"
              : "text-gray-600 hover:text-teal-600"
          }`}
        >
          Site Config
        </button>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}
