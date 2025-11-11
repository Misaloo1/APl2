import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [byDate, setByDate] = useState({});
  const [monthly, setMonthly] = useState({});
  const [pending, setPending] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Check token expiration and redirect
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (Date.now() >= decoded.exp * 1000) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch all users (admin)
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.log("Error fetching users", err);
      }
    };
    if (token) loadUsers();
  }, [token]);

  // Load attendance check state for selected date
  useEffect(() => {
    const loadByDate = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/attendance/by-date?date=${date}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setByDate(data);
      } catch (_) {}
    };
    if (token) loadByDate();
  }, [token, date]);

  // Load pending requests for the selected date
  useEffect(() => {
    const loadPending = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/requests/pending?date=${date}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPending(Array.isArray(data) ? data : []);
      } catch (_) {
        setPending([]);
      }
    };
    if (token) loadPending();
  }, [token, date]);

  // Load monthly counts
  useEffect(() => {
    const today = new Date(date);
    const y = today.getFullYear();
    const m = today.getMonth();
    const loadMonthly = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/attendance/monthly?year=${y}&month=${m}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMonthly(data);
      } catch (_) {}
    };
    if (token) loadMonthly();
  }, [token, date]);

  const markForUser = async (userId, field, value) => {
    try {
      const payload = { lunch: false, dinner: false, date };
      payload[field] = value;
      const res = await fetch(`http://localhost:5000/api/users/${userId}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.json();
        alert(msg.message || "Failed to update attendance");
        return;
      }
      // Refresh date and monthly summaries after change
      const [byDateRes, monthlyRes] = await Promise.all([
        fetch(`http://localhost:5000/api/users/attendance/by-date?date=${date}`, { headers: { Authorization: `Bearer ${token}` } }),
        (() => { const t = new Date(date); return fetch(`http://localhost:5000/api/users/attendance/monthly?year=${t.getFullYear()}&month=${t.getMonth()}` , { headers: { Authorization: `Bearer ${token}` } }); })(),
      ]);
      const [byDateData, monthlyData] = await Promise.all([byDateRes.json(), monthlyRes.json()]);
      setByDate(byDateData);
      setMonthly(monthlyData);
    } catch (_) {
      alert("Server error");
    }
  };

  // Admin approve/reject request
  const takeAction = async (requestId, meal, action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${requestId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ meal, action }),
      });
      if (!res.ok) {
        const msg = await res.json();
        alert(msg.message || "Failed to update request");
        return;
      }
      // Refresh all dependent data
      const [byDateRes, monthlyRes, pendingRes] = await Promise.all([
        fetch(`http://localhost:5000/api/users/attendance/by-date?date=${date}`, { headers: { Authorization: `Bearer ${token}` } }),
        (() => { const t = new Date(date); return fetch(`http://localhost:5000/api/users/attendance/monthly?year=${t.getFullYear()}&month=${t.getMonth()}` , { headers: { Authorization: `Bearer ${token}` } }); })(),
        fetch(`http://localhost:5000/api/requests/pending?date=${date}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [byDateData, monthlyData, pendingData] = await Promise.all([byDateRes.json(), monthlyRes.json(), pendingRes.json()]);
      setByDate(byDateData);
      setMonthly(monthlyData);
      setPending(Array.isArray(pendingData) ? pendingData : []);
    } catch (_) {
      alert("Server error");
    }
  };

  return (
    <>
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <div style={{ margin: "12px 0" }}>
        <label>
          Date: <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>User</th>
            <th style={{ textAlign: "center", borderBottom: "1px solid #ddd", padding: 8 }}>Lunch</th>
            <th style={{ textAlign: "center", borderBottom: "1px solid #ddd", padding: 8 }}>Dinner</th>
            <th style={{ textAlign: "center", borderBottom: "1px solid #ddd", padding: 8 }}>L Count</th>
            <th style={{ textAlign: "center", borderBottom: "1px solid #ddd", padding: 8 }}>D Count</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td style={{ padding: 8 }}>{u.username} ({u.role})</td>
              <td style={{ padding: 8, textAlign: "center" }}>
                <input type="checkbox" checked={!!byDate[u._id]?.lunch} onChange={(e) => markForUser(u._id, "lunch", e.target.checked)} />
              </td>
              <td style={{ padding: 8, textAlign: "center" }}>
                <input type="checkbox" checked={!!byDate[u._id]?.dinner} onChange={(e) => markForUser(u._id, "dinner", e.target.checked)} />
              </td>
              <td style={{ padding: 8, textAlign: "center" }}>{monthly[u._id]?.lunchCount || 0}</td>
              <td style={{ padding: 8, textAlign: "center" }}>{monthly[u._id]?.dinnerCount || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div style={{ padding: 20 }}>
      <h2>Pending Requests (Selected Date)</h2>
      {pending.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>User</th>
              <th style={{ textAlign: "center", borderBottom: "1px solid #ddd", padding: 8 }}>Lunch</th>
              <th style={{ textAlign: "center", borderBottom: "1px solid #ddd", padding: 8 }}>Dinner</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((r) => (
              <tr key={r._id}>
                <td style={{ padding: 8 }}>{(r.userId && (r.userId.name || r.userId.username)) || r.userId}</td>
                <td style={{ padding: 8, textAlign: "center" }}>
                  {r.lunchRequested ? (
                    r.lunchStatus === "pending" ? (
                      <div>
                        <button onClick={() => takeAction(r._id, "lunch", "approved")}>Approve</button>
                        <button style={{ marginLeft: 8 }} onClick={() => takeAction(r._id, "lunch", "rejected")}>Reject</button>
                      </div>
                    ) : (
                      <span>{r.lunchStatus}</span>
                    )
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td style={{ padding: 8, textAlign: "center" }}>
                  {r.dinnerRequested ? (
                    r.dinnerStatus === "pending" ? (
                      <div>
                        <button onClick={() => takeAction(r._id, "dinner", "approved")}>Approve</button>
                        <button style={{ marginLeft: 8 }} onClick={() => takeAction(r._id, "dinner", "rejected")}>Reject</button>
                      </div>
                    ) : (
                      <span>{r.dinnerStatus}</span>
                    )
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </>
  );
}

export default AdminDashboard;
