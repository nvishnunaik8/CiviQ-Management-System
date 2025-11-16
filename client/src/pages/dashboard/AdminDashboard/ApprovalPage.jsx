"use client";

import React, { useState } from "react";
import { Flag } from "lucide-react";

export default function ApprovalPage() {
  // ====== Dummy Data ======
  const dummyIssues = [
    {
      id: 1,
      title: "Network connectivity issue",
      status: "flagged_for_review",
      flagged_status: "in_progress",
      notes: "Reported by employee John Doe",
    },
    {
      id: 2,
      title: "Software installation request",
      status: "flagged_for_review",
      flagged_status: "pending",
      notes: "Requires manager approval",
    },
    {
      id: 3,
      title: "Laptop battery replacement",
      status: "flagged_for_review",
      flagged_status: "resolved",
      notes: "",
    },
  ];

  const [issues, setIssues] = useState(dummyIssues);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // ====== Dummy Approve Function ======
  const approveIssueStatus = (issueId, finalStatus) => {
    // ====== Backend logic would go here ======
    // fetch(`/api/issues/${issueId}`, { method: "PUT", body: JSON.stringify({ status: finalStatus }) });

    // Update the dummy data in state
    setIssues(
      issues.map((i) =>
        i.id === issueId ? { ...i, status: finalStatus, flagged_status: null } : i
      )
    );
    setSelectedIssue(null);
  };

  // ====== Approval Modal ======
  const ApprovalModal = ({ issue, onClose, onApprove }) => {
    const [finalStatus, setFinalStatus] = useState(issue.flagged_status || "resolved");

    const handleSubmit = (e) => {
      e.preventDefault();
      onApprove(issue.id, finalStatus);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <h3 className="text-lg font-bold text-[#07111F] mb-4">Approve Issue Status</h3>
          <div className="mb-4">
            <h4 className="font-medium text-[#536081] mb-2">{issue.title}</h4>
            <p className="text-sm text-[#8A94A7] mb-2">Current Status: {issue.status}</p>
            <p className="text-sm text-[#8B5CF6]">Flagged as: {issue.flagged_status}</p>
            {issue.notes && (
              <div className="mt-2 p-2 bg-[#F7F8FA] rounded">
                <p className="text-sm text-[#536081]">{issue.notes}</p>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#536081] mb-2">Final Status</label>
              <select
                value={finalStatus}
                onChange={(e) => setFinalStatus(e.target.value)}
                className="w-full p-2 border border-[#E1E6ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8BFF]"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-[#E1E6ED] rounded-lg text-[#536081] hover:bg-[#F7F8FA]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#4F8BFF] text-white rounded-lg hover:bg-[#3D6FE5]"
              >
                Approve
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] p-6">
      <h2 className="text-2xl font-bold mb-6">Pending Approvals</h2>

      {issues.length === 0 ? (
        <p className="text-[#536081]">No issues pending approval.</p>
      ) : (
        <div className="divide-y divide-[#EDF0F4]">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="p-4 flex justify-between items-center hover:bg-[#F7F9FC] transition-colors"
            >
              <div>
                <h3 className="font-semibold text-[#07111F]">{issue.title}</h3>
                <p className="text-sm text-[#536081]">
                  Current: {issue.status}, Flagged: {issue.flagged_status}
                </p>
              </div>
              <button
                onClick={() => setSelectedIssue(issue)}
                className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED]"
              >
                Review
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedIssue && (
        <ApprovalModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onApprove={approveIssueStatus}
        />
      )}
    </div>
  );
}
