function EmployeeCard({ employee, deleteEmployee, editEmployee }) {
  return (
    <div className="employee-card">
      <div className="avatar">
        {employee.name.charAt(0).toUpperCase()}
      </div>

      <h2>{employee.name}</h2>

      <h4>{employee.position}</h4>

      <div className="info">
        <p>
          <strong>Department:</strong> {employee.department}
        </p>

        <p>
          <strong>Email:</strong> {employee.email}
        </p>

        <p>
          <strong>Phone:</strong> {employee.phone}
        </p>

        <p>
          <strong>Salary:</strong> ₹
          {Number(employee.salary).toLocaleString()}
        </p>
      </div>

      <div className="actions">
        <button
          className="edit-btn"
          onClick={() => editEmployee(employee)}
        >
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => deleteEmployee(employee.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default EmployeeCard;