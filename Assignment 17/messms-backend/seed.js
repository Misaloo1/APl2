import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import Menu from "./models/Menu.js";

dotenv.config();

async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminUsername = "admin";
    const userUsername = "user";

    const adminExists = await User.findOne({ username: adminUsername });
    if (!adminExists) {
      const adminPassword = await bcrypt.hash("admin123", 10);
      await User.create({ username: adminUsername, password: adminPassword, role: "admin" });
      console.log("✅ Created admin: admin/admin123");
    } else {
      console.log("ℹ️ Admin already exists");
    }

    const userExists = await User.findOne({ username: userUsername });
    if (!userExists) {
      const userPassword = await bcrypt.hash("user123", 10);
      await User.create({ username: userUsername, password: userPassword, role: "user" });
      console.log("✅ Created user: user/user123");
    } else {
      console.log("ℹ️ User already exists");
    }

    const menuCount = await Menu.countDocuments();
    if (menuCount === 0) {
      await Menu.insertMany([
        { name: "Chicken Curry", price: 120, description: "Spicy and flavorful" },
        { name: "Veg Thali", price: 100, description: "Dal, sabzi, roti, rice" },
        { name: "Paneer Butter Masala", price: 140, description: "Rich and creamy" },
      ]);
      console.log("✅ Inserted sample menu items");
    } else {
      console.log("ℹ️ Menu already has items");
    }

    await mongoose.disconnect();
    console.log("✅ Seed completed");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

runSeed();
