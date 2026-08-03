import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["GENERAL", "SCHEDULE", "IMPORTANT", "WINNERS"],
      default: "GENERAL",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    author: {
      type: String,
      default: "AMS HACKATHON 2026 Committee",
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;
