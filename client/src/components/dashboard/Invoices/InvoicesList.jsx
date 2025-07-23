import { useEffect, useState } from "react";
import SidebarSearchFilters from "./SidebarSearchFilters";
import axios from "../../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function InvoiceList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get(`/invoices/business/${id}`);
        const now = new Date();

        const updatedInvoices = res.data.map((inv) => {
          const dueDate = new Date(inv.dueDate);
          const isOverdue = inv.status === "Due" && dueDate < now;

          return {
            ...inv,
            status: isOverdue ? "Overdue" : inv.status,
          };
        });

        setInvoices(updatedInvoices);
      } catch (err) {
        console.error("Failed to load invoices", err);
      }
    };

    fetchInvoices();
  }, [id]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.billTo?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "due" && inv.status === "Due") ||
      (filter === "overdue" && inv.status === "Overdue");

    return matchesSearch && matchesFilter;
  });

  const calculateDueAmount = (inv) => {
    const subtotal = inv.items?.reduce((sum, item) => {
      return sum + item.quantity * item.rate;
    }, 0) || 0;

    const discount = inv.discount || 0;
    const tax = inv.tax || 0;
    const vat = inv.vat || 0;
    const shipping = inv.shipping || 0;

    const total = subtotal + tax + vat + shipping - discount;
    return total.toFixed(2);
  };

  return (
    <div className="flex flex-col gap-6">
      <SidebarSearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filter={filter}
        setFilter={setFilter}
        invoices={invoices}
      />

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-4">All Invoices</h2>
        {filteredInvoices.length === 0 ? (
          <p className="text-gray-500">No invoices found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm border">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Invoice No</th>
                  <th className="p-2">Client</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Due Amount</th>
                  <th className="p-2">Due Date</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{inv.invoiceNo}</td>
                    <td className="p-2">{inv.billTo?.name || "N/A"}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          inv.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : inv.status === "Due"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-2">
                      {inv.currency} {calculateDueAmount(inv)}
                    </td>
                    <td className="p-2">{formatDate(inv.dueDate)}</td>
                    <td className="p-2 text-center space-x-2">
                      <button
                        onClick={() => navigate(`/invoice/view/${inv._id}`)}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/invoice/edit/${inv._id}`)}
                        className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
