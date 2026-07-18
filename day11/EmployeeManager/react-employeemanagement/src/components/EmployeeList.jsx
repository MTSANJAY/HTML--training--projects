import EmployeeCard from "./EmployeeCard";

function EmployeeList({
  employees,
  deleteEmployee,
  editEmployee,
}) {
  if (employees.length === 0) {
    return (
      <div className="empty">
        <h2>No Employees Found</h2>
        <p>Add a new employee to get started.</p>
      </div>
    );
  }

  return (
    <div className="employee-grid">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          deleteEmployee={deleteEmployee}
          editEmployee={editEmployee}
        />
      ))}
    </div>
  );
}

export default EmployeeList;