import { useState, useEffect } from "react";

function EmployeeForm({ addEmployee, editingEmployee }) {
  const [employee, setEmployee] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    salary: "",
  });

  useEffect(() => {
    if (editingEmployee) {
      setEmployee(editingEmployee);
    }
  }, [editingEmployee]);

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !employee.name ||
      !employee.position ||
      !employee.department ||
      !employee.email ||
      !employee.phone ||
      !employee.salary
    ) {
      alert("Please fill all fields.");
      return;
    }

    addEmployee(employee);

    setEmployee({
      name: "",
      position: "",
      department: "",
      email: "",
      phone: "",
      salary: "",
    });
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <h2>
        {editingEmployee ? "Edit Employee" : "Add New Employee"}
      </h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Employee Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter employee name"
            value={employee.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Position</label>
          <input
            type="text"
            name="position"
            placeholder="Software Engineer"
            value={employee.position}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <select
            name="department"
            value={employee.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Design">Design</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="employee@email.com"
            value={employee.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="9876543210"
            value={employee.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Salary</label>
          <input
            type="number"
            name="salary"
            placeholder="50000"
            value={employee.salary}
            onChange={handleChange}
          />
        </div>
      </div>

      <button type="submit" className="submit-btn">
        {editingEmployee ? "Update Employee" : "Add Employee"}
      </button>
    </form>
  );
}

export default EmployeeForm;