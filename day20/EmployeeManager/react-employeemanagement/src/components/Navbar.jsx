import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

function Navbar({ user, role, onLogout }) {
  return (
    <nav className="navbar">
      <div className="logo">
        Employee<span>Hub</span>
      </div>

      <div className="nav-right">
        <div className="icon" title="Notifications">
          <FaBell />
        </div>

        <div className="profile">
          <FaUserCircle size={40} />
          <div>
            <h4>{user ? user.name : "Guest"}</h4>
            <p>{role === "admin" ? "HR Manager" : (user ? user.position : "Employee")}</p>
          </div>
        </div>

        {onLogout && (
          <button className="logout-btn" onClick={onLogout} title="Logout">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;