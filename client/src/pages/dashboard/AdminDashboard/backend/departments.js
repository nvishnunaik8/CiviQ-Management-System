import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";

const dummyDepartments = [
  {
    name: "Roads Department",
    head: "Rajesh Kumar",
    contact: "roads@citygov.in",
    categoriesHandled: ["roads", "traffic", "potholes", "sidewalks"],
  },
  {
    name: "Street Lighting Department",
    head: "Anita Sharma",
    contact: "lighting@citygov.in",
    categoriesHandled: ["lighting", "streetlights", "public lamps", "signal lights"],
  },
  {
    name: "Sanitation Department",
    head: "Vikram Singh",
    contact: "sanitation@citygov.in",
    categoriesHandled: ["sanitation", "garbage", "waste", "sewage", "cleanliness"],
  },
  {
    name: "Parks & Recreation Department",
    head: "Priya Reddy",
    contact: "parks@citygov.in",
    categoriesHandled: ["parks", "recreation", "gardens", "playgrounds", "green spaces"],
  },
  {
    name: "Traffic Management Department",
    head: "Suresh Patel",
    contact: "traffic@citygov.in",
    categoriesHandled: ["traffic", "parking", "signals", "congestion", "road safety"],
  },
  {
    name: "Water & Utilities Department",
    head: "Meena Iyer",
    contact: "water@citygov.in",
    categoriesHandled: ["water", "utilities", "sewage", "leakage", "pipes"],
  },
  {
    name: "General Issues Department",
    head: "Arun Chatterjee",
    contact: "other@citygov.in",
    categoriesHandled: ["other", "miscellaneous", "public grievances", "citizen complaints"],
  },
];

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const { isDark } = useContext(ThemeContext);

  useEffect(() => {
    setDepartments(dummyDepartments);
  }, []);

  return (
    <div className={`p-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
      {departments.map((dept) => (
        <div
          key={dept.name}
          className={`
            relative rounded-3xl overflow-hidden shadow-xl transform transition duration-300 hover:scale-105 p-6 pt-8
            ${isDark ? "bg-gray-800 border border-gray-700 text-gray-100" : "bg-white border border-gray-200 text-gray-900"}
          `}
        >
          {/* Top accent */}
          <div className={`absolute top-0 left-0 w-full h-2 ${isDark ? "bg-indigo-500" : "bg-blue-500"}`}></div>

          {/* Department Name */}
          <h4 className={`${isDark ? "text-yellow-400" : "text-gray-900"} text-2xl font-bold mb-2`}>
            {dept.name}
          </h4>

          {/* Head */}
          <p className={`${isDark ? "text-cyan-400" : "text-gray-700"} text-sm mb-1`}>
            Head: {dept.head}
          </p>

          {/* Email */}
          <p className={`${isDark ? "text-pink-400" : "text-gray-700"} text-sm mb-3`}>
            Email: {dept.contact}
          </p>

          {/* Categories */}
          <span className={`${isDark ? "text-green-400" : "text-gray-900"} font-semibold block mb-2`}>
            Problems Solved:
          </span>
          <div className="flex flex-wrap gap-2">
            {dept.categoriesHandled.map((cat, index) => (
              <span
                key={index}
                className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${isDark ? "bg-gray-700 text-white hover:bg-indigo-500" : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"}
                  transition-colors
                `}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Departments;
