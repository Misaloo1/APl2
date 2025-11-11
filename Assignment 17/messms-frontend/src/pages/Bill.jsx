import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Bill() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (Date.now() >= decoded.exp * 1000) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (_) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [token, navigate]);

  const loadBill = async () => {
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      const res = await fetch(`http://localhost:5000/api/attendance/bill/${userId}?year=${year}&month=${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to fetch bill");
        return;
      }
      setSummary(data);
    } catch (_) {
      alert("Server error");
    }
  };

  useEffect(() => { loadBill(); }, []);

  return (
    <div style={{ maxWidth: 600, margin: "30px auto" }}>
      <h2>My Monthly Bill</h2>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <label>Year: <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} /></label>
        <label>Month: <input type="number" min={0} max={11} value={month} onChange={(e) => setMonth(Number(e.target.value))} /></label>
        <button onClick={loadBill}>Refresh</button>
      </div>
      {summary && (
        <div>
          <p>Lunches: {summary.lunchCount} × {summary.priceLunch} = {summary.lunchCount * summary.priceLunch}</p>
          <p>Dinners: {summary.dinnerCount} × {summary.priceDinner} = {summary.dinnerCount * summary.priceDinner}</p>
          <h3>Total: {summary.totalAmount}</h3>
        </div>
      )}
    </div>
  );
}

export default Bill;
