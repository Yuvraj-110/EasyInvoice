import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); // Track row being processed

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/api/admin/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setProcessingId(id);
    try {
      await fetch(`${API}/api/admin/users/${id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Could not delete user. Check server logs.");
    } finally {
      setProcessingId(null);
    }
  };

  // Promote user
  const promoteUser = async (id) => {
    const user = users.find((u) => u._id === id);
    if (!user) return;
    if (!window.confirm(`Promote ${user.name} to admin?`)) return;

    setProcessingId(id);
    try {
      const res = await fetch(`${API}/api/admin/users/${id}/promote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)));
    } catch (err) {
      console.error("Promote failed:", err);
      alert("Could not promote user.");
    } finally {
      setProcessingId(null);
    }
  };

  // Demote user
  const demoteUser = async (id) => {
    const user = users.find((u) => u._id === id);
    if (!user) return;
    if (!window.confirm(`Demote ${user.name} to regular user?`)) return;

    setProcessingId(id);
    try {
      const res = await fetch(`${API}/api/admin/users/${id}/demote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      // 🔑 adjust depending on your backend response
      setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)));
    } catch (err) {
      console.error("Demote failed:", err);
      alert("Could not demote user.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <p className="text-gray-600">Loading users...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{idx + 1}</td>
                  <td className="px-6 py-3">{user.name}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        user.role === "admin"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 flex gap-2">
                    {user.role === "admin" ? (
                      <button
                        disabled={processingId === user._id}
                        onClick={() => demoteUser(user._id)}
                        className="px-3 py-1 rounded text-white disabled:opacity-50
                                   bg-yellow-500 hover:bg-yellow-600"
                      >
                        {processingId === user._id ? "Processing..." : "Demote"}
                      </button>
                    ) : (
                      <button
                        disabled={processingId === user._id}
                        onClick={() => promoteUser(user._id)}
                        className="px-3 py-1 rounded text-white disabled:opacity-50
                                   bg-blue-500 hover:bg-blue-600"
                      >
                        {processingId === user._id ? "Processing..." : "Promote"}
                      </button>
                    )}
                    <button
                      disabled={processingId === user._id}
                      onClick={() => deleteUser(user._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      {processingId === user._id ? "Processing..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
