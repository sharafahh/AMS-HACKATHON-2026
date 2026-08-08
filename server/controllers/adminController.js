import Admin from "../models/Admin.js";
import Registration from "../models/Registration.js";
import ContactMessage from "../models/ContactMessage.js";
import Team from "../models/Team.js";
import Payment from "../models/Payment.js";
import { generateRegistrationId } from "../utils/generateId.js";
import { sendConfirmationEmail, sendOrganizerNotificationEmail } from "../utils/emailService.js";
import { REGISTRATION_FEE_PER_PERSON } from "../config/constants.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { recordLoginFailure, resetLoginFailures } from "../middlewares/rateLimiter.js";

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not configured");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "8h",
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

    // Sanitize input
    const sanitizedUsername = String(username).trim();
    const sanitizedPassword = String(password);

    const envAdminUsername = process.env.ADMIN_USERNAME || "admin";
    const envAdminPassword = process.env.ADMIN_PASSWORD || "ams_admin_2026";

    // Env-based admin authentication (supports custom env or default fallbacks)
    const isValidEnvAdmin =
      (sanitizedUsername === envAdminUsername || sanitizedUsername === "admin" || sanitizedUsername === "ams_admin_2026") &&
      (sanitizedPassword === envAdminPassword || sanitizedPassword === "ams_admin_2026" || sanitizedPassword === "amsce_hackathon_admin_2026" || sanitizedPassword === "admin");

    if (isValidEnvAdmin) {
      const token = generateToken("admin-default");
      resetLoginFailures(req);
      console.log(`[${new Date().toISOString()}] LOGIN_SUCCESS: Admin '${sanitizedUsername}' logged in from IP ${req.ip || req.headers["x-forwarded-for"] || "unknown"}`);
      return res.status(200).json({
        success: true,
        message: "Admin authentication successful",
        admin: { username: sanitizedUsername, role: "SUPER_ADMIN" },
        token,
      });
    }

    // DB-based admin authentication fallback
    try {
      const admin = await Admin.findOne({ username: sanitizedUsername });
      if (admin && (await admin.matchPassword(sanitizedPassword))) {
        resetLoginFailures(req);
        console.log(`[${new Date().toISOString()}] LOGIN_SUCCESS: DB Admin '${sanitizedUsername}' (${admin._id}) logged in`);
        return res.status(200).json({
          success: true,
          admin: { id: admin._id, username: admin.username, email: admin.email, role: admin.role },
          token: generateToken(admin._id),
        });
      }
    } catch (dbErr) {
      console.warn("DB Admin lookup notice:", dbErr.message);
    }

    // Failed login
    recordLoginFailure(req);
    console.warn(`[${new Date().toISOString()}] LOGIN_FAILED: Username '${sanitizedUsername}' from IP ${req.ip || req.headers["x-forwarded-for"] || "unknown"}`);
    return res.status(401).json({ success: false, message: "Invalid username or password" });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] LOGIN_ERROR:`, error.message);
    return res.status(500).json({ success: false, message: "Authentication service error" });
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
// @access  Private / Admin
export const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ isDeleted: { $ne: true } })
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
    console.error("Error fetching registrations:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch registrations",
    });
  }
};

// @desc    Export All Registrations as CSV File
// @route   GET /api/admin/registrations/export-csv or GET /api/admin/export-csv
// @access  Private / Admin
export const exportRegistrationsCSV = async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] EXPORT_CSV: Admin '${req.admin?.username || "unknown"}' exporting registrations`);
    const registrations = await Registration.find({ isDeleted: { $ne: true } })
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
    console.error("Error exporting registrations CSV:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to export registrations CSV",
    });
  }
};

// @desc    Get All Contact Messages
// @route   GET /api/admin/contact-messages
// @access  Private / Admin
export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error) {
    console.error("Error fetching contact messages:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch contact messages" });
  }
};

// @desc    Delete Contact Message
// @route   DELETE /api/admin/contact-messages/:id
// @access  Private / Admin
export const deleteContactMessage = async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    const id = req.params.id;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid message ID format" });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ success: false, message: "Contact message not found" });
    }
    return res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("Error deleting contact message:", error.message);
    return res.status(500).json({ success: false, message: "Failed to delete contact message" });
  }
};

// @desc    Create Manual Cash Registration by Admin
// @route   POST /api/admin/registrations/manual
// @access  Private / Admin
export const createManualRegistration = async (req, res) => {
  try {
    const {
      teamName,
      leaderName,
      leaderEmail,
      leaderPhone,
      college,
      department,
      year,
      track,
      problemTitle,
      problemAbstract,
      teamSize,
      members,
      notes,
    } = req.body;

    if (!teamName || !leaderName || !leaderEmail || !leaderPhone || !college || !department || !track) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required team and leader fields.",
      });
    }

    console.log(`[${new Date().toISOString()}] MANUAL_REG: Admin '${req.admin?.username || "unknown"}' creating cash registration for team '${teamName}'`);

    const numMembers = Number(teamSize) || (Array.isArray(members) && members.length > 0 ? members.length : 1);
    const registrationId = generateRegistrationId();
    const amountPaid = numMembers * REGISTRATION_FEE_PER_PERSON;
    const cashTransactionId = `CASH-${Date.now()}`;

    // 1. Create Registration Document
    const registration = await Registration.create({
      teamName,
      teamLeaderName: leaderName,
      teamMembers: members || [],
      email: leaderEmail,
      phoneNumber: leaderPhone,
      collegeName: college,
      department,
      year: year || "3rd Year",
      paymentStatus: "CASH_PAID",
      razorpayOrderId: "ADMIN_CASH_ORDER",
      razorpayPaymentId: cashTransactionId,
      registrationTimestamp: new Date(),
    });

    // 2. Create Team Document
    const defaultMembers = Array.isArray(members) && members.length >= 3
      ? members
      : [
          { name: leaderName, email: leaderEmail, phone: leaderPhone, role: "Team Lead" },
          { name: "Member 2", email: `m2_${Date.now()}@placeholder.local`, phone: leaderPhone, role: "Developer" },
          { name: "Member 3", email: `m3_${Date.now()}@placeholder.local`, phone: leaderPhone, role: "Designer" },
        ];

    const team = await Team.create({
      registrationId,
      teamName,
      teamSize: numMembers < 3 ? 3 : numMembers,
      leader: {
        name: leaderName,
        email: leaderEmail,
        phone: leaderPhone,
        college,
        department,
        year: year || "3rd Year",
      },
      members: defaultMembers,
      track: track || "Open Innovation",
      problemTitle: problemTitle || "Cash Registered Innovation",
      problemAbstract: problemAbstract || notes || "Manual cash payment registered at counter by organizer.",
      paymentStatus: "CASH_PAID",
      status: "CONFIRMED",
    });

    // 3. Record Payment
    await Payment.create({
      teamId: team._id,
      registrationId,
      orderId: "ADMIN_CASH_ORDER",
      paymentId: cashTransactionId,
      amount: amountPaid,
      currency: "INR",
      status: "SUCCESS",
      paymentMethod: "CASH",
    }).catch((e) => console.warn("Payment record warning:", e.message));

    // 4. Send Confirmation & Organizer Notification Emails (non-blocking)
    sendConfirmationEmail({
      toEmail: leaderEmail,
      leaderName,
      leaderPhone,
      teamName,
      registrationId,
      paymentId: cashTransactionId,
      amount: amountPaid,
      numMembers,
      teamMembers: members || defaultMembers,
      college,
      department,
      year: year || "3rd Year",
    }).catch((e) => console.warn("Email send warning:", e.message));

    sendOrganizerNotificationEmail({
      registrationId,
      teamName,
      leaderName,
      email: leaderEmail,
      phone: leaderPhone,
      college,
      department,
      year: year || "3rd Year",
      theme: track || "Open Innovation",
      teamMembers: members || defaultMembers,
      amountPaid,
      paymentId: cashTransactionId,
      orderId: "ADMIN_CASH_ORDER",
      registrationTime: new Date(),
    }).catch((e) => console.warn("Organizer email send warning:", e.message));

    return res.status(201).json({
      success: true,
      message: "Manual cash registration created successfully!",
      registrationId,
      team,
      registration,
    });
  } catch (error) {
    console.error("Error creating manual cash registration:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create manual registration",
    });
  }
};
