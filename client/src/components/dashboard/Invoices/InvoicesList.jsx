import React, { useEffect, useState } from "react";
import SidebarSearchFilters from "./SidebarSearchFilters";
import axios from "../../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";

export default function InvoiceList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, [id]);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`/invoices/business/${id}`);
      const now = new Date();

      const updatedInvoices = res.data.map((inv) => {
        const dueDate = new Date(inv.dueDate);
        const isOverdue = inv.status === "Due" && dueDate < now;
        return { ...inv, status: isOverdue ? "Overdue" : inv.status };
      });

      setInvoices(updatedInvoices);
    } catch (err) {
      console.error("Failed to load invoices", err);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      await axios.delete(`/invoices/${invoiceId}`);
      toast.success("Invoice deleted successfully!");
      setInvoices((prev) => prev.filter((inv) => inv._id !== invoiceId));
    } catch (error) {
      console.error("Failed to delete invoice", error);
      toast.error("Failed to delete invoice. Please try again.");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
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
  if (inv.status === "Paid") return "0.00";
  const total = parseFloat(inv.total) || 0;
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
                  <th>Billed Amount</th>
                  <th className="p-2">Due Amount</th>
                  <th className="p-2">Due Date</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <React.Fragment key={inv._id}>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-2">{inv.invoiceNo}</td>
                      <td className="p-2 flex items-center justify-between">
                        {inv.billTo?.name || "N/A"}
                        <button
                          onClick={() =>
                            setOpenDropdownId(openDropdownId === inv._id ? null : inv._id)
                          }
                          className="ml-2 text-gray-500 hover:text-black transition-transform"
                          title="View Contact Info"
                        >
                          <span
                            className={`inline-block transform transition-transform duration-300 ${
                              openDropdownId === inv._id ? "rotate-180" : ""
                            }`}
                          >
                            ▼
                          </span>
                        </button>
                      </td>
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
                      <td>INR {parseFloat(inv.total || 0).toFixed(2)}</td>
                      <td className="p-2">
                        {inv.currency} {calculateDueAmount(inv)}
                      </td>
                      <td className="p-2">{formatDate(inv.dueDate)}</td>
                      <td className="p-2 text-center space-x-2">
                        <button
                            onClick={() => navigate(`/invoice/${inv._id}`)}
                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                            >
                            View
                        </button>

                         <button
                              onClick={() => navigate(`/invoices/edit/${inv._id}`)}
                              className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs"
                              >
                              Edit
                          </button>

                        <button
                            onClick={() => handleDeleteInvoice(inv._id)}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                            >
                            Delete
                        </button>
                      </td>
                    </tr>

                    {/* ⬇️ Animated Dropdown Row */}
                    <AnimatePresence>
                      {openDropdownId === inv._id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td colSpan="6" className="bg-gray-50 p-3 text-sm text-gray-700">
                            <div className="flex flex-col gap-1">
                              <p>
                                <strong>Contact No :</strong> {inv.billTo?.contact || "N/A"}
                              </p>
                              <p>
                                <strong>Email:</strong> {inv.billTo?.email || "N/A"}
                              </p>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
