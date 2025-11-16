import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";
import toast from "react-hot-toast";

export default function SignUp() {
  const { isDark,toggleTheme } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) return toast.error("User Name is required");
    if (!email) return toast.error("Email is required");
    if (!password) return toast.error("Password is required");

    setLoading(true);
    try {
      const response = await fetch("https://hackathon-r2yi.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.status === "ok") {
        toast.success("Registered successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong! Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`rounded-2xl shadow-xl w-96 p-8 relative overflow-hidden ${
          isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
        }`}
      >
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full opacity-30"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full opacity-30"></div>

        <h2 className="text-4xl font-bold text-center mb-8">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "border-gray-300"
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="username"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "border-gray-300"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "border-gray-300"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-lg shadow-md transform transition flex items-center justify-center ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:scale-105 bg-gradient-to-r from-purple-500 to-blue-500 text-white"
            }`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Signing Up...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className={`mt-6 text-center ${isDark?'text-white':'text-gray-500'}`}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-purple-500 font-semibold cursor-pointer"
          >
            Login
          </span>
        </p>
        <button
          onClick={toggleTheme}
          className="absolute top-3 right-3 text-xl text-gray-500 hover:text-purple-500 transition"
        >
          {isDark ? "🌙" : "☀️"}
        </button>
      </div>
      
    </div>
  );
}
