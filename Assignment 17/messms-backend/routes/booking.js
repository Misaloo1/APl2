import express from "express";
import Booking from "../models/Booking.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a booking (user only)
router.post("/", verifyToken, async (req, res) => {
  const { items, totalPrice } = req.body;
  try {
    const newBooking = new Booking({ userId: req.user.id, items, totalPrice });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all bookings for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate("items.menuId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
