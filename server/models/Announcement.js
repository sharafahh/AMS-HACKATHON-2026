import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Announcement title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Announcement content is required"],
      trim: true,
      maxlength: [5000, "Content cannot exceed 5000 characters"],
    },
    category: {
      type: String,
      enum: ["GENERAL", "SCHEDULE", "IMPORTANT", "WINNERS"],
      default: "GENERAL",
      index: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    author: {
      type: String,
      default: "AMS HACKATHON 2026 Committee",
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

announcementSchema.index({ isDeleted: 1, isPinned: -1, createdAt: -1 });

const Announcement = mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);
export default Announcement;
