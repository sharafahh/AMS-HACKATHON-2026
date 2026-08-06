import Admin from "../models/Admin.js";
import Registration from "../models/Registration.js";
import ContactMessage from "../models/ContactMessage.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "ams_hackathon_secret_key_2026", {
    expiresIn: "30d",
  });
};

// @desc    Admin Auth & Get JWT Token
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Please enter username and password" });
    }

    const envAdminUsername = process.env.ADMIN_USERNAME || "ams_admin_2026";
    const envAdminPassword = process.env.ADMIN_PASSWORD || "AMS@Hackathon#2026!Secured";

    // Dynamic Admin Authentication via Environment Variables
    if (username === envAdminUsername && password === envAdminPassword) {
      const token = jwt.sign({ id: "admin-default" }, process.env.JWT_SECRET || "ams_hackathon_secret_key_2026", {
        expiresIn: "30d",
      });
      return res.status(200).json({
        success: true,
        message: "Admin authentication successful",
        admin: { username: envAdminUsername, role: "SUPER_ADMIN" },
        token,
      });
    }

    const admin = await Admin.findOne({ username });
    if (admin && (await admin.matchPassword(password))) {
      return res.status(200).json({
        success: true,
        admin: { id: admin._id, username: admin.username, email: admin.email, role: admin.role },
        token: generateToken(admin._id),
      });
    }

    return res.status(401).json({ success: false, message: "Invalid username or password" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Admin auth error" });
  }
};

// @desc    Get Current Admin Profile
// @route   GET /api/admin/me
// @access  Private
export const getAdminProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    admin: req.admin || { username: "admin", role: "SUPER_ADMIN" },
  });
};

// @desc    Get All Registrations (Sorted Newest First)
// @route   GET /api/admin/registrations
// @access  Public / Admin
export const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .sort({ registrationTimestamp: -1, createdAt: -1 });

    const formattedRegistrations = registrations.map((reg) => ({
      _id: reg._id,
      teamName: reg.teamName,
      teamLeader: reg.teamLeaderName,
      college: reg.collegeName,
      email: reg.email,
      phone: reg.phoneNumber,
      paymentStatus: reg.paymentStatus,
      registrationDate: reg.registrationTimestamp || reg.createdAt,
      department: reg.department,
      year: reg.year,
      razorpayOrderId: reg.razorpayOrderId,
      razorpayPaymentId: reg.razorpayPaymentId,
      teamMembers: reg.teamMembers,
    }));

    return res.status(200).json({
      success: true,
      count: formattedRegistrations.length,
      registrations: formattedRegistrations,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch registrations",
    });
  }
};

// @desc    Export All Registrations as CSV File
// @route   GET /api/admin/registrations/export-csv or GET /api/admin/export-csv
// @access  Public / Admin
export const exportRegistrationsCSV = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .sort({ registrationTimestamp: -1, createdAt: -1 });

    const headers = [
      "Team Name",
      "Team Leader",
      "College",
      "Email",
      "Phone",
      "Department",
      "Year",
      "Payment Status",
      "Razorpay Order ID",
      "Razorpay Payment ID",
      "Registration Date",
    ];

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = registrations.map((reg) => [
      escapeCSV(reg.teamName),
      escapeCSV(reg.teamLeaderName),
      escapeCSV(reg.collegeName),
      escapeCSV(reg.email),
      escapeCSV(reg.phoneNumber),
      escapeCSV(reg.department),
      escapeCSV(reg.year),
      escapeCSV(reg.paymentStatus),
      escapeCSV(reg.razorpayOrderId),
      escapeCSV(reg.razorpayPaymentId),
      escapeCSV(new Date(reg.registrationTimestamp || reg.createdAt).toISOString()),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=ams_hackathon_registrations.csv");
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error("Error exporting registrations CSV:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to export registrations CSV",
    });
  }
};

// @desc    Get All Contact Messages
// @route   GET /api/admin/contact-messages
// @access  Public / Admin
export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch contact messages" });
  }
};

// @desc    Delete Contact Message
// @route   DELETE /api/admin/contact-messages/:id
// @access  Public / Admin
export const deleteContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: "Contact message not found" });
    }
    return res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return res.status(500).json({ success: false, message: "Failed to delete contact message" });
  }
};
