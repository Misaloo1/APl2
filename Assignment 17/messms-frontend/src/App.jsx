import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Attendance from "./pages/Attendance.jsx";
import Bill from "./pages/Bill.jsx";
import AdminSettings from "./pages/AdminSettings.jsx";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setRole={setRole} />} />
          <Route path="/signup" element={<Signup />} />
          {role === "admin" && <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </>}
          {role === "user" && <>
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/bill" element={<Bill />} />
          </>}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
