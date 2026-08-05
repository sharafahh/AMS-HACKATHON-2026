import { sendContactMessageEmail } from "../utils/emailService.js";

// @desc    Submit Contact Form Message
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

    // Dispatch message to organizer email
    await sendContactMessageEmail({ name, email, subject, message });

    return res.status(200).json({
      success: true,
      message: "Thank you! Your message has been sent to the organizing team. We will get back to you shortly.",
    });
  } catch (error) {
    console.error("Error in submitContactForm:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit contact message. Please try again later.",
    });
  }
};
