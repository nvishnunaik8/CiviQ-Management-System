import { MapPin, Clock, AlertTriangle, CheckCircle, Eye, Star } from "lucide-react";

export default function IssueCard({ issue, statusColors, statusIcons, setSelectedIssue, setShowRatingModal }) {
  const StatusIcon = statusIcons[issue.status];
  const daysSinceReported = Math.floor((new Date() - new Date(issue.createdAt)) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-2 font-sora">{issue.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-3 font-inter">{issue.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="flex items-center gap-1"><MapPin size={14} />{issue.address || "Location not provided"}</span>
            <span>📁 {issue.category}</span>
            <span>{daysSinceReported} days ago</span>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[issue.status]}`}>
              <StatusIcon size={12} />
              {issue.status.replace("_", " ").toUpperCase()}
            </span>

            {issue.assigned_department && (
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                {issue.assigned_department}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <button onClick={() => setSelectedIssue(issue)} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
            <Eye size={16} /> Details
          </button>

          {issue.status === "resolved" && !issue.citizen_rating && (
            <button onClick={() => { setSelectedIssue(issue); setShowRatingModal(true); }}
              className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium">
              <Star size={16} /> Rate
            </button>
          )}
        </div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
        <div className={`h-2 rounded-full transition-all duration-300 ${issue.status === "pending" ? "bg-red-500 w-1/3" : issue.status === "inprogress" ? "bg-yellow-500 w-2/3" : "bg-green-500 w-full"}`} />
      </div>

      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Reported</span>
        <span>In Progress</span>
        <span>Resolved</span>
      </div>
    </div>
  );
}
