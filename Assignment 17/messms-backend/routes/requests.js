import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import MealRequest from "../models/MealRequest.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// Health check for this route
router.get("/", (_req, res) => {
  res.json({ ok: true, message: "Requests route is mounted" });
});

// User: submit or update request for a date
router.post("/", verifyToken, async (req, res) => {
  try {
    const { date, lunchRequested = false, dinnerRequested = false } = req.body;
    const target = date ? new Date(date) : new Date();
    const start = new Date(target.getFullYear(), target.getMonth(), target.getDate());

    const request = await MealRequest.findOneAndUpdate(
      { userId: req.user.id, date: start },
      { $set: { lunchRequested: !!lunchRequested, dinnerRequested: !!dinnerRequested, date: start, lunchStatus: "pending", dinnerStatus: "pending" } },
      { new: true, upsert: true }
    );

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User: my requests (optionally for month)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const now = new Date();
    const y = req.query.year ? parseInt(req.query.year, 10) : now.getFullYear();
    const m = req.query.month ? parseInt(req.query.month, 10) : now.getMonth();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 1);

    const requests = await MealRequest.find({ userId: req.user.id, date: { $gte: start, $lt: end } }).sort({ date: 1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: list pending requests (for a date or month)
router.get("/pending", verifyToken, isAdmin, async (req, res) => {
  try {
    const { date } = req.query;
    if (date) {
      const target = new Date(date);
      const start = new Date(target.getFullYear(), target.getMonth(), target.getDate());
      const requests = await MealRequest.find({ date: start, $or: [{ lunchStatus: "pending" }, { dinnerStatus: "pending" }] }).populate("userId", "username name role");
      return res.json(requests);
    }
    const now = new Date();
    const y = req.query.year ? parseInt(req.query.year, 10) : now.getFullYear();
    const m = req.query.month ? parseInt(req.query.month, 10) : now.getMonth();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 1);

    const requests = await MealRequest.find({ date: { $gte: start, $lt: end }, $or: [{ lunchStatus: "pending" }, { dinnerStatus: "pending" }] }).populate("userId", "username name role");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: approve/reject a request's lunch or dinner and update attendance
router.post("/:requestId/action", verifyToken, isAdmin, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { meal, action } = req.body; // meal: 'lunch' | 'dinner', action: 'approved' | 'rejected'
    if (!['lunch', 'dinner'].includes(meal)) return res.status(400).json({ message: 'Invalid meal' });
    if (!['approved', 'rejected'].includes(action)) return res.status(400).json({ message: 'Invalid action' });

    const request = await MealRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (meal === 'lunch') request.lunchStatus = action;
    if (meal === 'dinner') request.dinnerStatus = action;
    await request.save();

    if (action === 'approved') {
      const value = meal === 'lunch' ? { lunch: true } : { dinner: true };
      const start = request.date;
      await Attendance.findOneAndUpdate(
        { userId: request.userId, date: start },
        { $setOnInsert: { date: start, userId: request.userId }, $set: value },
        { new: true, upsert: true }
      );
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
