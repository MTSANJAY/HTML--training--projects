function Dashboard({ employees }) {
  // Total Employees
  const totalEmployees = employees.length;

  // Departments Count
  const departments = [...new Set(employees.map(emp => emp.department))].length;

  // Total Salary
  const totalSalary = employees.reduce(
    (sum, emp) => sum + (Number(emp.salary) || 0),
    0
  );

  return (
    <div className="dashboard">
      <div className="card blue">
        <h3>Total Employees</h3>
        <h1>{totalEmployees}</h1>
      </div>

      <div className="card green">
        <h3>Departments</h3>
        <h1>{departments}</h1>
      </div>

      <div className="card orange">
        <h3>Total Salary</h3>
        <h1>₹{totalSalary.toLocaleString()}</h1>
      </div>

      <div className="card red">
        <h3>Active Employees</h3>
        <h1>{totalEmployees}</h1>
      </div>
    </div>
  );
}

export default Dashboard;