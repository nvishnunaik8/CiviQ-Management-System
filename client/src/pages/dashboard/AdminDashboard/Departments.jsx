import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";
import { Trash2 } from "lucide-react"; // Trash icon
import toast from "react-hot-toast";

const departmentCategoryMap = new Map([
  ["Roads Department", ["roads", "traffic", "potholes", "sidewalks"]],
  ["Street Lighting Department", ["lighting", "streetlights", "public lamps", "signal lights"]],
  ["Sanitation Department", ["sanitation", "garbage", "waste", "sewage", "cleanliness"]],
  ["Parks & Recreation Department", ["parks", "recreation", "gardens", "playgrounds", "green spaces"]],
  ["Traffic Management Department", ["traffic", "parking", "signals", "congestion", "road safety"]],
  ["Water & Utilities Department", ["water", "utilities", "sewage", "leakage", "pipes"]],
  ["General Issues Department", ["other", "miscellaneous", "public grievances", "citizen complaints"]],
]);

const Departments = ({ dept }) => {
  const [departments, setDepartments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [employeeForm, setEmployeeForm] = useState({ name: "", email: "", password: "", phone: "" });

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [currentEmployees, setCurrentEmployees] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, empId: null, empName: "" });

  const { isDark } = useContext(ThemeContext);

  useEffect(() => {
    setDepartments(dept);
  }, [dept]);

  const openAddEmployeeModal = (deptName) => {
    setSelectedDept(deptName);
    setEmployeeForm({ name: "", email: "", password: "", phone: "" });
    setModalOpen(true);
  };

  const openShowEmployeesModal = (employees) => {
    setCurrentEmployees(employees || []);
    setShowEmployeeModal(true);
  };

  const handleChange = (e) => {
    setEmployeeForm({ ...employeeForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDept) return;
    try {
      const res = await fetch("https://hackathon-r2yi.onrender.com/api/admin/AddEmployees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...employeeForm, departmentName: selectedDept }),
      });
      if (!res.ok) throw new Error("Failed to add employee");

      toast.success(`${employeeForm.name} added to ${selectedDept}`);
      setModalOpen(false);

      setDepartments(prev =>
        prev.map(d => {
          if (d.name === selectedDept) {
            return { ...d, employees: [...(d.employees || []), { ...employeeForm, _id: Date.now() }] };
          }
          return d;
        })
      );
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const handleDeleteEmployee = async () => {
    const token=localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const res = await fetch(`https://hackathon-r2yi.onrender.com/api/admin/DeleteEmployee/${confirmDelete.empId}`, {
        method: "DELETE",
        headers:{
          'authorization':token
        }
      });
      if (!res.ok) throw new Error("Failed to delete employee");

      // Update local state
      setDepartments(prev =>
        prev.map(d => {
          if (d.employees?.some(e => e._id === confirmDelete.empId)) {
            return { ...d, employees: d.employees.filter(e => e._id !== confirmDelete.empId) };
          }
          return d;
        })
      );
      setCurrentEmployees(prev => prev.filter(e => e._id !== confirmDelete.empId));
      setConfirmDelete({ open: false, empId: null, empName: "" });
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      <h2 className={`text-4xl font-extrabold mb-10 text-center ${isDark ? "text-white" : "text-gray-900"}`}>
        City Departments
      </h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((dept) => (
          <div
            key={dept.name}
            className={`relative rounded-2xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105
            ${isDark ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white" : "bg-white text-gray-900"}`}
          >
            <div className={`absolute top-0 left-0 w-full h-2 ${isDark ? "bg-indigo-500" : "bg-blue-500"}`}></div>
            <div className="py-5 px-6">
              <h4 className="text-2xl font-bold mb-3">{dept.name}</h4>
              <p className={`text-sm mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{`Head: ${dept.head}`}</p>
              <p className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{`Email: ${dept.email}`}</p>

              <span className={`font-semibold block mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Problems Solved:</span>
              <div className="flex flex-wrap gap-2">
                {(departmentCategoryMap.get(dept.name) || []).map((cat, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
                      ${isDark
                        ? "bg-gray-700 text-white hover:bg-indigo-500 hover:text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white"}`}
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex gap-2">
  <button
    onClick={() => openAddEmployeeModal(dept.name)}
    className={`flex-1 py-2 rounded-xl font-semibold text-white text-sm transition transform duration-300
      ${isDark 
        ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 shadow-lg" 
        : "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-teal-500 hover:to-blue-500 shadow-md"} 
      hover:scale-105`}
  >
    ADD EMPLOYEE
  </button>

  <button
    onClick={() => openShowEmployeesModal(dept.employees)}
    className={`flex-1 py-2 rounded-xl font-semibold text-white text-sm transition transform duration-300
      ${isDark 
        ?  
        "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-teal-500 hover:to-blue-500 shadow-md":"bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 shadow-lg"} 
      hover:scale-105`}
  >
    SHOW EMPLOYEES
  </button>
</div>

            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg w-96 ${isDark ? "bg-gray-600 text-white" : "bg-white text-black"}`}>
            <h3 className="text-xl font-bold mb-4">Add Employee to {selectedDept}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input type="text" name="name" placeholder="Name" value={employeeForm.name} onChange={handleChange} className={`p-2 border rounded ${isDark?'bg-[rgba(51,51,51,1)] border-[rgba(51,51,51,1)]':''}`} required />
              <input type="email" name="email" placeholder="Email" value={employeeForm.email} onChange={handleChange} className={`p-2 border rounded ${isDark?'bg-[rgba(51,51,51,1)] border-[rgba(51,51,51,1)]':''}`} required />
              <input type="password" name="password" placeholder="Password" value={employeeForm.password} onChange={handleChange} className={`p-2 border rounded ${isDark?'bg-[rgba(51,51,51,1)] border-[rgba(51,51,51,1)]':''}`} required />
              <input type="text" name="phone" placeholder="Phone" value={employeeForm.phone} onChange={handleChange} className={`p-2 border rounded ${isDark?'bg-[rgba(51,51,51,1)] border-[rgba(51,51,51,1)]':''}`} required />
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Show Employees Modal */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg w-96 ${isDark ? "bg-gray-600 text-white" : "bg-white text-black"}`}>
            <h3 className="text-xl font-bold mb-4">Employees</h3>
            {currentEmployees.length > 0 ? (
              currentEmployees.map(emp => (
                <div key={emp._id} className={`p-2 mb-2 rounded flex justify-between items-center ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                  <div>
                    <p className="font-semibold">{emp.name}</p>
                    <p className="text-sm">{emp.email}</p>
                    <p className="text-sm">{emp.phone}</p>
                  </div>
                  <button onClick={() => setConfirmDelete({ open: true, empId: emp._id, empName: emp.name })}>
                    <Trash2 className="text-red-500" />
                  </button>
                </div>
              ))
            ) : (
              <p>No employees in this department.</p>
            )}
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowEmployeeModal(false)} className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg w-80 ${isDark ? "bg-gray-600 text-white" : "bg-white text-black"}`}>
            <h3 className="text-lg font-bold mb-4">Remove Employee</h3>
            <p>Are you sure you want to remove <strong>{confirmDelete.empName}</strong> from duty?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setConfirmDelete({ open: false, empId: null, empName: "" })} className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500">
                Cancel
              </button>
              <button onClick={handleDeleteEmployee} className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white">
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
