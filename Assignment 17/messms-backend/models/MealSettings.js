import mongoose from "mongoose";

const mealSettingsSchema = new mongoose.Schema({
  priceLunch: { type: Number, required: true, default: 0 },
  priceDinner: { type: Number, required: true, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("MealSettings", mealSettingsSchema);
