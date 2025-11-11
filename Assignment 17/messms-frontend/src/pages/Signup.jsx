import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Server error, try again later.");
    }
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "50px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#fff",
    }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "5px" }}
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "5px" }}
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "5px" }}
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          style={{ width: "100%", padding: "10px", margin: "10px 0", borderRadius: "5px" }}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#27ae60",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }} type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
