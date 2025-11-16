import React, { useContext,useState } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useEffect } from "react";

// Dummy carousel images
const carouselImages = [
    "https://data1.ibtimes.co.in/en/full/673854/kaggadasapura-road-bangalore-potholes.jpg?w=1199&h=444&l=50&t=40",
  "https://pbs.twimg.com/media/E0x1Z2KVgAEDA4b.jpg",
];

// Example departments
// Updated Departments Data with description
const departmentsData = [
  { id: 1, name: "Public Works", head: "Ramesh Kumar", description: "Handles construction and maintenance of public infrastructure like buildings, bridges, and streets.", image: "https://www.myhmc.in/wp-content/uploads/2020/02/road-construction-1060x660.jpg" },
  { id: 2, name: "Electricity Dept.", head: "Suresh Sharma", description: "Responsible for electricity distribution, maintenance, and resolving power outages.", image: "https://www.deccanchronicle.com/h-upload/2025/04/17/1908867-power.webp" },
  { id: 3, name: "Water Supply", head: "Anil Mehta", description: "Ensures clean water supply and maintenance of pipelines across the city.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyd-eZkVuy2gn-LIzPAlvx6tCiTANTuFoNww&s" },
  { id: 4, name: "Sanitation", head: "Priya Reddy", description: "Manages garbage collection, sewage treatment, and city cleanliness.", image: "https://www.ifpri.org/wp-content/uploads/2024/10/shutterstock_editorial_2471841117-scaled.jpg" },
  { id: 5, name: "Road Maintenance", head: "Vikram Singh", description: "Responsible for maintaining roads, repairing potholes, and improving traffic flow.", image: "https://etimg.etb2bimg.com/photo/85135129.cms" },
  { id: 6, name: "Traffic Management", head: "Neha Gupta", description: "Controls traffic signals, manages congestion, and ensures road safety.", image: "https://media.istockphoto.com/id/1250425037/photo/covid-19-corona-virus-unlock-in-india-police-on-duty-to-stop-people-from-roaming-in-city.jpg?s=612x612&w=0&k=20&c=m3JlzIEYMGK2G6ut1VYrdg4fgxNrkelEHSdvCbDhTmw=" },
  { id: 7, name: "Parks & Recreation", head: "Rohit Verma", description: "Maintains public parks, gardens, and recreational facilities.", image: "https://media.istockphoto.com/id/1287053532/photo/lodi-gardens-park-in-new-delhi.jpg?s=612x612&w=0&k=20&c=g_MqyAJPdQCNpnpkvF1B1AB2YLZ2FGyDpriMo6-cAo8=" },
  { id: 8, name: "Health Services", head: "Aarti Joshi", description: "Manages hospitals, clinics, and public health initiatives.", image: "https://www.livemint.com/lm-img/img/2023/04/05/1600x900/AIIMS_1680717306838_1680717307112_1680717307112.jpg" },
  { id: 9, name: "Fire Department", head: "Sanjay Patel", description: "Responsible for fire safety, rescue operations, and emergency responses.", image: "https://www.india.com/wp-content/uploads/2016/07/fire-brigade.jpg" },
  { id: 10, name: "Education Dept.", head: "Ramesh Iyer", description: "Oversees schools, educational programs, and literacy initiatives.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVeAw49nd0JCsENbW0w_4stuq38hTZ7sWrztf96w_Ned4zNILqM25OGwQIT3tHPsUhgEw" },
];

const reviews = [
  { name: "Ravi K.", comment: "CiviQ helped me report a pothole and it was fixed in 2 days!" },
  { name: "Anita P.", comment: "Amazing app! Now I can track issues in my locality easily." },
  { name: "Suresh M.", comment: "The departments are very responsive and the interface is clean." },
];

export default function HomePage() {
  const { isDark,toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [LoggedIn,setLoggedIn]=useState(localStorage.getItem("token")||sessionStorage.getItem("token"));
  // Example stats (replace with API data)
  const issuesStats = {
    reported: "1250+",
    resolved: "980+",
    percentResolved: "78+",
  };
  useEffect(()=>{
    const role=localStorage.getItem("role") || sessionStorage.getItem("role");
    if(role){
      if(role=="superadmin") navigate("/admin");
      else if(role=="employee") navigate("/employee");
    }
  },[])
  return (
    <div className={`${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen`}>
      {/* Header */}
      <header className={`flex justify-between items-center px-6 py-4 ${isDark ? "bg-gray-800" : "bg-white shadow-md"}`}>
        <h1 className="text-3xl font-bold">CiviQ</h1>
       <div>
         
        <button
          onClick={toggleTheme}
          className="mr-6 text-xl text-gray-500 hover:text-purple-500 transition"
        >
          {isDark ? "🌙" : "☀️"}
        </button>

       {LoggedIn?(
         <button
          onClick={() => {
            if(localStorage.getItem("token")) localStorage.removeItem("token");
            else if(sessionStorage.getItem("token")) sessionStorage.removeItem("token");
            setLoggedIn(null);
          }}
          className="px-4 py-2 rounded-xl border border-red-500 bg-red-500 text-white hover:bg-red-600 transform transition hover:scale-105"
        >
          Logout
        </button>
       ):(
         <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 rounded-xl border border-blue-500 bg-blue-500 text-white hover:bg-blue-600 transform transition hover:scale-105"
        >
          Login
        </button>
       )}
       </div>
      </header>

      {/* Hero Section */}
      <section className="text-center px-6 py-20">
        <h2 className="text-4xl font-bold mb-6">Empowering Citizens to Improve Their City</h2>
        <p className="max-w-2xl mx-auto text-lg mb-8">
          CiviQ bridges the gap between citizens and city administration. Report issues, monitor resolutions, and contribute to a smarter, cleaner, and safer city.
        </p>
      </section>

      {/* Carousel */}
      <section className="max-w-6xl mx-auto px-6 mb-20 flex flex-col justify-center items-center">
        <Carousel showThumbs={false} infiniteLoop autoPlay interval={4000} showStatus={false} emulateTouch>
          {carouselImages.map((img, idx) => (
            <div key={idx}>
              <img src={img} alt={`carousel-${idx}`} className="rounded-xl shadow-lg object-cover h-38 w-full"/>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Issues Stats */}
      <section className={`px-6 py-20 ${isDark?'bg-gray-600':'bg-gray-400 text-white'}`}>
        <h3 className="text-3xl font-bold text-center mb-12">Issues Resolved So Far</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          <div className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-700">
            <h4 className="text-4xl font-bold">{issuesStats.reported}</h4>
            <p className="mt-2 text-gray-500 dark:text-gray-300">Reported</p>
          </div>
          <div className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-700">
            <h4 className="text-4xl font-bold">{issuesStats.resolved}</h4>
            <p className="mt-2 text-gray-500 dark:text-gray-300">Resolved</p>
          </div>
          <div className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-700">
            <h4 className="text-4xl font-bold">{issuesStats.percentResolved}%</h4>
            <p className="mt-2 text-gray-500 dark:text-gray-300">Resolved Percentage</p>
          </div>
        </div>
      </section>

      {/* Department Cards */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12">City Departments</h3>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departmentsData.map((dept, idx) => (
            <div key={idx} className={` ${isDark?'bg-gray-700 text-white':'bg-gray-300 text-gray-800'} rounded-2xl shadow-lg overflow-hidden hover:scale-105 transform transition duration-300`}>
              <img src={dept.image} alt={dept.name} className="h-48 w-full object-cover"/>
              <div className="p-6">
                <h4 className="text-xl font-bold mb-2">{dept.name}</h4>
                <p className={`${isDark?'text-white':'text-gray-900'}`}>{dept.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="flex justify-center items-center gap-5">
        <section className="flex flex-col sm:flex-row justify-center items-center gap-8 py-20">
  {/* Report Issue Button */}
  <button
    onClick={() => navigate("/report-issues")}
    className={`group relative px-10 py-6 rounded-2xl text-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg 
      ${isDark ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white" : "bg-gradient-to-r from-green-400 to-emerald-500 text-white"}
    `}
  >
    <span className="relative z-10">📝 Report an Issue</span>
    <div
      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-white/20 transition duration-300"
    ></div>
  </button>

  {/* Track Issues Button */}
  <button
    onClick={() => navigate("/track-issues")}
    className={`group relative px-10 py-6 rounded-2xl text-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg 
      ${isDark ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white" : "bg-gradient-to-r from-blue-400 to-indigo-500 text-white"}
    `}
  >
    <span className="relative z-10">📊 Track My Issues</span>
    <div
      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-white/20 transition duration-300"
    ></div>
  </button>
</section>

      </section>
 <section className="px-6 py-20 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12">What Citizens Say</h3>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <div key={idx} className={`p-6  ${isDark?'bg-gray-700 text-white':'bg-gray-300 text-black'} rounded-2xl shadow-lg text-center`}>
              <p className={`mb-4 ${isDark?'text-white':'text-gray-700'}`}>"{review.comment}"</p>
              <h4 className="font-semibold">{review.name}</h4>
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <footer className={`py-6 text-center ${isDark ? "bg-gray-900 text-gray-400" : "bg-white text-gray-700"}`}>
        © 2025 CiviQ. All rights reserved.
      </footer>
    </div>
  );
}
