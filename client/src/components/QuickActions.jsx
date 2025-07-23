export default function QuickActions() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex gap-4 flex-wrap mt-6">
      <button className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
        <span className="mr-2 text-xl">＋</span> Create New Invoice
      </button>
      <button className="flex items-center bg-gray-100 px-5 py-2 rounded-lg hover:bg-gray-200 transition">
        <span className="mr-2">⬇</span> Export Reports
      </button>
      <button className="flex items-center bg-gray-100 px-5 py-2 rounded-lg hover:bg-gray-200 transition">
        <span className="mr-2">⚙</span> Settings
      </button>
    </div>
  )
}
