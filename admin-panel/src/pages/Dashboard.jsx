import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Mail, Ticket, Briefcase } from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    messages: 0,
    tickets: 0,
    businesses: 0,
  });

  const [ticketsData, setTicketsData] = useState([]);
  const [usersTimeline, setUsersTimeline] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/stats");
        const data = await res.json();
        setStats(data);
        setTicketsData(data.ticketsList || []); // for chart
        setUsersTimeline(data.usersTimeline || []); // for chart
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: stats.users,
      icon: Users,
      path: "/admin/users",
      color: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      label: "Messages",
      value: stats.messages,
      icon: Mail,
      path: "/admin/messages",
      color: "bg-yellow-100",
      textColor: "text-yellow-600",
    },
    {
      label: "Tickets",
      value: stats.tickets,
      icon: Ticket,
      path: "/admin/tickets",
      color: "bg-red-100",
      textColor: "text-red-600",
    },
    {
      label: "Total Businesses Registered",
      value: stats.businesses,
      icon: Briefcase,
      path: "/admin/businesses",
      color: "bg-teal-100",
      textColor: "text-teal-600",
    },
  ];

  // Tickets Bar Chart
  const ticketStatusCounts = ticketsData.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    { Open: 0, "In Progress": 0, Closed: 0 }
  );

  const ticketsChartData = {
    labels: ["Open", "In Progress", "Closed"],
    datasets: [
      {
        label: "Tickets",
        data: [
          ticketStatusCounts.Open,
          ticketStatusCounts["In Progress"],
          ticketStatusCounts.Closed,
        ],
        backgroundColor: ["#3B82F6", "#FACC15", "#16A34A"],
      },
    ],
  };

  const ticketsChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Tickets Status Overview" },
    },
  };

  // Users Over Time Line Chart
  const usersChartData = {
    labels: usersTimeline.map((u) => u.date),
    datasets: [
      {
        label: "New Users",
        data: usersTimeline.map((u) => u.count),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.3,
      },
    ],
  };

  const usersChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "New Users Over Time" },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, icon: Icon, path, color, textColor }) => (
          <div
            key={label}
            onClick={() => navigate(path)}
            className="flex items-center justify-between p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
          >
            <div>
              <div className="text-sm font-medium text-gray-500">{label}</div>
              <div className={`text-2xl font-bold mt-1 ${textColor}`}>{value}</div>
            </div>
            <div className={`${color} p-4 rounded-full`}>
              <Icon className={`w-8 h-8 ${textColor}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Bar data={ticketsChartData} options={ticketsChartOptions} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Line data={usersChartData} options={usersChartOptions} />
        </div>
      </div>
    </div>
  );
}
