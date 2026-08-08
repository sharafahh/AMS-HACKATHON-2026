import ContactMessage from "../models/ContactMessage.js";
import { sendContactMessageEmail } from "../utils/emailService.js";

// @desc    Submit Contact Form Message & Send Email to Organizer
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill out all required fields (Name, Email, Subject, Message).",
      });
    }

    // 1. Save to MongoDB
    let savedMsg = null;
    try {
      savedMsg = await ContactMessage.create({
        name,
        email,
        subject,
        message,
        status: "NEW",
      });
    } catch (dbErr) {
      console.warn("MongoDB ContactMessage save notice:", dbErr.message);
    }

    // 2. Dispatch email to organizer (Non-blocking execution)
    sendContactMessageEmail({ name, email, subject, message }).catch((emailErr) => {
      console.warn("Contact email dispatch notice:", emailErr.message);
    });

    return res.status(200).json({
      success: true,
      message: "Thank you! Your query has been received and logged. We will get back to you shortly.",
      contactId: savedMsg ? savedMsg._id : null,
    });
  } catch (error) {
    console.error("Error in submitContactForm:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to submit contact message. Please try again later.",
    });
  }
};

// @desc    Get all contact messages (Admin / Inspection)
// @route   GET /api/contact
// @access  Public / Admin
export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve contact messages",
    });
  }
};
