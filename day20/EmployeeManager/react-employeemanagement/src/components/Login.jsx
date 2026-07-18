import { useState, useEffect } from "react";
import { getEmployees } from "../services/employeeservices";

function Login({ onLogin }) {
  const [isAdmin, setIsAdmin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await getEmployees();
        setEmployees(response.data);
      } catch (err) {
        console.error("Error pre-fetching employees for login check:", err);
      }
    };
    loadEmployees();
  }, []);

  const fallbackEmployees = [
    {
      id: "62",
      name: "rajkumar",
      email: "720823108011@hit.edu.in",
      department: "IT",
      position: "developer",
      phone: "6784653786",
      salary: "55000"
    },
    {
      id: "63",
      name: "raja",
      email: "7208231080422@hit.edu.in",
      department: "Finance",
      position: "developer",
      phone: "8838213372",
      salary: "150000"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Email and Password are required");
      return;
    }

    if (isAdmin) {
      if (cleanEmail === "admin@admin.com" && password === "admin123") {
        onLogin({ name: "Admin", email: "admin@admin.com", position: "HR Manager" }, "admin");
      } else {
        setError("Invalid Admin email or password");
      }
    } else {
      if (password !== "employee123") {
        setError("Invalid Employee name or password");
        return;
      }
      const allEmployees = employees.length > 0 ? employees : fallbackEmployees;
      const matchedEmployee = allEmployees.find(
        (emp) => 
          (emp.name && emp.name.trim().toLowerCase() === cleanEmail) ||
          (emp.email && emp.email.trim().toLowerCase() === cleanEmail)
      );
      if (matchedEmployee) {
        onLogin(matchedEmployee, "employee");
      } else {
        setError("No employee record found with this name or email");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Employee<span>Hub</span></h2>
          <p>Please log in to access your portal</p>
        </div>

        <div className="login-tabs">
          <button
            type="button"
            className={`tab-btn ${isAdmin ? "active" : ""}`}
            onClick={() => {
              setIsAdmin(true);
              setError("");
              setEmail("");
              setPassword("");
            }}
          >
            Admin Login
          </button>
          <button
            type="button"
            className={`tab-btn ${!isAdmin ? "active" : ""}`}
            onClick={() => {
              setIsAdmin(false);
              setError("");
              setEmail("");
              setPassword("");
            }}
          >
            Employee Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form-fields">
          <div className="form-group">
            <label>{isAdmin ? "Email Address" : "Employee Name"}</label>
            <input
              type="text"
              name="email"
              placeholder={isAdmin ? "admin@admin.com" : "e.g. ram kumar"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder={isAdmin ? "admin123" : "employee123"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit-btn">
            Login
          </button>
        </form>

        <div className="demo-credentials" style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '13px', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
          <strong style={{ color: '#fff', display: 'block', marginBottom: '8px' }}>Demo Credentials:</strong>
          {isAdmin ? (
            <div>
              <p style={{ margin: '3px 0' }}><strong>Email:</strong> admin@admin.com</p>
              <p style={{ margin: '3px 0' }}><strong>Password:</strong> admin123</p>
            </div>
          ) : (
            <div>
              <p style={{ margin: '3px 0' }}><strong>Employee Name:</strong> ram kumar</p>
              <p style={{ margin: '3px 0' }}><strong>Password:</strong> employee123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
