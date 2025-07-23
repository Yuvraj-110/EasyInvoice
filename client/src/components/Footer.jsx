import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

export default function Footer() {
  return (
  <footer className="bg-gray-50 border-t border-gray-200 ">
  <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-5 gap-8">

    {/* Logo + About + Newsletter */}
    <div className="space-y-4">
      <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
        <FileText className="w-8 h-8 text-green-600" />
        <span>
          <span className="text-green-600">Easy</span>
          <span className="text-black">invoice</span>
          <span className="text-red-500">.</span>
        </span>
      </Link>
      <p className="text-gray-600 text-sm">
        Full control over billing & subscriptions. Handle taxes, branding, workflows & more.
      </p>
      <form className="flex items-center max-w-xs mt-4">
        {/* <input 
          type="email" 
          placeholder="Your email" 
          className="flex-1 px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
        /> */}
        {/* <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-md text-sm">
          Subscribe
        </button> */}
      </form>
    </div>

    {/* Solutions */}
    <div>
      <h4 className="font-semibold text-gray-700 mb-4">SOLUTIONS</h4>
      <ul className="space-y-2 text-gray-600 text-sm">
        <li><Link to="/branding" className="hover:text-green-600">Branding</Link></li>
        <li><Link to="/tax" className="hover:text-green-600">Tax</Link></li>
        <li><Link to="/workflows" className="hover:text-green-600">Workflows</Link></li>
        <li><Link to="/subscriptions" className="hover:text-green-600">Subscriptions</Link></li>
        <li><Link to="/reports" className="hover:text-green-600">Reports</Link></li>
      </ul>
    </div>

    {/* Support */}
    <div>
      <h4 className="font-semibold text-gray-700 mb-4">SUPPORT</h4>
      <ul className="space-y-2 text-gray-600 text-sm">
        <li><Link to="/docs" className="hover:text-green-600">Documentation</Link></li>
        <li><Link to="/swagger" className="hover:text-green-600">Swagger Docs</Link></li>
        <li><Link to="/github" className="hover:text-green-600">GitHub</Link></li>
      </ul>
    </div>

    {/* Company */}
    <div>
      <h4 className="font-semibold text-gray-700 mb-4">COMPANY</h4>
      <ul className="space-y-2 text-gray-600 text-sm">
        <li><Link to="/about" className="hover:text-green-600">About</Link></li>
        <li><Link to="/blog" className="hover:text-green-600">Blog</Link></li>
        <li><Link to="/roadmap" className="hover:text-green-600">Roadmap</Link></li>
        <li><Link to="/imprint" className="hover:text-green-600">Imprint</Link></li>
      </ul>
    </div>

    {/* Legal */}
    <div>
      <h4 className="font-semibold text-gray-700 mb-4">LEGAL</h4>
      <ul className="space-y-2 text-gray-600 text-sm">
        <li><Link to="/terms-sale" className="hover:text-green-600">Terms Of Sale</Link></li>
        <li><Link to="/terms-use" className="hover:text-green-600">Terms Of Use</Link></li>
        <li><Link to="/privacy" className="hover:text-green-600">Privacy Policy</Link></li>
        <li><Link to="/data" className="hover:text-green-600">Data Agreement</Link></li>
      </ul>
    </div>
  </div>

  <div className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
    © 2025 EasyInvoice. All rights reserved.
  </div>
</footer>


  );
}
