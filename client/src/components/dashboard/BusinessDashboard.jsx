import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axios";
import toast from "react-hot-toast";
import { Line, Doughnut } from "react-chartjs-2";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  ArcElement
);

export default function BusinessDashboard() {
  const { id } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  // const growth = ((current - previous) / previous) * 100;


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

  const filteredInvoices = invoices.filter((inv) => {
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
  const overdueInvoices = invoices.filter((inv) => inv.status.toLowerCase() === "overdue");
  const dueInvoices = invoices.filter((inv) => inv.status.toLowerCase() === "due");
  const paidInvoices = invoices.filter((inv) => inv.status.toLowerCase() === "paid");

  // Monthly Revenue Chart Logic
  const monthlyRevenueMap = {};
  invoices.forEach((inv) => {
    const date = new Date(inv.billDate);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!monthlyRevenueMap[key]) monthlyRevenueMap[key] = 0;
    monthlyRevenueMap[key] += parseFloat(inv.total);
  });

  const sortedKeys = Object.keys(monthlyRevenueMap).sort((a, b) => new Date(a) - new Date(b));
  const monthLabels = sortedKeys.map((key) => {
    const [year, month] = key.split("-");
    return `${new Date(year, month - 1).toLocaleString("default", {
      month: "short",
    })} '${year.slice(2)}`;
  });
  const monthlyRevenue = sortedKeys.map((key) => monthlyRevenueMap[key]);
  

  const revenueTrend = {
    labels: monthLabels,
    datasets: [
      {
        label: "Revenue",
        data: monthlyRevenue,
        fill: true,
        backgroundColor: "rgba(96,165,250,0.2)",
        borderColor: "#3b82f6",
        tension: 0.4,
        pointBackgroundColor: "#3b82f6",
        pointRadius: 4,
      },
    ],
  };
  const centerTextPlugin = {
  id: "centerText",
  beforeDraw(chart) {
    const { width, height, ctx } = chart;
    ctx.restore();

    const total = chart.config.data.datasets[0].data.reduce((a, b) => a + b, 0);
    ctx.font = "bold 22px 'Lato', sans-serif";
    ctx.fillStyle = "#334155"; // Tailwind slate-700
    ctx.textBaseline = "middle";

    const text = `${total} Total`;
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;

    ctx.fillText(text, textX, textY);
    ctx.save();
  }
};

  const pieData = {
  labels: ["Paid", "Due", "Overdue"],
  datasets: [
    {
      data: [paidInvoices.length, dueInvoices.length, overdueInvoices.length],
      backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
      borderColor: ["#15803d", "#ca8a04", "#b91c1c"],
      hoverBorderColor: ["#16a34a", "#eab308", "#dc2626"],
      borderWidth: 2,
      hoverOffset: 10,
    },
  ],
};


  const pieOptions = {
  responsive: true,
  animation: {
    animateRotate: true,
    animateScale: true,
  },
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#4b5563",
        font: { size: 14 },
        boxWidth: 16,
        padding: 16,
        usePointStyle: true,
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const label = ctx.label || "";
          const value = ctx.raw;
          return `${label}: ${value} invoices`;
        },
      },
    },
  },
  cutout: "60%",
  elements: {
    arc: {
      borderAlign: "inner",
      hoverBorderColor: ["#16a34a", "#eab308", "#dc2626"],
      hoverBorderWidth: 4,
    },
  },
};


  return (
    <div className="px-6 py-10 max-w-7xl mx-auto bg-gray-50 min-h-screen">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <SummaryCard
          title="Total Revenue"
          value={totalRevenue.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })}
          subtitle="+0.00% from last month"
        />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Revenue Trend</h2>
          <Line data={revenueTrend} />
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Invoice Status Distribution</h2>
          <div className="w-full max-w-xs">
            <Doughnut data={pieData} options={pieOptions} plugins={[centerTextPlugin]} />
          </div>
        </div>
      </div>

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
                  {parseFloat(inv.total).toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
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
  );
}

const SummaryCard = ({ title, value, subtitle }) => (
  <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-1">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
    <p className="text-xs text-green-500">{subtitle}</p>
  </div>
);

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-700";
    case "due":
      return "bg-yellow-100 text-yellow-700";
    case "overdue":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};