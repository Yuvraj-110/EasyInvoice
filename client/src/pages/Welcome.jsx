import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";

export default function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-gray-50 to-white overflow-hidden p-10">
      
      {/* Decorative blobs */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0.8, 1.1, 0.8], opacity: 0.15 }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-teal-300 rounded-full filter blur-3xl"
      ></motion.div>
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 1.3, 1], opacity: 0.1 }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-green-300 rounded-full filter blur-3xl"
      ></motion.div>

      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 z-10 items-center">
        
        {/* Left side text */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
            {user ? `Welcome back, ${user.name}!` : "Welcome to EasyInvoice"}
          </h1>
          <p className="text-gray-600 text-lg mb-8">
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

          {/* Quick tips */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.3 }}
            }}
            className="mt-10 space-y-3"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Quick Tips:</h2>
            {[
              "Set up your business profile with logo & tax info.",
              "Add customers & generate invoices in seconds.",
              "Monitor overdue payments & get alerts.",
              "Personalize your experience with themes & settings."
            ].map((tip, idx) => (
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

        {/* Right side: bigger image */}
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
  );
}
