import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AdminSettings() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [priceLunch, setPriceLunch] = useState(0);
  const [priceDinner, setPriceDinner] = useState(0);
  const [userId, setUserId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [bill, setBill] = useState(null);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") { navigate("/"); return; }
      if (Date.now() >= decoded.exp * 1000) { localStorage.removeItem("token"); navigate("/login"); }
    } catch (_) { localStorage.removeItem("token"); navigate("/login"); }
  }, [token, navigate]);

  const saveSettings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/attendance/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ priceLunch: Number(priceLunch), priceDinner: Number(priceDinner) })
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Failed to save settings"); return; }
      alert("Settings saved");
    } catch (_) { alert("Server error"); }
  };

  const computeBill = async () => {
    try {
      if (!userId) { alert("Enter userId"); return; }
      const res = await fetch(`http://localhost:5000/api/attendance/bill/${userId}?year=${year}&month=${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Failed to fetch bill"); return; }
      setBill(data);
    } catch (_) { alert("Server error"); }
  };

  return (
    <div style={{ maxWidth: 720, margin: "30px auto" }}>
      <h2>Admin: Meal Settings</h2>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <label>Lunch Price: <input type="number" value={priceLunch} onChange={(e) => setPriceLunch(e.target.value)} /></label>
        <label>Dinner Price: <input type="number" value={priceDinner} onChange={(e) => setPriceDinner(e.target.value)} /></label>
        <button onClick={saveSettings}>Save</button>
      </div>

      <h3>Compute User Bill</h3>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <label>User ID: <input value={userId} onChange={(e) => setUserId(e.target.value)} /></label>
        <label>Year: <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} /></label>
        <label>Month: <input type="number" min={0} max={11} value={month} onChange={(e) => setMonth(Number(e.target.value))} /></label>
        <button onClick={computeBill}>Compute</button>
      </div>

      {bill && (
        <div>
          <p>Lunches: {bill.lunchCount} × {bill.priceLunch} = {bill.lunchCount * bill.priceLunch}</p>
          <p>Dinners: {bill.dinnerCount} × {bill.priceDinner} = {bill.dinnerCount * bill.priceDinner}</p>
          <h3>Total: {bill.totalAmount}</h3>
        </div>
      )}
    </div>
  );
}

export default AdminSettings;
