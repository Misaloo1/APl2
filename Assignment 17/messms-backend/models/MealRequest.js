import mongoose from "mongoose";

const mealRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  lunchRequested: { type: Boolean, default: false },
  dinnerRequested: { type: Boolean, default: false },
  lunchStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  dinnerStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

mealRequestSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("MealRequest", mealRequestSchema);
