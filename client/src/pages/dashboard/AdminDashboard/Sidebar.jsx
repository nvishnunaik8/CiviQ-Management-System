import { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";

export default function Sidebar({ navigationItems, activeView, setActiveView }) {
  const {isDark} = useContext(ThemeContext);

  return (
    <div
      className={`w-64 flex flex-col border-r transition-colors ${
        isDark ? "bg-[#1E1E1E] border-[#333333]" : "bg-white border-[#E6E6E6]"
      }`}
    >
      <div
        className={`h-16 flex items-center justify-center text-xl font-bold border-b transition-colors ${
          isDark ? "border-[#333333] text-blue-400" : "border-[#E6E6E6] text-blue-600"
        }`}
      >
        Admin Panel
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors
              ${
                activeView === item.id
                  ? "bg-blue-600 text-white"
                  : `${
                      isDark
                        ? "text-gray-300 hover:bg-[#2A2A2A]"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
