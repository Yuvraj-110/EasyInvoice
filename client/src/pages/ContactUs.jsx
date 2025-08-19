import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    priority: "Medium",
    message: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          priority: "Medium",
          message: "",
        });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error raising ticket:", error);
      setStatus("error");
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-white to-green-50 min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Decorative Shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-5xl bg-white shadow-xl rounded-3xl p-10 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-10 border border-gray-200"
      >
        {/* Left Side - Info */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Need Help?</h2>
          <p className="text-gray-600 text-lg">
            A support ticket allows our team to quickly address your issues.
            Please provide all the necessary details so we can assist you efficiently.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Explain your problem clearly and concisely.</li>
            <li>Provide any relevant screenshots or references.</li>
            <li>Choose the priority level: Low, Medium, or High.</li>
            <li>Our team will respond as soon as possible via email.</li>
          </ul>
        </div>

        {/* Right Side - Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Ticket subject"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <textarea
            rows="4"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Describe your issue..."
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-green-600 text-white font-medium py-3 rounded-md hover:bg-green-700 transition disabled:opacity-50"
          >
            {status === "loading" ? "Submitting..." : "Raise Ticket"}
          </button>

          {status === "success" && (
            <p className="mt-2 text-green-600">✅ Ticket created successfully!</p>
          )}
          {status === "error" && (
            <p className="mt-2 text-red-600">❌ Failed to create ticket. Try again.</p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
