import { useState } from "react";

export default function SearchInvoiceModel({ invoices, setFilteredInvoices }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = invoices.filter(inv =>
      inv.invoiceNo.toLowerCase().includes(query.toLowerCase()) ||
      inv.billTo?.name?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredInvoices(filtered);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-6 rounded-xl shadow mb-8 flex items-center gap-4">
      <input
        type="text"
        placeholder="Search by Invoice No or Client Name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}
