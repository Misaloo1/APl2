import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import Attendance from "../models/Attendance.js";
import MealSettings from "../models/MealSettings.js";

const router = express.Router();

// Mark attendance for today (user)
router.post("/mark", verifyToken, async (req, res) => {
  try {
    const { lunch = false, dinner = false, date } = req.body;
    const targetDate = date ? new Date(date) : new Date();
    const start = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    const attendance = await Attendance.findOneAndUpdate(
      { userId: req.user.id, date: start },
      { $set: { lunch: !!lunch, dinner: !!dinner, date: start } },
      { new: true, upsert: true }
    );

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my attendance for a month
router.get("/me", verifyToken, async (req, res) => {
  try {
    const { year, month } = req.query; // month: 0-11
    const now = new Date();
    const y = year ? parseInt(year, 10) : now.getFullYear();
    const m = month ? parseInt(month, 10) : now.getMonth();

    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 1);

    const records = await Attendance.find({
      userId: req.user.id,
      date: { $gte: start, $lt: end },
    }).sort({ date: 1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: set meal prices
router.post("/settings", verifyToken, isAdmin, async (req, res) => {
  try {
    const { priceLunch, priceDinner } = req.body;
    const settings = await MealSettings.findOneAndUpdate(
      {},
      { $set: { priceLunch, priceDinner, updatedAt: new Date() } },
      { upsert: true, new: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: compute bill for a user for a month
router.get("/bill/:userId", verifyToken, isAdmin, async (req, res) => {
  try {
    const { year, month } = req.query;
    const { userId } = req.params;
    const now = new Date();
    const y = year ? parseInt(year, 10) : now.getFullYear();
    const m = month ? parseInt(month, 10) : now.getMonth();

    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 1);

    const settings = await MealSettings.findOne();
    if (!settings) return res.status(400).json({ message: "Meal settings not configured" });

    const records = await Attendance.find({
      userId,
      date: { $gte: start, $lt: end },
    });

    const totals = records.reduce(
      (acc, r) => {
        if (r.lunch) acc.lunchCount += 1;
        if (r.dinner) acc.dinnerCount += 1;
        return acc;
      },
      { lunchCount: 0, dinnerCount: 0 }
    );

    const totalAmount = totals.lunchCount * settings.priceLunch + totals.dinnerCount * settings.priceDinner;

    res.json({
      userId,
      year: y,
      month: m,
      lunchCount: totals.lunchCount,
      dinnerCount: totals.dinnerCount,
      priceLunch: settings.priceLunch,
      priceDinner: settings.priceDinner,
      totalAmount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
