import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import menuRoutes from "./routes/menu.js";
import bookingRoutes from "./routes/booking.js";
import attendanceRoutes from "./routes/attendance.js";
import usersRoutes from "./routes/users.js";
import requestsRoutes from "./routes/requests.js";



import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
// Add below authRoutes
app.use("/api/menu", menuRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/requests", requestsRoutes);
const PORT = process.env.PORT || 5000;
// db

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Error:", err));

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

