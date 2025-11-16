import React, { useState, useContext } from "react";
import {
  Search, Eye, Save, RefreshCw, Play, CheckCircle,
  Clock, AlertTriangle, MapPin, Calendar
} from "lucide-react";
import { ThemeContext } from "../../../Context/ThemeContext";
import IssueModal from "./IssueModal";
import toast from "react-hot-toast";

export default function IssuesList({ issues: initialIssues, dept: dept }) {
  const { isDark } = useContext(ThemeContext);
  const [Departments, setDepartments] = useState(dept);
  const [issues, setIssues] = useState(initialIssues);
  const [filters, setFilters] = useState({ search: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const [modalIssue, setModalIssue] = useState(null);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  // ✅ Fetch issues from backend
  // const fetchIssues = async () => {
  //   try {
  //     const token = sessionStorage.getItem("token");
  //     if (!token) return alert("Please log in first.");

  //     const res = await fetch("https://hackathon-r2yi.onrender.com/api/AdminGetIssues", {
  //       headers: { Authorization: token },
  //     });
  //     const data = await res.json();

  //     if (data.ok) 
  //     {
  //       setIssues(data.issues);
  //       console.log(data);
  //     }
  //     else console.error("Failed to load issues:", data.error);
  //   } catch (err) {
  //     console.error("Error fetching issues:", err);
  //   }
  // };

  // useEffect(() => {
  //   fetchIssues();
  // }, []);
  const fetchData = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setLoading(false);
      toast.error("Login Required");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("https://hackathon-r2yi.onrender.com/api/AdminDetails", {
        method: "GET",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setIssues(data.Issues || []);
    } catch (err) {
      console.error("Error fetching admin details:", err);
      toast.error("Failed to load data");
    } 
  };
  const handleRefresh = () => setHasChanges(false);

  // const updateStatus = (id, newStatus) => {
  //   setIssues(prev =>
  //     prev.map(i =>
  //       i._id === id
  //         ? {
  //           ...i,
  //           status: newStatus,
  //           updated_at: new Date().toISOString(),
  //           ...(newStatus === "resolved" && {
  //             resolved_at: new Date().toISOString(),
  //           }),
  //         }
  //         : i
  //     )
  //   );
  //   console.log(issues);
  //   setHasChanges(true);
  // };

  const handleChangeStatus = async (issue) => {
    if (!issue.assigned_employee_finished) {
      toast.error(`${issue.assigned_department_employee} Didnt Finished His Job`);
      return;
    }

    const deptmt = Departments.find(dept => dept.name === issue.assigned_department);
    if (!deptmt) {
      toast.error("Department not found!");
      return;
    }

    // 🔍 Find the employee inside that department
    const employee = deptmt.employees.find(emp => emp.name === issue.assigned_department_employee);
    if (!employee) {
      toast.error("Employee not found!");
      return;
    }

    const res = await fetch(`https://hackathon-r2yi.onrender.com/api/issues/changeToResolved/${issue._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        departmentName: issue.assigned_department,
        employeeEmail: employee.email,
      }),
    });

    const data = await res.json();
    if (data.ok) {
      setIssues(prevIssues =>
        prevIssues.map(previssue =>
          previssue._id === issue._id
            ? {
              ...issue,
              status: "resolved",
              updatedAt: new Date().toISOString(),
            }
            : previssue
        )
      );

    } else {
      toast.error("Network Issues");
    }
  }
  const handleAssign = async () => {
    if (!selectedDept || !selectedEmployee) {
      toast.error("Please select both department and employee.");
      return;
    }
    const deptmt = Departments.find(dept => dept.name === selectedDept);
    if (!deptmt) {
      toast.error("Department not found!");
      return;
    }

    // 🔍 Find the employee inside that department
    const employee = deptmt.employees.find(emp => emp.name === selectedEmployee);
    if (!employee) {
      toast.error("Employee not found!");
      return;
    }

    try {
      const res = await fetch(`https://hackathon-r2yi.onrender.com/api/issues/assign/${modalIssue._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departmentName: selectedDept,
          employeeEmail: employee.email,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        toast.success("Updated SuccesFully");
        setIssues(prevIssues =>
          prevIssues.map(issue =>
            issue._id === modalIssue._id
              ? {
                ...issue,
                status: "inprogress",
                assigned_department: selectedDept,
                assigned_department_employee: selectedEmployee,
                assigned_date: new Date().toISOString(),
              }
              : issue
          )
        );

        // ✅ Close modal
        setModalIssue(null);
        setSelectedDept("");
        setSelectedEmployee("");
      } else {
        toast.error("Failed To Uplaod");
      }
      setModalIssue(null);
    } catch (e) {
      toast.error("Network Issues");
    }
  }

  const filteredIssues = issues.filter(issue => {
    const search = filters.search.toLowerCase();
    const matchesSearch =
      (issue.title || "").toLowerCase().includes(search) ||
      (issue.description || "").toLowerCase().includes(search) ||
      (issue.location_address || "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" || issue.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all" ||
      (issue.category || "").toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });



  const totalPages = Math.ceil(filteredIssues.length / rowsPerPage);
  const paginatedIssues = filteredIssues.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );


  const getStatusInfo = status => {
    const statusMap = {
      pending: {
        label: "Pending",
        icon: Clock,
        color: isDark ? "text-yellow-400" : "text-yellow-700",
        bgColor: isDark ? "bg-yellow-900/40" : "bg-yellow-100",
        borderColor: "border-yellow-500/40",
      },
      inprogress: {
        label: "In Progress",
        icon: AlertTriangle,
        color: isDark ? "text-blue-400" : "text-blue-700",
        bgColor: isDark ? "bg-blue-900/40" : "bg-blue-100",
        borderColor: "border-blue-500/40",
      },
      resolved: {
        label: "Resolved",
        icon: CheckCircle,
        color: isDark ? "text-green-400" : "text-green-700",
        bgColor: isDark ? "bg-green-900/40" : "bg-green-100",
        borderColor: "border-green-500/40",
      },
    };
    return statusMap[status] || statusMap.pending;
  };
  const handleDepartmentChange = (deptName) => {
    setSelectedDept(deptName);
    setSelectedEmployee("");
  };
  const departments = [
    "Roads & Infrastructure",
    "Street Lighting",
    "Sanitation",
    "Parks & Recreation",
    "Water & Utilities",
    "General Services",
    "Emergency Services",
  ];

  const categories = ["Roads", "Lighting", "Sanitation", "Parks", "Water", "Other"];

  const baseClasses = isDark
    ? "bg-gray-800 text-white border-gray-700"
    : "bg-white text-gray-900 border-gray-200";

  const inputClasses = isDark
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500";

  const hoverClasses = isDark ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const goToPage = (newPage) => {
    if (newPage < 0) return;
    if (newPage >= totalPages) return;
    setPage(newPage);
  };

  return (
    <div className={`rounded-xl border shadow-sm ${baseClasses} transition-colors duration-300`}>
      {/* Header */}
      <div className={`p-6 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Issues Management Center</h2>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Track, assign, and resolve civic issues efficiently
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg ${hoverClasses} transition-colors duration-200`}
              title="Refresh Data"
            >
              <RefreshCw size={20} className={isDark ? "text-gray-400" : "text-gray-600"} onClick={()=>fetchData()}/>
            </button>

            {hasChanges && (
              <button
                onClick={() => { toast("Changes saved locally"); setHasChanges(false); }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <Save size={16} /> Save Changes
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Search Issues
            </label>
            <div className="relative">
              <Search size={16} className={`absolute left-3 top-3 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              <input
                type="text"
                placeholder="Search by title, description, or location..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Category</label>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${inputClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Issue Details</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>

            </tr>
          </thead>

          <tbody>
            {paginatedIssues.map(issue => {
              const statusInfo = getStatusInfo(issue.status);
              const StatusIcon = statusInfo.icon;

              return (
                <tr
                  key={issue._id}
                  className={`border-b ${isDark ? "border-gray-700" : "border-gray-200"} ${hoverClasses} transition-colors duration-200 cursor-pointer`}
                >
                  <td className="px-6 py-4" onClick={() => setSelectedIssue(issue)}
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">{issue.title}</h3>
                      {issue.description && <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} line-clamp-2 w-40`}>{issue.description}</p>}
                      {issue.location_address && <div className={`flex items-center gap-1 text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}><MapPin size={12} /><span>{issue.location_address}</span></div>}
                      <div className={`flex items-center gap-1 text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}><Calendar size={12} /><span>#{issue._id?.slice(-5)} • {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "Unknown"}</span></div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor}`}>
                      <StatusIcon size={14} /> {statusInfo.label}
                      {/* Show "Task Finished" tag if inprogress and assigned_employee_finished */}
                      {issue.status === "inprogress" && issue.assigned_employee_finished && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-200 text-green-800 rounded-full">
                          Task Finished
                        </span>
                      )}
                    </div>
                  </td>


                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">{issue.category}</span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {/* <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedIssue(issue);
                        }}
                        className={`p-1 rounded ${hoverClasses} transition-colors duration-200`}
                        title="View Details"
                      >
                        <Eye
                          size={16}
                          className={isDark ? "text-gray-400" : "text-gray-600"}
                        />
                      </button>
                      */}

                      {issue.status === "pending" && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setModalIssue(issue);
                          }}
                          className="p-1 rounded hover:bg-blue-100 text-blue-600 transition-colors duration-200"
                          title="Start Progress"
                        >
                          <Play size={16} />
                        </button>
                      )}

                      {issue.status === "inprogress" && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleChangeStatus(issue);
                          }}
                          className="p-1 rounded hover:bg-green-100 text-green-600 transition-colors duration-200"
                          title="Mark Resolved"
                        >
                          <CheckCircle size={16} color="yellow" />
                        </button>
                      )}

                      {issue.status === "resolved" && (
                        <CheckCircle size={18} color="green" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}


          </tbody>
        </table>
        {modalIssue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`p-6 rounded-lg w-96 shadow-lg ${isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                }`}

            >
              <h2 className="text-lg font-semibold mb-4 text-center">
                Assign Department & Employee
              </h2>

              {/* Department Dropdown */}
              <label className="block text-sm mb-2 font-medium">Department</label>
              <select
                value={selectedDept}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded border ${inputClasses}`}
              >
                <option value="">Select Department</option>
                {Departments.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>

              {/* Employee Dropdown (visible after department selection) */}
              {selectedDept && (
                <>
                  <label className="block text-sm mt-4 mb-2 font-medium">
                    Assign Employee
                  </label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className={`w-full px-3 py-2 text-sm rounded border ${inputClasses}`}
                  >
                    <option value="">Select Employee</option>
                    {Departments.find((d) =>
                      d.name.toLowerCase().includes(selectedDept.toLowerCase())
                    )?.employees?.map((emp) => (
                      <option key={emp._id} value={emp.name}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {/* Buttons */}
              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={() => {
                    setModalIssue(null);
                    setSelectedDept("");
                    setSelectedEmployee("");
                  }}
                  className={`px-4 py-2 rounded-lg border ${isDark ? 'border-red-600 bg-red-600 hover:bg-red-400 text-white-700' : 'border-gray-400 hover:bg-gray-200 text-gray-700 '} `}
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    await handleAssign();
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Set In Progress
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button onClick={() => goToPage(page - 1)} className={`px-3 py-1 rounded-md border ${isDark ? "bg-[#1f1f1f] border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`} disabled={page === 0}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => goToPage(i)} className={`px-3 py-1 rounded-md border ${page === i ? isDark ? "bg-[#4b4b4b] border-gray-700 text-white" : "bg-gray-300 border-gray-300 text-gray-800" : isDark ? "bg-[#1f1f1f] border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => goToPage(page + 1)} className={`px-3 py-1 rounded-md border ${isDark ? "bg-[#1f1f1f] border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`} disabled={page === totalPages - 1}>Next</button>
        </div>

        {/* Issue Modal */}
        <IssueModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          departments={departments}
        />
      </div>
    </div>
  );
}
