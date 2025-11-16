"use client";

import React, { useState, useEffect, useContext } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  AlertCircle,
  CheckCircle,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  Building2,
  Calendar,
  FileText,
  Flag,
} from "lucide-react";
import toast from "react-hot-toast";

import { Modal, Box, Typography, Button, TextField, MenuItem, Tabs, Tab, CircularProgress } from "@mui/material";
import { ThemeContext } from "../../Context/ThemeContext";
import {useNavigate} from "react-router-dom"

export default function EmployeeDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [tabValue, setTabValue] = useState("all");
  const [modalloading, setModalLoading] = useState(false);
  const navigate=useNavigate();
 

  useEffect( () => {
    const fetchData=async()=>{
       const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if(!token){
      navigate("/login");
      return;
    }
    const response = await fetch("https://hackathon-r2yi.onrender.com/api/employeeDetails", {
      method: "GET",
      headers: {
        'authorization': token,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.ok) {
      setCurrentEmployee(data.details);
      // Map statuses
      const mappedIssues = data.details.issues.map((issue) => ({
        ...issue,
        status:
          (issue.status === "resolved" || issue.assigned_employee_finished)
            ? "finished"
            : issue.status === "inprogress"
              ? "assigned" // or "pending" if you prefer
              : issue.status,
        flagged_status:
          (issue.flagged_status === "resolved" || issue.assigned_employee_finished)
            ? "finished"
            : issue.flagged_status === "inprogress"
              ? "assigned" // or "pending"
              : issue.flagged_status,
      }));

      setIssues(mappedIssues);
    }
    else {
      toast.error(data.error);
    }
    }
    fetchData();
   
    // setCurrentEmployee({
    //   id: 2,
    //   name: "Sarah Johnson",
    //   employee_id: "EMP002",
    //   designation: "Electrician",
    //   department: "Electrical",
    // });
  }, []);

  useEffect(() => {
    if (currentEmployee) loadDummyIssues();
  }, [currentEmployee]);

  const loadDummyIssues = () => {
    const dummyIssues = [
      {
        id: 1,
        issue_id: "ISS001",
        title: "Light not working in Lab 3",
        description: "Ceiling light in lab 3 is not working since morning.",
        category: "Electrical",
        status: "assigned",
        flagged_status: "assigned",
        reported_at: "2025-10-12T08:30:00Z",
      },
      {
        id: 2,
        issue_id: "ISS002",
        title: "Projector issue in Seminar Hall",
        description: "Projector flickering during operation.",
        category: "Electrical",
        status: "assigned",
        flagged_status: "assigned",
        reported_at: "2025-10-10T10:45:00Z",
      },
      {
        id: 3,
        issue_id: "ISS003",
        title: "AC not cooling properly",
        description: "AC in staff room not cooling below 25°C.",
        category: "Maintenance",
        status: "finished",
        flagged_status: "finished",
        reported_at: "2025-10-08T11:00:00Z",
      },
    ];
    // setIssues(dummyIssues);
    setLoading(false);
  };

  const updateIssueStatus = async (issueId, flaggedStatus, notes = "") => {
  setModalLoading(true);
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const response = await fetch(`https://hackathon-r2yi.onrender.com/api/EmployeeFinishedIssue/${issueId}`, {
      method: "GET",
      headers: {
        'authorization': token,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      console.error("Error updating issue:", data.error || "Unknown error");
      toast.error(data.error || "Failed to update issue");
      setModalLoading(false);
      return;
    }

    // ✅ If update succeeded
    setIssues((prev) =>
      prev.map((issue) =>
        issue._id === issueId
          ? { ...issue, flagged_status: flaggedStatus, status: "finished", notes }
          : issue
      )
    );
    toast.success("Issue marked as finished!");
    setSelectedIssue(null);
  } catch (error) {
    console.error("Update failed:", error);
    toast.error("Network error or invalid token");
  } finally {
    // ✅ Always stop spinner
    setModalLoading(false);
  }
};



  const getStatusColor = (status) => {
    const colors = {
      assigned: "text-orange-500",
      finished: "text-green-600",
    };
    return colors[status] || "text-gray-500";
  };
  const finishedCount = issues.filter((i) => i.status === "finished").length;



  // filtered by tab + search
  const filteredIssues = issues.filter((issue) => {
    const searchMatch =
      issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.issue_id?.toLowerCase().includes(searchTerm.toLowerCase());
    if (tabValue === "all") return searchMatch;
    return issue.status === tabValue && searchMatch;
  });

  const assignedCount = issues.filter((i) => i.status === "assigned").length;

  return (
    <div className={`${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-black"} min-h-screen`}>
      {/* Top Bar */}
      <header className={`sticky top-0 z-30 flex justify-between items-center px-6 py-4 shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex items-center space-x-3">
          <LayoutDashboard size={22} />
          <h2 className="text-xl font-bold">Employee Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none ${isDark ? "bg-gray-700 border border-gray-600 text-white" : "bg-white border border-gray-300 text-gray-800"}`}
            />
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${isDark ? "bg-gray-700 text-yellow-300" : "bg-gray-100 text-gray-700"}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Button
      onClick={() => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        toast.success("Logged out successfully");
        navigate("/login");
      }}
      disableRipple
      sx={{
        textTransform: "none",
        border: "1px solid red",
        bgcolor: "red",
        borderRadius: "8px",
        px: 2.5,
        py: 0.5,
        color: "white",
        fontSize: "0.9rem",
        fontWeight: 600,
        "&:hover": {
          bgcolor: "#cc0000", // darker red hover
        },
      }}
    >
      Logout
    </Button>


        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm flex items-center text-gray-400">
          Dashboard <ChevronRight size={14} className="mx-2" /> <span className="font-semibold">My Issues</span>
        </div>

        {/* Employee Info Card */}
        {/* Employee Info + Summary Cards */}
        {currentEmployee && (
          <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800" : "bg-white"} shadow flex justify-between items-center mb-6`}>
            <div>
              <Typography variant="h6" sx={{ color: isDark ? "#fff" : "#111827" }}>
                {currentEmployee.name}
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? "#d1d5db" : "#6b7280" }}>
                {currentEmployee.departmentName}
              </Typography>
            </div>

            <div className="flex space-x-4">
              <div className={`rounded-xl p-4 bg-orange-100 text-orange-600 flex flex-col items-center justify-center`}>
                <span className="font-bold text-xl">{assignedCount}</span>
                <span className="text-sm">Assigned</span>
              </div>

              <div className={`rounded-xl p-4 bg-green-100 text-green-600 flex flex-col items-center justify-center`}>
                <span className="font-bold text-xl">{finishedCount}</span>
                <span className="text-sm">Finished</span>
              </div>
            </div>
          </div>
        )}


        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
          sx={{
            mb: 4,
            "& .MuiTabs-indicator": {
              backgroundColor: isDark ? "#fff" : "#3b82f6",
            },
          }}
        >
          <Tab
            label="All"
            value="all"
            sx={{
              color: isDark ? "#fff" : "#111827",
              "&.Mui-selected": { color: "#3b82f6" },
            }}
          />
          <Tab
            label="assigned"
            value="assigned"
            sx={{
              color: isDark ? "#fff" : "#111827",
              "&.Mui-selected": { color: "#f59e0b" },
            }}
          />
          <Tab
            label="finished"
            value="finished"
            sx={{
              color: isDark ? "#fff" : "#111827",
              "&.Mui-selected": { color: "#16a34a" },
            }}
          />
        </Tabs>
        {/* Issues List */}
        <div className={`rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading issues...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : filteredIssues.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No issues found</div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{issue.title}</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                          {issue.status?.toUpperCase()}
                        </span>

                      </div>
                      <p className="mt-2 text-sm text-gray-400">{issue.description}</p>
                      <div className="flex items-center space-x-4 text-xs mt-3 text-gray-400">
                        <span className="flex items-center"><Building2 size={12} className="mr-1" /> {issue.category}</span>
                        <span className="flex items-center"><Calendar size={12} className="mr-1" /> {new Date(issue.assigned_date).toLocaleDateString()}</span>
                        <span className="flex items-center"><FileText size={12} className="mr-1" /> {issue._id}</span>
                      </div>
                      {issue.flagged_status && (
                        <div className="mt-2 text-purple-400 text-sm flex items-center">
                          <Flag size={12} className="mr-1" /> Flagged as: {issue.flagged_status?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <Button variant="contained" color="primary" onClick={() => {
                      if (issue.status !== "finished") setSelectedIssue(issue)
                    }}>{issue.status === "finished" ? "Finished" : "Set Finished"}</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MUI Modal */}
        <Modal open={!!selectedIssue} onClose={() => setSelectedIssue(null)}>
          {/* <p className="text-white">{selectedIssue}</p> */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 420,
              bgcolor: isDark ? "#111827" : "#fff",
              color: isDark ? "#fff" : "#111827",
              borderRadius: 3,
              p: 4,
              boxShadow: isDark
                ? "0 10px 25px rgba(0,0,0,0.7)"
                : "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            {/* Header */}
            <Typography
              variant="h6"
              mb={3}
              sx={{ fontWeight: 600, fontSize: "1.25rem", color: isDark ? "#fff" : "#111827" }}
            >
              Update Issue Status
            </Typography>

            {/* Status Dropdown */}
            <TextField
              className="text-green-500"
              label="Issue Status"
              fullWidth
              value="Finished"
              sx={{
                mb: 3,
                bgcolor: isDark ? "#1f2937" : "#f9fafb",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDark ? "#374151" : "#d1d5db",
                },
                "& .MuiInputLabel-root": {
                  color: isDark ? "#fff" : "#111827",
                },
                "& .MuiSelect-icon": {
                  color: isDark ? "#fff" : "#111827",
                },
                "& .MuiOutlinedInput-input": {
                  color: isDark ? "#fff" : "#111827",
                },
              }}
            >
            </TextField>

            {/* Notes */}
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={3}
              value={selectedIssue?.notes || ""}
              onChange={(e) =>
                setSelectedIssue((prev) => ({ ...prev, notes: e.target.value }))
              }
              sx={{
                mb: 4,
                bgcolor: isDark ? "#1f2937" : "#f9fafb",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDark ? "#374151" : "#d1d5db",
                },
                "& .MuiInputLabel-root": {
                  color: isDark ? "#fff" : "#111827",
                },
                "& .MuiOutlinedInput-input": {
                  color: isDark ? "#fff" : "#111827",
                },
              }}
            />

            {/* Buttons */}
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setSelectedIssue(null)}
                sx={{
                  borderRadius: 2,
                  color: isDark ? "#fff" : "#111827",
                  borderColor: isDark ? "#374151" : "#d1d5db",
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: isDark ? "#374151" : "#f3f4f6",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() =>
                  updateIssueStatus(
                    selectedIssue._id,
                    selectedIssue.flagged_status,
                    selectedIssue.notes
                  )
                }
                sx={{
                  borderRadius: 2,
                  bgcolor:
                    selectedIssue?.flagged_status === "assigned"
                      ? "#f59e0b" // orange for assigned
                      : "#16a34a", // green for finished or anything else
                  "&:hover": {
                    bgcolor:
                      selectedIssue?.flagged_status === "assigned"
                        ? "#d97706" // darker orange hover
                        : "#15803d", // darker green hover
                  },
                  fontWeight: 600,
                  color: "#fff",
                }}

              >
                {modalloading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: "white",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                ) : (
                  "Submit"
                )}
              </Button>
            </Box>
          </Box>
        </Modal>


      </main>
    </div>
  );
}
