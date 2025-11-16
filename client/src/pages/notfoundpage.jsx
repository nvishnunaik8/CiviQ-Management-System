import React, { useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext"; // adjust path if needed
import { Moon, Sun } from "lucide-react";

export default function NotFoundPage() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen transition-all duration-500 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={() => toggleTheme(!isDark)}
        className="absolute top-5 right-5 p-2 rounded-full border border-gray-400 hover:scale-110 transition-transform"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Error Content */}
      <h1 className="text-8xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-2 font-semibold">Page Not Found</h2>
      <p className="mb-6 text-center max-w-md">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      <a
        href="/"
        className={`px-6 py-3 rounded-lg font-medium shadow-md transition-colors duration-300 ${
          isDark
            ? "bg-blue-600 hover:bg-blue-500 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        Go Back Home
      </a>
    </div>
  );
}
