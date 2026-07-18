import API from "./api";

// Get all employees
export const getEmployees = () => API.get("/Employees");

// Add employee
export const addEmployee = (employee) =>
  API.post("/Employees", employee);

// Update employee
export const updateEmployee = (id, employee) =>
  API.put(`/Employees/${id}`, employee);

// Delete employee
export const deleteEmployee = (id) =>
  API.delete(`/Employees/${id}`);