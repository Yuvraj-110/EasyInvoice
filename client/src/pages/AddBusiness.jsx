import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AddBusiness() {
  const [form, setForm] = useState({
    name: "",
    logo: null,
    taxId: "",
    businessType: "",
    address: "",
    phone: "",
    website: "",
    currency: "INR",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, logo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await axios.post("/businesses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Business added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error adding business", err);
      toast.error("Failed to add business");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Add New Business
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                name="name"
                placeholder="Eg: ABC Traders Pvt Ltd"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-4 border rounded-lg shadow-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-4 border rounded-lg shadow-sm"
              />
              <p className="text-sm text-gray-500 mt-1">Upload PNG, JPG up to 2MB</p>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Tax ID</label>
              <input
                type="text"
                name="taxId"
                placeholder="Eg: GSTIN / VAT123456"
                value={form.taxId}
                onChange={handleChange}
                className="w-full p-4 border rounded-lg shadow-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Business Type</label>
              <input
                type="text"
                name="businessType"
                placeholder="Eg: Pvt Ltd, Partnership"
                value={form.businessType}
                onChange={handleChange}
                className="w-full p-4 border rounded-lg shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                placeholder="Eg: 123 Business Street, Mumbai"
                value={form.address}
                onChange={handleChange}
                rows="4"
                className="w-full p-4 border rounded-lg shadow-sm resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="Eg: +91-9876543210"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-4 border rounded-lg shadow-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Website</label>
              <input
                type="url"
                name="website"
                placeholder="Eg: https://yourcompany.com"
                value={form.website}
                onChange={handleChange}
                className="w-full p-4 border rounded-lg shadow-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Currency</label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full p-4 border rounded-lg shadow-sm"
              >
                <option value="INR">INR - ₹</option>
                <option value="USD">USD - $</option>
                <option value="EUR">EUR - €</option>
                <option value="GBP">GBP - £</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-green-400 text-white px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition"
            >
              Save Business
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
