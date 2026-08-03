import Announcement from "../models/Announcement.js";

const demoAnnouncements = [
  {
    _id: "ann-1",
    title: "Registration Now Open for AMS HACKATHON 2026!",
    content: "Assemble your teams (3 to 6 members) and register online. Early registrations get dedicated mentor allocations.",
    category: "IMPORTANT",
    isPinned: true,
    author: "AMS HACKATHON 2026 Organizing Committee",
    createdAt: new Date("2026-08-01T09:00:00"),
  },
  {
    _id: "ann-2",
    title: "Smart India Hackathon Inspired Themes Released",
    content: "Explore the 12 track domains including AI & ML, Cyber Security, Space Tech, and FinTech.",
    category: "GENERAL",
    isPinned: false,
    author: "AMSCE Tech Club",
    createdAt: new Date("2026-08-01T10:30:00"),
  },
];

// @desc    Get all public announcements
// @route   GET /api/announcements
// @access  Public
export const getAnnouncements = async (req, res) => {
  try {
    let announcements = [];
    try {
      announcements = await Announcement.find().sort({ isPinned: -1, createdAt: -1 });
    } catch (err) {
      announcements = demoAnnouncements;
    }

    if (announcements.length === 0) announcements = demoAnnouncements;

    return res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching announcements",
    });
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private / Admin
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    let announcement;
    try {
      announcement = await Announcement.create({ title, content, category, isPinned: Boolean(isPinned) });
    } catch (err) {
      announcement = { _id: `ann-${Date.now()}`, title, content, category: category || "GENERAL", isPinned: Boolean(isPinned), createdAt: new Date() };
      demoAnnouncements.unshift(announcement);
    }

    return res.status(201).json({
      success: true,
      announcement,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create announcement" });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private / Admin
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Announcement.findByIdAndDelete(id);
    } catch (err) {
      const idx = demoAnnouncements.findIndex((a) => a._id === id);
      if (idx !== -1) demoAnnouncements.splice(idx, 1);
    }

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting announcement" });
  }
};
