import { sendContactEmail } from "../utils/emailService.js";

// @desc    Submit contact form and send email to admin
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Dispatch the email
    const emailSent = await sendContactEmail({ name, email, subject, message });

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Your message was registered, but we failed to dispatch the notification email. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while submitting the contact form",
    });
  }
};
