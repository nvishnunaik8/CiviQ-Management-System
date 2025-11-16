import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";
import toast from "react-hot-toast";
import CircularProgress from '@mui/material/CircularProgress';

export default function Login() {
  const [loading,setLoading]=useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { isDark, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    // If token exists, redirect (optional)
    // if (localStorage.getItem("token") || sessionStorage.getItem("token")) {
    //   navigate("/report-issues");
    // }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Email is required");
    if (!password) return toast.error("Password is required");

    try {
      setLoading(true);
      const response = await fetch("https://hackathon-r2yi.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === "ok") {
        if(rememberMe){
          localStorage.setItem("token", data.token);
          if(data.role=="superadmin" || data.role === "employee") localStorage.setItem("role", data.role);

        }
        else{
          sessionStorage.setItem("token", data.token);
          if(data.role=="superadmin" || data.role === "employee") sessionStorage.setItem("role", data.role);

        }
        toast.success("Login successful!");

        if (data.role === "superadmin") navigate("/admin");
        else if (data.role === "employee") navigate("/employee");
        else navigate("/user-home");
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Server error. Try again later.");
    }
    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`relative w-96 p-8 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Top-right gradient circle */}
        <div
          className={`absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-30 ${
            isDark
              ? "bg-gradient-to-tr from-purple-400 to-blue-400"
              : "bg-gradient-to-tr from-purple-500 to-blue-500"
          }`}
        ></div>

        {/* Bottom-left gradient circle */}
        <div
          className={`absolute -bottom-16 -left-16 w-40 h-40 rounded-full opacity-30 ${
            isDark
              ? "bg-gradient-to-tr from-purple-400 to-blue-400"
              : "bg-gradient-to-tr from-purple-500 to-blue-500"
          }`}
        ></div>

        <h2
          className={`text-4xl font-bold text-center mb-8 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label
              className={`block mb-2 font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                isDark
                  ? "bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label
              className={`block mb-2 font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                isDark
                  ? "bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border border-gray-300 text-gray-900"
              }`}
            />
          </div>
<div className="flex items-center gap-2">
  <input
    type="checkbox"
    id="rememberMe"
    checked={rememberMe}
    onChange={(e) => setRememberMe(e.target.checked)}
    className="w-4 h-4 rounded border-gray-300 focus:ring-purple-500"
  />
  <label htmlFor="rememberMe" className={`${isDark ? "text-gray-300" : "text-gray-700"} text-sm`}>
    Remember Me
  </label>
</div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold text-lg shadow-md hover:scale-105 transform transition"
          >
          {loading ?      <CircularProgress size={18} color="success" />
:"SignIn"}
          </button>
        </form>

        <div className="mt-6 text-center text-base">
          <p
            className={`${
              isDark ? "text-white" : "text-gray-500"
            } transition`}
          >
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-purple-500 font-semibold cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </div>

        {/* 🔘 Dark Mode Toggle */}
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
