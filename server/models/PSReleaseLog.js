import mongoose from "mongoose";

const psReleaseLogSchema = new mongoose.Schema(
  {
    releaseKey: {
      type: String,
      required: [true, "Release key is required"],
      unique: true,
      trim: true,
      index: true,
    },
    recipientCount: {
      type: Number,
      default: 0,
    },
    succeededCount: {
      type: Number,
      default: 0,
    },
    failedCount: {
      type: Number,
      default: 0,
    },
    triggeredBy: {
      type: String,
      default: "cron",
      trim: true,
    },
    releasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const PSReleaseLog =
  mongoose.models.PSReleaseLog || mongoose.model("PSReleaseLog", psReleaseLogSchema);
export default PSReleaseLog;
