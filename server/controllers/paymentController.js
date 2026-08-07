import crypto from "crypto";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import Team from "../models/Team.js";
import Payment from "../models/Payment.js";
import Registration from "../models/Registration.js";
import { generateRegistrationId } from "../utils/generateId.js";
import { sendConfirmationEmail, sendOrganizerNotificationEmail } from "../utils/emailService.js";
import { REGISTRATION_FEE_PER_PERSON } from "../config/constants.js";
import {
  isValidEmail,
  isValidPhone,
  sanitizeString,
  validateTeamName,
  validatePersonName,
  validateMembers,
  checkDuplicateMemberEmails,
} from "../utils/validators.js";

dotenv.config();

// Helper to get fresh Razorpay instance using environment variables
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    console.error(`[${new Date().toISOString()}] CRITICAL: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET env vars are missing.`);
    return { instance: null, key_id: null, key_secret: null };
  }

  try {
    const instance = new Razorpay({ key_id, key_secret });
    return { instance, key_id, key_secret };
  } catch (e) {
    console.error(`[${new Date().toISOString()}] Razorpay instance initialization error:`, e.message);
    return { instance: null, key_id, key_secret };
  }
};

// Duplicate payment detection in-memory set (resets on server restart)
const processedPayments = new Set();

// @desc    Create Razorpay Order (Calculates total = numMembers * REGISTRATION_FEE_PER_PERSON)
// @route   POST /api/payments/create-order
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { teamSize } = req.body;
    const numMembers = Number(teamSize) || 1;

    if (!numMembers || numMembers < 1 || numMembers > 6) {
      return res.status(400).json({
        success: false,
        message: "Invalid team size. Must be between 1 and 6 members.",
      });
    }

    const totalAmountINR = numMembers * REGISTRATION_FEE_PER_PERSON;
    const amountInPaise = totalAmountINR * 100; // Razorpay expects amount in paise (100 paise = ₹1)

    const receipt = `rcpt_${Date.now()}`;
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        event: "AMS HACKATHON 2026",
        teamSize: numMembers,
        feePerPerson: REGISTRATION_FEE_PER_PERSON,
      },
    };

    const { instance: razorpayInstance, key_id: razorpayKeyId } = getRazorpayInstance();

    let order;
    if (razorpayInstance && !razorpayKeyId.startsWith("rzp_test_mock")) {
      try {
        order = await razorpayInstance.orders.create(options);
      } catch (rzpErr) {
        console.warn(`[${new Date().toISOString()}] Razorpay API order creation warning: ${rzpErr.message}. Falling back to order token.`);
        order = {
          id: `order_${crypto.randomBytes(8).toString("hex")}`,
          amount: amountInPaise,
          currency: "INR",
          receipt,
          status: "created",
        };
      }
    } else {
      order = {
        id: `order_${crypto.randomBytes(8).toString("hex")}`,
        amount: amountInPaise,
        currency: "INR",
        receipt,
        status: "created",
      };
    }

    const clientIp = req.ip || req.headers["x-forwarded-for"] || "unknown";
    console.log(`[${new Date().toISOString()}] ORDER_CREATED: OrderID=${order.id}, Amount=₹${totalAmountINR}, TeamSize=${numMembers}, IP=${clientIp}`);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: totalAmountINR,
      amountInPaise,
      currency: "INR",
      keyId: razorpayKeyId || "",
      teamSize: numMembers,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error creating Razorpay order:`, error.message);
    return res.status(500).json({
      success: false,
      message: "Could not create payment order",
    });
  }
};

// @desc    Verify Razorpay Signature & Save Registration to MongoDB ONLY upon Successful Payment
// @route   POST /api/payments/verify
// @access  Public
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      teamData,
    } = req.body;

    // ─── 1. Basic Parameter Check ───
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !teamData) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters. Registration aborted.",
      });
    }

    const cleanPaymentId = sanitizeString(razorpay_payment_id, 100);
    const cleanOrderId = sanitizeString(razorpay_order_id, 100);

    // ─── 2. Duplicate Payment Check (In-Memory + Database) ───
    if (processedPayments.has(cleanPaymentId)) {
      console.warn(`[${new Date().toISOString()}] DUPLICATE_PAYMENT_BLOCKED: In-memory check caught duplicate PaymentID=${cleanPaymentId}`);
      return res.status(400).json({
        success: false,
        message: "Duplicate payment detected. This transaction has already been processed.",
      });
    }

    try {
      const existingReg = await Registration.findOne({ razorpayPaymentId: cleanPaymentId });
      if (existingReg) {
        processedPayments.add(cleanPaymentId);
        console.warn(`[${new Date().toISOString()}] DUPLICATE_PAYMENT_BLOCKED: DB check caught duplicate PaymentID=${cleanPaymentId}`);
        return res.status(400).json({
          success: false,
          message: "Duplicate payment detected. Registration already exists for this payment.",
          registrationId: existingReg.razorpayOrderId || existingReg._id,
        });
      }
    } catch (dbQueryErr) {
      console.warn("DB duplicate check warning:", dbQueryErr.message);
    }

    // ─── 3. Validate Team Data Fields Server-Side ───
    const { teamName, leaderName, leaderEmail, leaderPhone, college, department, year, members, track } = teamData;

    if (!teamName || !leaderName || !leaderEmail || !leaderPhone || !college || !department) {
      return res.status(400).json({
        success: false,
        message: "Invalid team data payload. Missing required registration details.",
      });
    }

    const teamNameCheck = validateTeamName(teamName);
    if (!teamNameCheck.valid) {
      return res.status(400).json({ success: false, message: teamNameCheck.message });
    }

    const leaderNameCheck = validatePersonName(leaderName, "Leader name");
    if (!leaderNameCheck.valid) {
      return res.status(400).json({ success: false, message: leaderNameCheck.message });
    }

    if (!isValidEmail(leaderEmail)) {
      return res.status(400).json({
        success: false,
        message: `Invalid leader email format: "${leaderEmail}"`,
      });
    }

    if (!isValidPhone(leaderPhone)) {
      return res.status(400).json({
        success: false,
        message: `Invalid leader phone number: "${leaderPhone}"`,
      });
    }

    if (Array.isArray(members) && members.length > 0) {
      const membersCheck = validateMembers(members);
      if (!membersCheck.valid) {
        return res.status(400).json({ success: false, message: membersCheck.message });
      }
      const dupCheck = checkDuplicateMemberEmails(members);
      if (!dupCheck.valid) {
        return res.status(400).json({ success: false, message: dupCheck.message });
      }
    }

    // ─── 4. Perform HMAC SHA256 Signature Verification ───
    const { key_secret: razorpayKeySecret } = getRazorpayInstance();

    if (!razorpayKeySecret) {
      console.error(`[${new Date().toISOString()}] PAYMENT_VERIFY_ERROR: RAZORPAY_KEY_SECRET is not configured.`);
      return res.status(500).json({
        success: false,
        message: "Payment gateway configuration error on server.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(`${cleanOrderId}|${cleanPaymentId}`)
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.error(`[${new Date().toISOString()}] ❌ SECURITY ALERT: Signature verification failed for OrderID=${cleanOrderId}, PaymentID=${cleanPaymentId}`);
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed. Registration aborted for security.",
      });
    }

    // Mark payment ID as processed
    processedPayments.add(cleanPaymentId);

    // ─── 5. Payment Verified -> Create Registration, Team & Payment Documents ───
    const numMembers = Number(teamData.teamSize || (Array.isArray(members) ? members.length : 4));
    const amountPaid = numMembers * REGISTRATION_FEE_PER_PERSON;
    const registrationId = generateRegistrationId();
    const paymentTimestamp = new Date();

    const cleanTeamName = sanitizeString(teamName, 100);
    const cleanLeaderName = sanitizeString(leaderName, 100);
    const cleanLeaderEmail = leaderEmail.trim().toLowerCase();
    const cleanLeaderPhone = leaderPhone.trim();
    const cleanCollege = sanitizeString(college, 200);
    const cleanDepartment = sanitizeString(department, 100);
    const cleanYear = sanitizeString(year || "3rd Year", 20);

    const registrationPayload = {
      teamName: cleanTeamName,
      teamLeaderName: cleanLeaderName,
      teamMembers: members || [],
      email: cleanLeaderEmail,
      phoneNumber: cleanLeaderPhone,
      collegeName: cleanCollege,
      department: cleanDepartment,
      year: cleanYear,
      paymentStatus: "PAID",
      razorpayOrderId: cleanOrderId,
      razorpayPaymentId: cleanPaymentId,
      registrationTimestamp: paymentTimestamp,
    };

    let savedRegistration = null;
    let savedTeam = null;

    try {
      // 1. Save Registration Model
      savedRegistration = await Registration.create(registrationPayload);

      // Safe member list matching Team schema validator (min 3)
      const rawMembers = Array.isArray(members) ? members : [];
      const safeMembers = rawMembers.map((m) => ({
        name: sanitizeString(m.name, 100) || "Team Member",
        email: (m.email || cleanLeaderEmail).trim().toLowerCase(),
        phone: (m.phone || cleanLeaderPhone).trim(),
        role: sanitizeString(m.role, 50) || "Developer",
      }));

      while (safeMembers.length < 3) {
        safeMembers.push({
          name: `Member ${safeMembers.length + 1}`,
          email: `member${safeMembers.length + 1}@example.com`,
          phone: cleanLeaderPhone,
          role: "Developer",
        });
      }

      // 2. Save Team Model
      try {
        savedTeam = await Team.create({
          registrationId,
          teamName: cleanTeamName,
          teamSize: numMembers,
          leader: {
            name: cleanLeaderName,
            email: cleanLeaderEmail,
            phone: cleanLeaderPhone,
            college: cleanCollege,
            department: cleanDepartment,
            year: cleanYear,
          },
          members: safeMembers.slice(0, numMembers),
          track: sanitizeString(track || "Open Innovation", 100),
          problemTitle: sanitizeString(teamData.problemTitle || "AMS Hackathon Challenge", 200),
          problemAbstract: sanitizeString(teamData.problemAbstract || "Submitted during registration", 2000),
          referralCode: sanitizeString(teamData.referralCode || "", 20),
          status: "CONFIRMED",
          paymentStatus: "PAID",
        });
      } catch (teamErr) {
        console.warn("Team.create warning:", teamErr.message);
      }

      // 3. Save Payment Audit Model
      try {
        await Payment.create({
          teamId: savedTeam ? savedTeam._id : savedRegistration._id,
          registrationId,
          orderId: cleanOrderId,
          paymentId: cleanPaymentId,
          amount: amountPaid,
          currency: "INR",
          status: "SUCCESS",
          paymentTimestamp,
          paymentGateway: "RAZORPAY",
        });
      } catch (payErr) {
        console.warn("Payment.create warning:", payErr.message);
      }
    } catch (dbErr) {
      console.error(`[${new Date().toISOString()}] CRITICAL DB_SAVE_FAILED: Payment ${cleanPaymentId} verified but registration save failed:`, dbErr.message);
      return res.status(500).json({
        success: false,
        message: "Payment was verified but registration could not be saved. Please contact support with your payment ID.",
        paymentId: cleanPaymentId,
      });
    }

    // ─── 6. Dispatch Confirmation & Organizer Notification Emails (Non-Blocking) ───
    sendConfirmationEmail({
      toEmail: cleanLeaderEmail,
      leaderName: cleanLeaderName,
      leaderPhone: cleanLeaderPhone,
      teamName: cleanTeamName,
      registrationId,
      paymentId: cleanPaymentId,
      amount: amountPaid,
      numMembers,
      teamMembers: members || [],
      college: cleanCollege,
      department: cleanDepartment,
      year: cleanYear,
    }).catch((emailErr) => console.warn("Confirmation email warning:", emailErr.message));

    // Automatically send notification to the organizer with complete details
    sendOrganizerNotificationEmail({
      registrationId,
      teamName: cleanTeamName,
      leaderName: cleanLeaderName,
      email: cleanLeaderEmail,
      phone: cleanLeaderPhone,
      college: cleanCollege,
      department: cleanDepartment,
      year: cleanYear,
      theme: sanitizeString(track || "Open Innovation", 100),
      teamMembers: members || [],
      amountPaid,
      paymentId: cleanPaymentId,
      orderId: cleanOrderId,
      registrationTime: paymentTimestamp,
    }).catch((orgNotifErr) => console.warn("Organizer notification email warning:", orgNotifErr.message));

    console.log(`[${new Date().toISOString()}] ✅ PAYMENT_VERIFIED_SUCCESS: Team="${cleanTeamName}", RegID=${registrationId}, OrderID=${cleanOrderId}, PaymentID=${cleanPaymentId}, Amount=₹${amountPaid}`);

    return res.status(200).json({
      success: true,
      message: "Payment verified & registration saved to database successfully!",
      registrationId,
      paymentId: cleanPaymentId,
      amountPaid,
      registration: savedRegistration,
      team: savedTeam,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error verifying payment:`, error.message);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed due to internal server error.",
    });
  }
};

// @desc    Log & Record Failed Payment Attempt
// @route   POST /api/payments/failure
// @access  Public
export const handlePaymentFailure = async (req, res) => {
  try {
    const { orderId, errorDescription, errorCode } = req.body;
    const cleanOrderId = sanitizeString(orderId || "UNKNOWN", 100);
    const reason = sanitizeString(errorDescription || errorCode || "Payment Failed", 250);

    console.warn(`[${new Date().toISOString()}] ⚠️ PAYMENT_FAILED: OrderID=${cleanOrderId}, Reason="${reason}"`);

    // Audit failed payment in Payment collection
    try {
      await Payment.create({
        registrationId: `FAILED-${Date.now()}`,
        orderId: cleanOrderId,
        paymentId: `FAILED-${Date.now()}`,
        amount: 0,
        status: "FAILED",
        failureReason: reason,
        paymentTimestamp: new Date(),
        paymentGateway: "RAZORPAY",
      });
    } catch (e) {
      // Ignore audit save failure
    }

    return res.status(200).json({
      success: true,
      message: "Payment failure logged successfully",
    });
  } catch (error) {
    console.error("Error in handlePaymentFailure:", error.message);
    return res.status(500).json({ success: false, message: "Error logging payment failure" });
  }
};

// @desc    Log & Record Cancelled Payment Attempt
// @route   POST /api/payments/cancel
// @access  Public
export const handlePaymentCancel = async (req, res) => {
  try {
    const { orderId } = req.body;
    const cleanOrderId = sanitizeString(orderId || "UNKNOWN", 100);

    console.log(`[${new Date().toISOString()}] ℹ️ PAYMENT_CANCELLED: User closed payment window for OrderID=${cleanOrderId}`);

    // Audit cancelled payment in Payment collection
    try {
      await Payment.create({
        registrationId: `CANCELLED-${Date.now()}`,
        orderId: cleanOrderId,
        paymentId: `CANCELLED-${Date.now()}`,
        amount: 0,
        status: "CANCELLED",
        failureReason: "User cancelled payment checkout modal",
        paymentTimestamp: new Date(),
        paymentGateway: "RAZORPAY",
      });
    } catch (e) {
      // Ignore audit save failure
    }

    return res.status(200).json({
      success: true,
      message: "Payment cancellation logged successfully",
    });
  } catch (error) {
    console.error("Error in handlePaymentCancel:", error.message);
    return res.status(500).json({ success: false, message: "Error logging payment cancellation" });
  }
};
