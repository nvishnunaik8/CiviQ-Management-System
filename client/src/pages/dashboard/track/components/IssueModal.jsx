export default function IssueModal({ issue, onClose, statusColors }) {
  if (!issue) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white font-sora">{issue.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <div className="space-y-6">
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[issue.status]}`}>
            {issue.status.replace("_", " ").toUpperCase()}
          </span>

          {issue.assigned_department && (
            <span className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
              Assigned to: {issue.assigned_department}
            </span>
          )}

          <div>
            <h3 className="font-semibold text-black dark:text-white mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-400">{issue.description}</p>
          </div>

          {issue.photo_url && (
            <div>
              <h3 className="font-semibold text-black dark:text-white mb-2">Photo Evidence</h3>
              <img src={issue.photo_url} alt="Evidence" className="max-w-full h-64 object-cover rounded-lg" />
            </div>
          )}

          <div>
            <h3 className="font-semibold text-black dark:text-white mb-2">Location</h3>
            <p className="text-gray-600 dark:text-gray-400">{issue.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
