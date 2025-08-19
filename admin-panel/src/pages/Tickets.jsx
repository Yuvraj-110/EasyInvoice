// import { useEffect, useState } from "react";

// export default function Tickets() {
//   const [tickets, setTickets] = useState([]);

//   const fetchTickets = async () => {
//     const res = await fetch("http://localhost:5000/api/tickets");
//     const data = await res.json();
//     setTickets(data);
//   };

//   useEffect(() => {
//     fetchTickets();
//   }, []);

//   const handleStatusChange = async (ticketId, status) => {
//     await fetch(`http://localhost:5000/api/tickets/${ticketId}/status`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status }),
//     });
//     fetchTickets();
//   };

//   const handleDelete = async (ticketId) => {
//     if (!window.confirm("Are you sure you want to delete this ticket?")) return;
//     await fetch(`http://localhost:5000/api/tickets/${ticketId}`, {
//       method: "DELETE",
//     });
//     fetchTickets();
//   };

//   const getPriorityBadge = (priority) => {
//     const colors = {
//       High: "bg-red-100 text-red-600",
//       Medium: "bg-yellow-100 text-yellow-600",
//       Low: "bg-green-100 text-green-600",
//     };
//     return (
//       <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[priority]}`}>
//         {priority}
//       </span>
//     );
//   };

//   const getStatusBadge = (status) => {
//     const colors = {
//       Open: "bg-green-100 text-green-600",
//       Pending: "bg-yellow-100 text-yellow-600",
//       Closed: "bg-gray-200 text-gray-600",
//     };
//     return (
//       <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
//         {status}
//       </span>
//     );
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">🎫 Support Tickets</h1>
//       <div className="overflow-x-auto rounded-lg shadow">
//         <table className="min-w-full bg-white border border-gray-200">
//           <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
//             <tr>
//               <th className="px-6 py-3 border-b">Name</th>
//               <th className="px-6 py-3 border-b">Email</th>
//               <th className="px-6 py-3 border-b">Subject</th>
//               <th className="px-6 py-3 border-b">Priority</th>
//               <th className="px-6 py-3 border-b">Status</th>
//               <th className="px-6 py-3 border-b text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="text-sm text-gray-700">
//             {tickets.map((t, idx) => (
//               <tr
//                 key={t._id}
//                 className={`hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
//               >
//                 <td className="px-6 py-4 border-b">{t.name}</td>
//                 <td className="px-6 py-4 border-b">{t.email}</td>
//                 <td className="px-6 py-4 border-b font-medium">{t.subject}</td>
//                 <td className="px-6 py-4 border-b">{getPriorityBadge(t.priority)}</td>
//                 <td className="px-6 py-4 border-b">{getStatusBadge(t.status)}</td>
//                 <td className="px-6 py-4 border-b text-center flex justify-center gap-2">
//                   <select
//                     value={t.status}
//                     onChange={(e) => handleStatusChange(t._id, e.target.value)}
//                     className="border rounded px-2 py-1 text-sm"
//                   >
//                     <option>Open</option>
//                     <option>Pending</option>
//                     <option>Closed</option>
//                   </select>
//                   <button
//                     onClick={() => handleDelete(t._id)}
//                     className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
