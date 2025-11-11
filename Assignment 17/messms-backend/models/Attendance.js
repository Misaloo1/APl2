import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  lunch: { type: Boolean, default: true },
  dinner: { type: Boolean, default: true },
}, {
  timestamps: true,
  indexes: [{ key: { userId: 1, date: 1 }, unique: true }]
});

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
