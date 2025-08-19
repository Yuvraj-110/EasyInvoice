export default function MessageCard({ name, email, message, createdAt }) {
  return (
    <div className="p-5 bg-white shadow rounded-lg">
      <div className="flex justify-between">
        <h4 className="font-semibold text-gray-800">{name}</h4>
        <span className="text-xs text-gray-400">
          {new Date(createdAt).toLocaleString()}
        </span>
      </div>
      <p className="text-sm text-gray-500">{email}</p>
      <p className="mt-3 text-gray-700">{message}</p>
      <button className="mt-4 px-4 py-2 text-sm bg-teal-500 text-white rounded hover:bg-teal-600">
        Reply
      </button>
    </div>
  );
}
