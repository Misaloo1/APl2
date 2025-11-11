import express from "express";
import Menu from "../models/Menu.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all menu items (anyone can access)
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add menu item (admin only)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  const { name, price, description } = req.body;
  try {
    const newMenu = new Menu({ name, price, description });
    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
