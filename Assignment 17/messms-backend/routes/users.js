import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// List all users (admin)
router.get("/", verifyToken, isAdmin, async (_req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ username: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin mark attendance for a user
router.post("/:userId/attendance", verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { lunch = false, dinner = false, date } = req.body;
    const targetDate = date ? new Date(date) : new Date();
    const start = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    const attendance = await Attendance.findOneAndUpdate(
      { userId, date: start },
      { $set: { lunch: !!lunch, dinner: !!dinner, date: start } },
      { new: true, upsert: true }
    );

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
 
// Get attendance for all users on a specific date (admin)
router.get("/attendance/by-date", verifyToken, isAdmin, async (req, res) => {
  try {
    const { date } = req.query;
    const target = date ? new Date(date) : new Date();
    const start = new Date(target.getFullYear(), target.getMonth(), target.getDate());

    const records = await Attendance.find({ date: start });
    const byUser = {};
    for (const r of records) {
      byUser[r.userId.toString()] = { lunch: !!r.lunch, dinner: !!r.dinner };
    }
    res.json(byUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get monthly counts for all users (admin)
router.get("/attendance/monthly", verifyToken, isAdmin, async (req, res) => {
  try {
    const now = new Date();
    const y = req.query.year ? parseInt(req.query.year, 10) : now.getFullYear();
    const m = req.query.month ? parseInt(req.query.month, 10) : now.getMonth();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 1);

    const records = await Attendance.find({ date: { $gte: start, $lt: end } });
    const counts = {};
    for (const r of records) {
      const id = r.userId.toString();
      if (!counts[id]) counts[id] = { lunchCount: 0, dinnerCount: 0 };
      if (r.lunch) counts[id].lunchCount += 1;
      if (r.dinner) counts[id].dinnerCount += 1;
    }
    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
