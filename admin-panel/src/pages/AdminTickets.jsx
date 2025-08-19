import { useEffect, useState } from "react";

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [viewTicket, setViewTicket] = useState(null); // For message view modal

  useEffect(() => {
    fetch("http://localhost:5000/api/tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tickets:", err);
        setError("Failed to fetch tickets");
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      setTickets(tickets.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      console.error("Error updating ticket:", err);
    }
  };

  const deleteTicket = async (id) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await fetch(`http://localhost:5000/api/tickets/${id}`, { method: "DELETE" });
      setTickets(tickets.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting ticket:", err);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/tickets/${selectedTicket._id}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: replyMessage, sender: "admin" }),
        }
      );
      const updated = await res.json();
      setTickets(tickets.map((t) => (t._id === updated._id ? updated : t)));
      setReplyMessage("");
      setSelectedTicket(null);
    } catch (err) {
      console.error("Error replying to ticket:", err);
      alert("Reply failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading tickets...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Support Tickets</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Subject</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Priority</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{ticket.name}</td>
                <td className="px-4 py-2">{ticket.email}</td>
                <td className="px-4 py-2">{ticket.subject}</td>
                <td className="px-4 py-2">{ticket.priority}</td>
                <td className="px-4 py-2">
                  <select
                    value={ticket.status}
                    onChange={(e) => updateStatus(ticket._id, e.target.value)}
                    className={`px-2 py-1 rounded ${getStatusColor(ticket.status)} border-none`}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setViewTicket(ticket)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => deleteTicket(ticket._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No tickets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            <h3 className="text-lg font-bold mb-2">Reply to Ticket</h3>
            <p className="mb-4 text-sm text-gray-600">{selectedTicket.subject}</p>

            <div className="mb-4 max-h-40 overflow-y-auto border p-2 rounded">
              {selectedTicket.replies.length === 0 && (
                <p className="text-gray-500">No replies yet.</p>
              )}
              {selectedTicket.replies.map((r, i) => (
                <div key={i} className="mb-2">
                  <span className="font-semibold">{r.sender}:</span>{" "}
                  <span>{r.message}</span>
                </div>
              ))}
            </div>

            <textarea
              className="w-full border rounded p-2 mb-4"
              placeholder="Type your reply..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setSelectedTicket(null)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleReply}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Message Modal */}
      {viewTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            <h3 className="text-lg font-bold mb-2">Ticket Message</h3>
            <p className="mb-4 text-sm text-gray-700">{viewTicket.message}</p>
            <div className="flex justify-end">
              <button
                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setViewTicket(null)}
              >
                Closea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
