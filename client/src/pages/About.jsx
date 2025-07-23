// src/pages/About.jsx
import { motion } from "framer-motion";
import { Users, Target, Gem } from "lucide-react";

export default function About() {
  return (
    <div className="bg-white min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-gray-900"
        >
          Who We Are
        </motion.h1>
        <p className="text-lg text-gray-600 mt-6 max-w-3xl mx-auto">
          At <span className="text-green-600 font-medium">EasyInvoice</span>, we're passionate about helping businesses simplify their finances — with powerful, easy-to-use tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {[
          {
            Icon: Users,
            title: "Our Team",
            desc: "A diverse team of developers, designers, and thinkers crafting billing solutions for modern businesses.",
          },
          {
            Icon: Target,
            title: "Our Mission",
            desc: "Empower every freelancer, startup, and business owner to take control of their invoicing, branding, and growth.",
          },
          {
            Icon: Gem,
            title: "Core Values",
            desc: "Simplicity. Trust. Innovation. We build software that you’ll love and rely on every day.",
          },
        ].map(({ Icon, title, desc }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="bg-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl transition duration-300"
          >
            <Icon className="w-12 h-12 mx-auto text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-800 mb-6"
        >
          Built For Real Business Challenges
        </motion.h2>
        <p className="text-gray-600 max-w-xl mx-auto text-lg">
          From solo freelancers to growing teams — EasyInvoice is tailored to scale with your ambitions.
        </p>
      </div>
    </div>
  );
}
