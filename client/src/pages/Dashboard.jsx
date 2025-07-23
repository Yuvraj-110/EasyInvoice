import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const { data } = await axios.get("/businesses");
        setBusinesses(data);
      } catch (err) {
        console.error("Failed to load businesses", err);
        toast.error("Failed to fetch businesses");
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this business?")) return;
    try {
      await axios.delete(`/businesses/${id}`);
      setBusinesses(businesses.filter((b) => b._id !== id));
      toast.success("Business deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete business");
    }
  };

  return (
    <div className="mt-10 min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Your Businesses</h1>
          <Link
            to="/add-business"
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg shadow-md transition-transform hover:scale-105"
          >
            + Add Business
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading businesses...</p>
        ) : businesses.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {businesses.map((biz) => (
              <div
                key={biz._id}
                className="bg-white rounded-2xl shadow-lg p-6 relative group hover:shadow-2xl transition-all duration-300"
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(biz._id)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xl"
                  title="Delete business"
                >
                  🗑
                </button>

                {/* Business Info */}
                <div>
                  {biz.logoUrl && (
                    <img
                      src={`http://localhost:5000${biz.logoUrl}`}
                      alt={`${biz.name} logo`}
                      className="h-24 mx-auto mb-4 object-contain"
                    />
                  )}
                  <h2 className="text-xl font-semibold text-center text-gray-800 mb-1">
                    {biz.name}
                  </h2>
                  <p className="text-sm text-center text-gray-500 mb-3">
                    {biz.businessType || "No type specified"}
                  </p>

                  <div className="text-sm text-gray-700 space-y-1">
                    {biz.taxId && (
                      <p>
                        <span className="font-medium">Tax ID:</span> {biz.taxId}
                      </p>
                    )}
                    {biz.phone && (
                      <p>
                        <span className="font-medium">Phone:</span> {biz.phone}
                      </p>
                    )}
                    {biz.website && (
                      <p>
                        <span className="font-medium">Website:</span>{" "}
                        <a
                          href={biz.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:underline"
                        >
                          {biz.website}
                        </a>
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Currency:</span> {biz.currency}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span> {biz.address}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => navigate(`/business/${biz._id}/dashboard`)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow transition"
                  >
                    View Dashboard
                  </button>
                  <button
                    onClick={() => navigate(`/business/${biz._id}/select-template`)}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow transition"
                  >
                    Generate Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg mt-10">
            No businesses found.{" "}
            <Link
              to="/add-business"
              className="text-teal-600 underline hover:text-teal-800"
            >
              Add your first business
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
