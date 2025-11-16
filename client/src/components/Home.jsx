import React from "react";
import { Link } from "react-router-dom";
import { MapPin, User, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center text-center p-6">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-sora">
        Civic Reporter
      </h1>
      <p className="text-gray-600 max-w-lg mb-8 font-inter">
        A community platform to report civic issues and track resolutions.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <Link
          to="/report"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
        >
          <User size={20} /> Report 
        </Link>
        <Link
          to="/admin"
          className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
        >
          <Shield size={20} /> Admin Dashboard
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-12 text-gray-500 text-sm">
        <p>
          Powered by <span className="font-semibold text-gray-700">MERN</span> &nbsp;🚀
        </p>
      </div>
    </div>
  );
}
