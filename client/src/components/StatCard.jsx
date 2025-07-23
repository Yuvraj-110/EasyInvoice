export default function StatCard({ icon, label, count, color }) {
  return (
    <div className="flex items-center p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${color} text-white text-xl`}>
        {icon}
      </div>
      <div className="ml-4">
        <h4 className="text-gray-600 font-semibold">{label}</h4>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </div>
  )
}
