import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axios";
import toast from "react-hot-toast";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export default function BusinessDashboard() {
  const { id } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get(`/invoices/business/${id}`);
        setInvoices(res.data);
      } catch (err) {
        toast.error("Error fetching invoices");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [id]);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.invoiceNo?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.billTo?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "due" && inv.status.toLowerCase() === "due") ||
      (filter === "overdue" && inv.status.toLowerCase() === "overdue");

    return matchesSearch && matchesFilter;
  });

  const totalRevenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.total), 0);
  const overdueInvoices = invoices.filter(inv => inv.status.toLowerCase() === "overdue");
  const dueInvoices = invoices.filter(inv => inv.status.toLowerCase() === "due");

  const revenueTrend = {
    labels: ["Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [4000, 4200, 5500, 5300, 5100], // Replace with actual data later
        fill: true,
        backgroundColor: "#f1f5f9",
        borderColor: "#0f172a",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Invoice Dashboard</h1>
          <p className="text-slate-500">Track your business performance</p>
        </div>
        <Link
          to={`/business/${id}/select-template`}
          className="bg-indigo-700 text-white px-5 py-2 rounded-lg hover:bg-indigo-800 transition"
        >
          + New Invoice
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <SummaryCard title="Total Revenue" value={totalRevenue.toLocaleString("en-IN", { style: "currency", currency: "INR" })} subtitle="+000% from last month" />
        <SummaryCard title="Total Invoices" value={invoices.length} subtitle="+12 this month" />
       <SummaryCard
  title="Overdue"
  value={overdueInvoices
    .reduce((sum, i) => sum + parseFloat(i.total), 0)
    .toLocaleString("en-IN", { style: "currency", currency: "INR" })}
  subtitle={`${overdueInvoices.length} invoices`}
/>
       <SummaryCard
  title="Due"
  value={dueInvoices
    .reduce((sum, i) => sum + parseFloat(i.total), 0)
    .toLocaleString("en-IN", { style: "currency", currency: "INR" })}
  subtitle={`${dueInvoices.length} invoices`}
/>
      </div>

      {/* Revenue Graph & Recent Invoices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Revenue Trend</h2>
          <Line data={revenueTrend} />
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Invoices</h2>
          <div className="space-y-4">
            {filteredInvoices.slice(0, 5).map((inv) => (
              <div key={inv._id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-medium text-slate-800">INV-{inv.invoiceNo}</p>
                  <p className="text-sm text-slate-500">{inv.billTo?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-800 font-semibold">
                      {parseFloat(inv.total).toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(inv.status)}`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Summary Card
const SummaryCard = ({ title, value, subtitle }) => (
  <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-1">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
    <p className="text-xs text-green-500">{subtitle}</p>
  </div>
);

// Status badge color logic
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-600";
    case "due":
      return "bg-yellow-100 text-yellow-600";
    case "overdue":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};
