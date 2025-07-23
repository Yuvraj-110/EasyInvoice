import { FileText, Users, BarChart, Brush, Bell, Settings, CreditCard, UserCheck } from 'lucide-react'
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="relative bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden pt-20" >

      {/* Global decorative blobs */}
      <div className="pointer-events-none absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-teal-300 opacity-20 rounded-full filter blur-3xl mix-blend-multiply"></div>
      <div className="pointer-events-none absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-green-300 opacity-20 rounded-full filter blur-3xl mix-blend-multiply"></div>
      <div className="pointer-events-none absolute top-1/3 left-[40%] w-[400px] h-[400px] bg-teal-100 opacity-20 rounded-full filter blur-3xl mix-blend-multiply"></div>

      {/* Hero */}
      <div className="flex justify-center items-center py-20 px-6 min-h-[80vh]">
        <div className="relative overflow-hidden shadow-2xl max-w-6xl w-full rounded-3xl">

          {/* Video background */}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 z-10"></div>

          {/* Content */}
          <div className="relative z-20 text-center py-24 px-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-white">
              Take Control Of Your <span className="text-teal-300">Billing</span>
            </h1>
            <p className="text-lg sm:text-xl text-white max-w-2xl mx-auto mb-10">
              With deep integration, automated workflows, a powerful tax system and more.
            </p>
            <a 
              href="/signup" 
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-10 py-4 rounded-full text-lg shadow-lg transition transform hover:scale-105"
            >
              Start For Free
            </a>
          </div>
        </div>
      </div>

      {/* Features Intro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 max-w-6xl mx-auto px-6 py-28 relative z-10">
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-800">
            Your All-In-One Online Invoice Generator
          </h2>
          <ul className="space-y-4 text-lg text-gray-700 leading-relaxed">
            <li>• Manage multiple businesses & branding</li>
            <li>• Create & track invoices, download PDFs</li>
            <li>• Dashboards with revenue, overdue alerts</li>
            <li>• Record partial/full payments easily</li>
            <li>• CRM for customers & history</li>
            <li>• Notifications & visual alerts</li>
            <li>• Secure login, user profiles & themes</li>
          </ul>
          <button className="mt-10 bg-gradient-to-r from-teal-400 to-green-400 px-8 py-4 rounded-xl text-white shadow-xl hover:scale-105 transition">
            Try it Now
          </button>
        </div>
        <div>
          <img 
            src="/featuresImg.png" 
            alt="Features Screenshot" 
            className="rounded-3xl shadow-2xl hover:scale-105 transition duration-300"
          />
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-28 relative z-10">
        <h3 className="text-center text-4xl font-bold mb-14 text-gray-800">
          Everything You Need In One Place
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { icon: FileText, title: "Invoices & Payments", desc: "Create invoices, record payments & auto update balances." },
            { icon: Users, title: "CRM & Customers", desc: "Manage customer details, tax IDs & history seamlessly." },
            { icon: BarChart, title: "Reports & Dashboards", desc: "Visual revenue charts & aging reports." },
            { icon: Brush, title: "Custom Branding", desc: "Logos, invoice prefixes & color themes." },
            { icon: Bell, title: "Notifications", desc: "Overdue badges, email reminders & UI toasts." },
            { icon: Settings, title: "Secure Settings", desc: "JWT Auth, update profile, theme & locale." },
            { icon: CreditCard, title: "Multiple Payments", desc: "Cash, bank, UPI and more." },
            { icon: UserCheck, title: "Preferences", desc: "Dark/light themes, language & date formats." },
          ].map((f, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={idx}
              className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition duration-300"
            >
              <f.icon className="w-14 h-14 mx-auto mb-5 text-teal-500" />
              <h4 className="text-2xl font-semibold mb-2 text-gray-800">{f.title}</h4>
              <p className="text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-28 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-8 text-gray-800">
            Start Simplifying Your Billing Today
          </h2>
          <button className="bg-gradient-to-r from-teal-500 to-green-400 hover:from-teal-600 hover:to-green-500 text-white px-12 py-5 rounded-full text-xl shadow-xl transition transform hover:scale-105">
            Get Started For Free
          </button>
        </motion.div>
      </div>
    </div>
  )
}
