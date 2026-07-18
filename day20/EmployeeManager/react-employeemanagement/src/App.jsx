import { useState, useEffect } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import SearchBar from "./components/SearchBar";
import Login from "./components/Login";
import EmployeeProfile from "./components/EmployeeProfile";
import LeaveRequests from "./components/LeaveRequests";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "./services/employeeservices";

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin' or 'employee'
  const [activeTab, setActiveTab] = useState("directory"); // 'directory'/'profile' or 'leaves'

  // Leave Requests state persisted in localStorage
  const [leaveRequests, setLeaveRequests] = useState(() => {
    const saved = localStorage.getItem("leaveRequests");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default Sanjay M example record
    return [
      {
        id: "1001",
        leaveId: "1001",
        employeeId: "1", // rajkumar/ram kumar's ID
        employeeName: "Sanjay M",
        leaveType: "Casual Leave",
        startDate: "20-07-2026",
        endDate: "22-07-2026",
        totalDays: 3,
        reason: "Family Function",
        appliedDate: "17-07-2026",
        status: "Pending"
      }
    ];
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    localStorage.setItem("leaveRequests", JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployees();
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to fetch employees. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (loggedInUser, userRole) => {
    setUser(loggedInUser);
    setRole(userRole);
    setActiveTab(userRole === "admin" ? "directory" : "profile");
  };

  const handleLogout = () => {
    setUser(null);
    setRole(null);
  };

  const handleAddOrUpdateEmployee = async (employeeData) => {
    try {
      if (editingEmployee) {
        const response = await updateEmployee(editingEmployee.id, employeeData);
        setEmployees(
          employees.map((emp) =>
            emp.id === editingEmployee.id ? response.data : emp
          )
        );
        setEditingEmployee(null);
      } else {
        const response = await addEmployee(employeeData);
        setEmployees([...employees, response.data]);
      }
    } catch (err) {
      console.error("Error saving employee:", err);
      alert("Failed to save employee. Please try again.");
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const response = await updateEmployee(updatedData.id, updatedData);
      setEmployees(
        employees.map((emp) =>
          emp.id === updatedData.id ? response.data : emp
        )
      );
      setUser(response.data);
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err;
    }
  };

  const handleApplyLeave = (newLeave) => {
    const nextId = String(
      leaveRequests.reduce((max, req) => Math.max(max, Number(req.leaveId || req.id || 1000)), 1000) + 1
    );
    const leaveRecord = {
      id: nextId,
      leaveId: nextId,
      status: "Pending",
      ...newLeave,
    };
    setLeaveRequests([leaveRecord, ...leaveRequests]);
  };

  const handleUpdateLeaveStatus = (leaveId, status, comments, approvedBy) => {
    const today = new Date();
    const approvalDate = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
    
    setLeaveRequests(
      leaveRequests.map((req) => {
        if (String(req.id || req.leaveId) === String(leaveId)) {
          return {
            ...req,
            status,
            comments,
            approvedBy,
            approvalDate,
          };
        }
        return req;
      })
    );
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id);
        setEmployees(employees.filter((emp) => emp.id !== id));
      } catch (err) {
        console.error("Error deleting employee:", err);
        alert("Failed to delete employee. Please try again.");
      }
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
  };

  const filteredEmployees = employees.filter((emp) => {
    const name = emp.name || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Navbar user={user} role={role} onLogout={handleLogout} />

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {role === "admin" ? (
          <>
            <button
              className={`nav-tab-btn ${activeTab === "directory" ? "active" : ""}`}
              onClick={() => setActiveTab("directory")}
            >
              Employee Directory
            </button>
            <button
              className={`nav-tab-btn ${activeTab === "leaves" ? "active" : ""}`}
              onClick={() => setActiveTab("leaves")}
            >
              Leave Requests
            </button>
          </>
        ) : (
          <>
            <button
              className={`nav-tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              My Profile
            </button>
            <button
              className={`nav-tab-btn ${activeTab === "leaves" ? "active" : ""}`}
              onClick={() => setActiveTab("leaves")}
            >
              My Leaves
            </button>
          </>
        )}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {role === "admin" ? (
          activeTab === "directory" ? (
            <>
              <Dashboard employees={employees} />

              <SearchBar search={search} setSearch={setSearch} />

              <EmployeeForm
                addEmployee={handleAddOrUpdateEmployee}
                editingEmployee={editingEmployee}
              />

              {loading && <div className="loading">Loading employees...</div>}
              {error && <div className="error-message">{error}</div>}

              {!loading && !error && (
                <EmployeeList
                  employees={filteredEmployees}
                  deleteEmployee={handleDeleteEmployee}
                  editEmployee={handleEditEmployee}
                />
              )}
            </>
          ) : (
            <LeaveRequests
              user={user}
              role={role}
              leaveRequests={leaveRequests}
              onApplyLeave={handleApplyLeave}
              onUpdateLeaveStatus={handleUpdateLeaveStatus}
            />
          )
        ) : (
          activeTab === "profile" ? (
            <EmployeeProfile employee={user} onUpdateProfile={handleUpdateProfile} />
          ) : (
            <LeaveRequests
              user={user}
              role={role}
              leaveRequests={leaveRequests}
              onApplyLeave={handleApplyLeave}
              onUpdateLeaveStatus={handleUpdateLeaveStatus}
            />
          )
        )}
      </div>
    </div>
  );
}

export default App;