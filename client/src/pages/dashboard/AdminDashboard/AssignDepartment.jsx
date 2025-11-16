import React, { useState, useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";
import IssueModal from "./IssueModal";

export default function AssignDepartment({ issue, updateStatus, departments }) {
  const { isDark } = useContext(ThemeContext);

  const [mainDept, setMainDept] = useState("");
  const [subDept, setSubDept] = useState("");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photo, setPhoto] = useState(null);

  const handleAssign = () => {
    if (issue.status === "pending") {
      // Update department and mark in progress
      issue.department = `${mainDept} - ${subDept}`;
      updateStatus(issue._id, "inprogress");
      setMainDept("");
      setSubDept("");
    } else if (issue.status === "inprogress") {
      // Show modal to submit photo
      setShowPhotoModal(true);
    }
  };

  const handlePhotoSubmit = () => {
    if (photo) {
      issue.photo = URL.createObjectURL(photo);
      updateStatus(issue._id, "resolved");
      setShowPhotoModal(false);
      setPhoto(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {issue.status === "pending" && (
        <>
          <select
            value={mainDept}
            onChange={(e) => setMainDept(e.target.value)}
            className={`px-2 py-1 rounded border ${isDark ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
          >
            <option value="">Select Department</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>

          <select
            value={subDept}
            onChange={(e) => setSubDept(e.target.value)}
            className={`px-2 py-1 rounded border ${isDark ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
            disabled={!mainDept}
          >
            <option value="">Select Sub-Department</option>
            {mainDept && ["Team A", "Team B", "Team C"].map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </>
      )}

      {issue.status === "inprogress" && (
        <button
          onClick={() => setShowPhotoModal(true)}
          className={`px-3 py-1 rounded ${isDark ? "bg-blue-600 text-white" : "bg-blue-500 text-white"} hover:opacity-90`}
        >
          Submit Photo & Resolve
        </button>
      )}

      {issue.status === "pending" && (
        <button
          onClick={handleAssign}
          disabled={!mainDept || !subDept}
          className={`px-3 py-1 rounded ${!mainDept || !subDept ? "bg-gray-300 text-gray-500 cursor-not-allowed" : isDark ? "bg-green-600 text-white" : "bg-green-500 text-white"} hover:opacity-90`}
        >
          Assign Issue
        </button>
      )}

      {/* Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 w-[90%] max-w-md`}>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Upload Photo Evidence</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPhotoModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePhotoSubmit}
                disabled={!photo}
                className={`px-4 py-2 rounded ${photo ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                Submit & Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
