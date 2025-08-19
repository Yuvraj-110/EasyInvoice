import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";

export default function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickTips = [
    "Set up your business profile with logo & tax info.",
    "Add customers & generate invoices in seconds.",
    "Monitor overdue payments & get alerts.",
    "Personalize your experience with themes & settings."
  ];

  return (
    <div className="relative overflow-x-hidden">

      {/* Main Welcome Section */}
      <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-gray-50 to-white p-6 md:p-10">

        {/* Decorative Blobs */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0.8, 1.1, 0.8], opacity: 0.15 }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-16 -left-16 w-72 h-72 bg-teal-300 rounded-full filter blur-3xl"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.3, 1], opacity: 0.1 }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-green-300 rounded-full filter blur-3xl"
        />

        {/* Content Grid */}
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 z-10 items-center">

          {/* Left Side: Text + Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
              {user ? `Welcome back, ${user.name}!` : "Welcome to EasyInvoice"}
            </h1>

            <p className="text-gray-600 text-lg md:text-xl">
              {user
                ? "Manage your invoices, customers & payments seamlessly."
                : "Create invoices, track revenue & grow your business effortlessly."}
            </p>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              animate={{ boxShadow: ["0 0 0px #14b8a6", "0 0 20px #14b8a6", "0 0 0px #14b8a6"] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
              onClick={() => navigate("/dashboard")}
              className="bg-teal-500 hover:bg-teal-600 text-white px-10 py-4 rounded-full text-lg transition transform shadow-lg"
            >
              Go to Dashboard
            </motion.button>

            {/* Quick Tips */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.3 } }
              }}
              className="mt-8 space-y-3"
            >
              <h2 className="text-2xl font-semibold text-gray-800">Quick Tips:</h2>
              {quickTips.map((tip, idx) => (
                <motion.p
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="text-gray-600"
                >
                  • {tip}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex justify-center md:justify-end"
          >
            <img
              src="/welcome.png"
              alt="App Mockup"
              className="w-full md:w-[95%] lg:w-[90%] xl:w-[85%] rounded-3xl shadow-2xl transform hover:scale-105 transition duration-500"
            />
          </motion.div>

        </div>
      </div>

      {/* Full-width Green CTA Section */}
      <div className="relative w-full py-20 bg-gradient-to-r from-teal-600 to-green-500 overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white opacity-10 rounded-full animate-pulse"></div>

        <div className="max-w-6xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Having a Problem?
          </h2>
          <p className="text-white text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Raise a support ticket and our team will assist you promptly to resolve any issues.
          </p>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-green-600 px-12 py-5 rounded-full font-semibold shadow-xl hover:bg-gray-100 transition duration-300"
            onClick={() => navigate("/contact")}
          >
            Raise a Ticket
          </motion.button>
        </div>

        {/* Subtle overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/10 pointer-events-none"></div>
      </div>
    </div>
  );
}
