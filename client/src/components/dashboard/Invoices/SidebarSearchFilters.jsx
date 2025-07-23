import React from "react";

export default function SidebarSearchFilters({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  invoices = []
}) {
  const today = new Date();

  const getFilteredCount = (type) => {
    if (type === "all") return invoices.length;

    return invoices.filter((inv) => {
      const dueDate = new Date(inv.dueDate);
      const status = inv.status?.toLowerCase();

      if (type === "due") {
        return status === "pending" && dueDate >= today;
      }

      if (type === "overdue") {
        return status === "due" && dueDate < today;
      }

      return false;
    }).length;
  };

 const filters = [
  { label: "All", value: "all" },
  { label: "Due", value: "due" },
  { label: "Overdue", value: "overdue" }
];


  return (
    <div className="w-full bg-white rounded-xl shadow p-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      {/* Search Input */}
      <div className="w-full md:w-1/2">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Search by Invoice No or Client Name
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="e.g. INV-101 or John Doe"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 md:gap-4">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
              filter === f.value
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {f.label} ({getFilteredCount(f.value)})
          </button>
        ))}
      </div>
    </div>
  );
}
