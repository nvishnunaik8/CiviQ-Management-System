import { useState, useEffect, useContext } from "react";
import {
  Search,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  House,
  Star,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import Navigation from "../components/Navigation";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../Context/ThemeContext"; // Import context

export default function TrackIssues() {
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext); // use isDark variable

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const statusColors = {
    pending: isDark
      ? "bg-red-900/20 text-red-400 border-red-800"
      : "bg-red-100 text-red-800 border-red-200",
    inprogress: isDark
      ? "bg-yellow-900/20 text-yellow-400 border-yellow-800"
      : "bg-yellow-100 text-yellow-800 border-yellow-200",
    resolved: isDark
      ? "bg-green-900/20 text-green-400 border-green-800"
      : "bg-green-100 text-green-800 border-green-200",
  };

  const statusIcons = {
    pending: Clock,
    inprogress: AlertTriangle,
    resolved: CheckCircle,
  };

  useEffect(() => {
    fetchIssues();
  }, []);
  {/* ⭐ Rating Modal */}

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        toast.error("Login required");
        navigate("/login");
        return;
      }
      const response = await fetch("https://hackathon-r2yi.onrender.com/api/user/issues", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        }
      });
      const data = await response.json();
      setIssues(data.issues);
    } catch (error) {
      console.error("Error loading dummy data:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async () => {
  if (!showRatingModal || rating === 0) return;
  const token=localStorage.getItem("token") || sessionStorage.getItem("token");
  try {
    const response=await fetch(`https://hackathon-r2yi.onrender.com/api/user/setRating/${showRatingModal._id}`,{
      method:"PUT",
      headers:{
        'Content-Type':'application/json',
        'authorization':token
      },body:JSON.stringify({
        rating:rating,
        feedback:feedback
      })
    });
    const data=await response.json();
    if(data.ok){
const updatedIssues = issues.map((issue) =>
      showRatingModal._id === issue._id
        ? { ...issue, rating: rating, user_feedback: feedback }
        : issue
    );
        setIssues(updatedIssues);

    toast.success("Thanks for your feedback!");

    }else{
      toast.error(data.error);
    }
    

    setShowRatingModal(null);
    setRating(0);
    setFeedback("");
  } catch (error) {
    console.error("Error submitting dummy rating:", error);
    toast.error("Failed to submit rating");
  }
};


  const filteredIssues = issues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const IssueCard = ({ issue }) => {
    const StatusIcon = statusIcons[issue.status];
    const daysSinceReported = Math.floor(
      (new Date() - new Date(issue.createdAt)) / (1000 * 60 * 60 * 24)
    );

    return (
      <div className={`${isDark ? "bg-[#1E1E1E] border-[#333333]" : "bg-white border-[#E6E6E6]"} rounded-xl border p-6 hover:shadow-lg transition-all duration-200`}>
        <div className={`absolute top-5 left-5 cursor-pointer p-2 border ${isDark?'border-white':'border-black'} rounded-full`}>
                  <House color={`${isDark?'white':'black'}`} size={18} onClick={()=>navigate("/user-home")}/>
              </div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1" key={issue.createdAt}>
            <h3 className={`${isDark ? "text-white" : "text-black"} text-lg font-semibold mb-2 font-sora`}>
              {issue.title}
            </h3>
            <p
  className={`${isDark ? "text-gray-400" : "text-gray-600"} mb-3 font-inter line-clamp-3`}
  style={{
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  }}
>
  {issue.description}
</p>


            <div className={`${isDark ? "text-gray-400" : "text-gray-500"} flex items-center gap-4 text-sm mb-3`}>
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {issue.address || "Location not provided"}
              </span>
              <span>📁 {issue.category}</span>
              <span>{daysSinceReported} days ago</span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[issue.status]}`}
              >
                <StatusIcon size={12} />
                {issue.status.replace("_", " ").toUpperCase()}
              </span>

              {issue.assigned_department && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? "bg-blue-900/20 text-blue-400" : "bg-blue-50 text-blue-700"}`}>
                  {issue.assigned_department}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <button
              onClick={() => setSelectedIssue(issue)}
              className={`${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"} flex items-center gap-1 text-sm font-medium`}
            >
              <Eye size={16} />
              Details
            </button>

            {issue.status === "resolved" && !issue.rating && (
              <button
                onClick={() => {
                  setShowRatingModal(issue);
                }}
                className={`${isDark ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-700"} flex items-center gap-1 text-sm font-medium`}
              >
                <Star size={16} />
                Rate
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className={`${isDark ? "bg-gray-700" : "bg-gray-200"} w-full rounded-full h-2 mb-3`}>
          <div
            className={`h-2 rounded-full transition-all duration-300 ${issue.status === "pending"
                ? "bg-red-500 w-1/3"
                : issue.status === "inprogress"
                  ? "bg-yellow-500 w-2/3" 
                  : "bg-green-500 w-full"
              }`}
          />
        </div>

        <div className={`${isDark ? "text-gray-400" : "text-gray-500"} flex justify-between text-xs`}>
          <span>Reported</span>
          <span>In Progress</span>
          <span>Resolved</span>
        </div>

        {issue.rating && (
          <div className={`${isDark ? "bg-green-900/20 text-green-400" : "bg-green-50 text-green-800"} mt-4 p-3 rounded-lg`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">
                Your Rating:
              </span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < issue.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>
            {issue.user_feedback && (
              <p className={`${isDark ? "text-green-300" : "text-green-700"}`}>
                "{issue.user_feedback}"
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`${isDark ? "bg-[#0A0A0A]" : "bg-[#F3F3F3]"} min-h-screen flex items-center justify-center`}>
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`${isDark ? "bg-[#0A0A0A]" : "bg-[#F3F3F3]"} min-h-screen py-6 px-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`${isDark ? "bg-[#1E1E1E] border-[#333333]" : "bg-white border-[#E6E6E6]"} rounded-t-2xl border p-6`}>
          <h1 className={`${isDark ? "text-white" : "text-black"} text-3xl font-bold mb-2 font-sora`}>
            Track Your Issues
          </h1>
          <RefreshCw color={`${isDark?'white':'black'}`} className="float-right cursor-pointer" onClick={()=>fetchIssues()}/>
          <p className={`${isDark ? "text-gray-300" : "text-gray-600"} font-inter mb-6`}>
            Monitor the progress of your reported civic issues
          </p>
          {/* Search */}
          <div className="relative">
            <Search
              size={20}
              className={`${isDark ? "text-gray-500" : "text-gray-400"} absolute left-3 top-1/2 transform -translate-y-1/2`}
            />
            <input
              type="text"
              placeholder="Search your issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${isDark ? "bg-[#262626] border-[#404040] text-white placeholder-gray-500" : "bg-white border-[#D9D9D9] text-black placeholder-gray-400"} w-full pl-10 pr-4 py-3 rounded-lg font-inter`}
            />
          </div>
        </div>

        {/* Issues List */}
        <div className={`${isDark ? "bg-[#1E1E1E] border-[#333333]" : "bg-white border-[#E6E6E6]"} border-x p-6`}>
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle size={48} className={`${isDark ? "text-gray-600" : "text-gray-400"} mx-auto mb-4`} />
              <h3 className={`${isDark ? "text-gray-400" : "text-gray-600"} text-xl font-semibold mb-2`}>
                No issues found
              </h3>
              <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {searchQuery
                  ? "Try adjusting your search"
                  : "You haven't reported any issues yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`${isDark ? "bg-[#1E1E1E] border-[#333333]" : "bg-white border-[#E6E6E6]"} rounded-b-2xl border p-6`}>
          <div className="text-center">
            <Link
              to="/report-issues"
              className="inline-flex items-center gap-2 py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors font-inter"
            >
              Report New Issue
            </Link>
          </div>
        </div>
        
{showRatingModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
    <div
      className={`${
        isDark ? "bg-[#1E1E1E] text-white" : "bg-white text-black"
      } p-6 rounded-xl w-full max-w-md relative shadow-xl`}
    >
      {/* Close Button */}
      <button
        onClick={() => setShowRatingModal(null)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
      >
        ✕
      </button>

      {/* Title */}
      <h2 className="text-xl font-bold mb-3">
        Rate This Issue
      </h2>
      <p className="text-sm mb-4 text-gray-500">
        How satisfied are you with the resolution?
      </p>

      {/* Star Rating */}
      <div className="flex justify-center mb-4">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <Star
            key={starValue}
            size={28}
            className={`cursor-pointer transition-colors duration-200 ${
              starValue <= rating
                ? "text-yellow-400 fill-yellow-400"
                : isDark
                ? "text-gray-600"
                : "text-gray-300"
            }`}
            onClick={() => setRating(starValue)}
          />
        ))}
      </div>

      {/* Feedback Input */}
      <textarea
        placeholder="Write your feedback..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows="4"
        className={`w-full p-3 rounded-lg border text-sm focus:outline-none ${
          isDark
            ? "bg-[#262626] border-[#404040] text-white placeholder-gray-500"
            : "bg-white border-[#D9D9D9] text-black placeholder-gray-400"
        }`}
      />

      {/* Buttons */}
      <div className="flex justify-end mt-5 gap-3">
        <button
          onClick={() => setShowRatingModal(null)}
          className={`px-4 py-2 rounded-lg font-medium ${
            isDark
              ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          Cancel
        </button>
        <button
          onClick={submitRating}
          disabled={rating === 0}
          className={`px-5 py-2 rounded-lg font-semibold transition-colors ${
            rating === 0
              ? "bg-blue-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}
        {selectedIssue && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto scrllbar-hide">
      <div
        className={`${
          isDark ? "bg-[#1E1E1E] text-white" : "bg-white text-black"
        } p-6 rounded-xl max-w-lg w-full relative my-10 overflow-y-auto max-h-[85vh] `}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <button
          className={`sticky top-3 right-3 float-right ${isDark?'text-white hover:text-gray-300':'text-gray-500 hover:text-gray-700'} z-50`}
          onClick={() => setSelectedIssue(null)}
        >
          ✕
        </button>
  
      <h2 className="text-xl font-bold mb-2 ">{selectedIssue.title}</h2>
      <p className="mb-2">{selectedIssue.description}</p>
      <p className="text-sm text-gray-400 mb-1">Category: {selectedIssue.category}</p>
      <p className="text-sm text-gray-400 mb-1">Address: {selectedIssue.address}</p>
      <p className="text-sm text-gray-400 mb-1">Status: {selectedIssue.status}</p>
      {selectedIssue.assigned_department && <>
      <p className="text-sm text-gray-400 mb-1">Assigned Department: {selectedIssue.assigned_department}</p>
      <p className="text-sm text-gray-400 mb-1">Assigned Employee: {selectedIssue.assigned_department_employee}</p>
      </>}
      {selectedIssue.photo && <img src={selectedIssue.photo} alt={selectedIssue.title} className="mt-3 rounded" />}
    </div>
  </div>
)}

      </div>
    </div>
  );
}
