import { useState } from "react";

function EmployeeProfile({ employee, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(employee.email || "");
  const [phone, setPhone] = useState(employee.phone || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdateProfile({
        ...employee,
        email,
        phone,
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card-large">
        <div className="profile-header-large">
          <div className="avatar-large">
            {employee.name ? employee.name.charAt(0).toUpperCase() : "?"}
          </div>
          <h2>{employee.name}</h2>
          <p className="profile-role">{employee.position}</p>
          <span className="profile-dept">{employee.department}</span>
        </div>

        {!isEditing ? (
          <div className="profile-details">
            <div className="detail-item">
              <span className="label">Email</span>
              <span className="value">{employee.email}</span>
            </div>
            <div className="detail-item">
              <span className="label">Phone</span>
              <span className="value">{employee.phone}</span>
            </div>
            <div className="detail-item">
              <span className="label">Salary</span>
              <span className="value">₹{Number(employee.salary || 0).toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Employee ID</span>
              <span className="value">#{employee.id}</span>
            </div>
            
            <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
              Edit Contact Info
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="profile-edit-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="profile-form-actions">
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEmail(employee.email || "");
                  setPhone(employee.phone || "");
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EmployeeProfile;
