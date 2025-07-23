// src/pages/Contact.jsx
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-gray-900"
        >
          Contact Us
        </motion.h1>
        <p className="text-lg text-gray-600 mt-4 max-w-xl mx-auto">
          We'd love to hear from you. Whether you have a question or just want to say hello — we're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Form */}
        <form className="bg-white shadow-xl rounded-3xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" placeholder="Your full name" className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" placeholder="you@example.com" className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea rows="5" placeholder="Your message..." className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold py-3 rounded-md shadow hover:scale-105 transition">
            Send Message
          </button>
        </form>

        {/* Contact Details */}
        <div className="space-y-8">
          {[
            {
              icon: Mail,
              label: "Email",
              text: "support@easyinvoice.com",
            },
            {
              icon: Phone,
              label: "Phone",
              text: "+91 98765 43210",
            },
            {
              icon: MapPin,
              label: "Office",
              text: "Jaipur, Rajasthan, India",
            },
          ].map(({ icon: Icon, label, text }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex items-start space-x-4"
            >
              <Icon className="w-6 h-6 text-teal-500 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{label}</h4>
                <p className="text-gray-600">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
