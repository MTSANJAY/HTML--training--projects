import { FaBell, FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        Employee<span>Hub</span>
      </div>

      <div className="nav-right">
        <div className="icon">
          <FaBell />
        </div>

        <div className="profile">
          <FaUserCircle size={40} />
          <div>
            <h4>Admin</h4>
            <p>HR Manager</p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;