import { Link } from "react-router-dom";

function Navbar() {
  const navStyle = {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const linkStyle = { color: "white", textDecoration: "none", marginLeft: "20px" };

  return (
    <nav style={navStyle}>
      <h2>MessMS</h2>
      <div>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/login" style={linkStyle}>Login</Link>
        <Link to="/signup" style={linkStyle}>Sign Up</Link>
        <Link to="/attendance" style={linkStyle}>Attendance</Link>
        <Link to="/bill" style={linkStyle}>My Bill</Link>
        <Link to="/admin/settings" style={linkStyle}>Admin Settings</Link>
      </div>
    </nav>
  );
}

export default Navbar;
