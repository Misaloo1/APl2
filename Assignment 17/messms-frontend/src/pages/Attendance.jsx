import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Attendance() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);
  const [pending, setPending] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState([]);

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

  const submitRequest = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lunchRequested: lunch, dinnerRequested: dinner, date }),
      });
      if (!res.ok) {
        const text = await res.text();
        alert(text.slice(0, 200) || "Failed to submit request");
        return;
      }
      await Promise.all([loadRecords(), loadMyRequests()]);
      alert("Request sent");
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  const requestLunch = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lunchRequested: true, dinnerRequested: false, date }),
      });
      
      if (!res.ok) {
        const text = await res.text();
        let errorMsg = "Failed to request lunch";
        try {
          const json = JSON.parse(text);
          errorMsg = json.message || errorMsg;
        } catch {
          errorMsg = text.slice(0, 200) || errorMsg;
        }
        alert(errorMsg);
        return;
      }
      
      const data = await res.json();
      await Promise.all([loadRecords(), loadMyRequests()]);
      alert("Lunch requested successfully!");
    } catch (err) { 
      alert("Network error: " + err.message); 
    }
  };

  const requestDinner = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lunchRequested: false, dinnerRequested: true, date }),
      });
      
      if (!res.ok) {
        const text = await res.text();
        let errorMsg = "Failed to request dinner";
        try {
          const json = JSON.parse(text);
          errorMsg = json.message || errorMsg;
        } catch {
          errorMsg = text.slice(0, 200) || errorMsg;
        }
        alert(errorMsg);
        return;
      }
      
      const data = await res.json();
      await Promise.all([loadRecords(), loadMyRequests()]);
      alert("Dinner requested successfully!");
    } catch (err) { 
      alert("Network error: " + err.message); 
    }
  };

  const loadRecords = async () => {
    try {
      const today = new Date(date);
      const y = today.getFullYear();
      const m = today.getMonth();
      const res = await fetch(`http://localhost:5000/api/attendance/me?year=${y}&month=${m}` , {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRecords(data);
    } catch (_) {}
  };

  useEffect(() => { loadRecords(); }, [date]);

  const loadMyRequests = async () => {
    try {
      const today = new Date(date);
      const y = today.getFullYear();
      const m = today.getMonth();
      const res = await fetch(`http://localhost:5000/api/requests/me?year=${y}&month=${m}` , {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const todayRec = data.find((r) => new Date(r.date).toDateString() === new Date(date).toDateString());
      setPending(todayRec || null);
    } catch (_) {}
  };

  useEffect(() => { loadMyRequests(); }, [date]);

  return (
    <div style={{ maxWidth: 600, margin: "30px auto" }}>
      <h2>Attendance</h2>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <button 
          onClick={requestLunch}
          style={{ 
            padding: "8px 16px", 
            backgroundColor: "#27ae60", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Request Lunch
        </button>
        <button 
          onClick={requestDinner}
          style={{ 
            padding: "8px 16px", 
            backgroundColor: "#e74c3c", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Request Dinner
        </button>
      </div>

      <h3>This Month</h3>
      {pending && (
        <p>
          Today Request — Lunch: {pending.lunchRequested ? pending.lunchStatus : "-"},
          Dinner: {pending.dinnerRequested ? pending.dinnerStatus : "-"}
        </p>
      )}
      <ul>
        {records.map((r) => (
          <li key={r._id}>{new Date(r.date).toDateString()} — L: {r.lunch ? "Yes" : "No"}, D: {r.dinner ? "Yes" : "No"}</li>
        ))}
      </ul>
    </div>
  );
}

export default Attendance;
