import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const containerStyle = {
    minHeight: "100vh",
    backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  };

  const cardStyle = {
    maxWidth: "850px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "15px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    padding: "30px",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const hoverEffect = {
    transform: "scale(1.02)",
    boxShadow: "0 12px 20px rgba(0,0,0,0.3)",
  };

  const [hover, setHover] = React.useState(false);

  return (
    <div style={containerStyle}>
      <div
        style={hover ? { ...cardStyle, ...hoverEffect } : cardStyle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <h1 style={{ color: "#2c3e50", marginBottom: "15px" }}>🍽 Welcome to MessMS</h1>
        <p style={{ fontSize: "18px", color: "#555", marginBottom: "25px" }}>
          A smart and efficient way to manage your daily mess operations — from meal tracking to payments.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
          <img
            src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=400&q=80"
            alt="Mess Food"
            style={{
              width: "250px",
              height: "160px",
              borderRadius: "10px",
              objectFit: "cover",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          />
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80"
            alt="Dining Area"
            style={{
              width: "250px",
              height: "160px",
              borderRadius: "10px",
              objectFit: "cover",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          />
          <img
            src="https://images.unsplash.com/photo-1606851092805-9e3f06e6bdf4?auto=format&fit=crop&w=400&q=80"
            alt="Mess Staff"
            style={{
              width: "250px",
              height: "160px",
              borderRadius: "10px",
              objectFit: "cover",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        <p
          style={{
            marginTop: "30px",
            color: "#2c3e50",
            cursor: "pointer",
            textDecoration: "underline",
            fontWeight: "bold",
          }}
          onClick={() => navigate("/login")}
        >
          Navigate to Login to access your personalized dashboard
        </p>
      </div>
    </div>
  );
}

export default Home;
