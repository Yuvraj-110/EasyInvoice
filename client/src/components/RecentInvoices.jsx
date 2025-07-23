export default function RecentInvoices() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Recent Invoices</h3>
        <a href="#" className="text-blue-600 hover:underline font-medium">View All</a>
      </div>
      <p className="text-gray-500">No invoices yet.</p>
    </div>
  )
}
