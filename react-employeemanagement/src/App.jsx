import { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import SearchBar from "./components/SearchBar";

const initialEmployees = [
  {
    id: 1,
    name: "John David",
    position: "Software Engineer",
    department: "IT",
    email: "john@gmail.com",
    phone: "9876543210",
    salary: 80000,
  },
  {
    id: 2,
    name: "Priya Sharma",
    position: "HR Manager",
    department: "HR",
    email: "priya@gmail.com",
    phone: "9876543201",
    salary: 65000,
  },
  {
    id: 3,
    name: "Arun Kumar",
    position: "UI Designer",
    department: "Design",
    email: "arun@gmail.com",
    phone: "9876543202",
    salary: 70000,
  },
];

function App() {
  const [employees, setEmployees] = useState(initialEmployees);

  const [search, setSearch] = useState("");

  const [editingEmployee, setEditingEmployee] = useState(null);

  const addEmployee = (employee) => {
    if (editingEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editingEmployee.id
            ? { ...employee, id: editingEmployee.id }
            : emp
        )
      );

      setEditingEmployee(null);
    } else {
      setEmployees([
        ...employees,
        {
          ...employee,
          id: Date.now(),
        },
      ]);
    }
  };

  const deleteEmployee = (id) => {    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const editEmployee = (employee) => {
    setEditingEmployee(employee);
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">

      <Navbar />

      <Dashboard employees={employees} />

      <SearchBar search={search} setSearch={setSearch} />

      <EmployeeForm
        addEmployee={addEmployee}
        editingEmployee={editingEmployee}
      />

      <EmployeeList
        employees={filteredEmployees}
        deleteEmployee={deleteEmployee}
        editEmployee={editEmployee}
      />

    </div>
  );
}

export default App;