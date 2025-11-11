import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        setRole(data.role); // update UI role
        alert("Login successful!");

        // Redirect based on role
        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Server error, try again later.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1400&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "20px",
    }}>
      <div style={{
        maxWidth: "400px",
        width: "100%",
        padding: "30px",
        borderRadius: "12px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        textAlign: "center"
      }}>
        <h2 style={{ marginBottom: "20px", color: "#2c3e50" }}>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            style={{
              width: "100%",
              padding: "12px",
              margin: "10px 0",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px"
            }}
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            style={{
              width: "100%",
              padding: "12px",
              margin: "10px 0",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px"
            }}
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "10px",
              backgroundColor: "#2980b9",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.3s ease, transform 0.2s ease"
            }}
            type="submit"
            onMouseEnter={(e) => e.target.style.backgroundColor = "#1f6391"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#2980b9"}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
