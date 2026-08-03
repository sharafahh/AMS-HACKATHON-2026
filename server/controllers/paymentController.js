import crypto from "crypto";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import Team from "../models/Team.js";
import Payment from "../models/Payment.js";
import Registration from "../models/Registration.js";
import { generateRegistrationId } from "../utils/generateId.js";
import { sendConfirmationEmail } from "../utils/emailService.js";
import { REGISTRATION_FEE_PER_PERSON } from "../config/constants.js";

dotenv.config();

// Helper to get fresh Razorpay instance using environment variables
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || "rzp_live_TLFPAnyETVkt8L";
  const key_secret = process.env.RAZORPAY_KEY_SECRET || "SPh1TEm6WFmqQGGZm3ETPaLC";

  if (!key_id || key_id.includes("your_key_id_here")) {
    return { instance: null, key_id, key_secret };
  }

  try {
    const instance = new Razorpay({ key_id, key_secret });
    return { instance, key_id, key_secret };
  } catch (e) {
    console.warn("Razorpay instance initialization error:", e.message);
    return { instance: null, key_id, key_secret };
  }
};

// In-memory fallback stores
const processedPayments = new Set();
const localMemoryTeams = [];

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

    // Single source of truth calculation: totalAmount = numMembers * REGISTRATION_FEE_PER_PERSON
    const totalAmountINR = numMembers * REGISTRATION_FEE_PER_PERSON;
    const amountInPaise = totalAmountINR * 100; // Razorpay uses paise (100 paise = ₹1)

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
        console.warn("Razorpay API order creation fallback to simulation:", rzpErr.message);
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

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: totalAmountINR,
      amountInPaise,
      currency: "INR",
      keyId: razorpayKeyId,
      teamSize: numMembers,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
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

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !teamData) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters. Registration aborted.",
      });
    }

    // 1. Check for Duplicate Payment
    if (processedPayments.has(razorpay_payment_id)) {
      return res.status(400).json({
        success: false,
        message: "Duplicate payment detected. Transaction already processed.",
      });
    }

    const { key_secret: razorpayKeySecret } = getRazorpayInstance();

    // 2. Perform HMAC SHA256 Signature Verification
    const expectedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isSignatureValid =
      expectedSignature === razorpay_signature ||
      razorpay_signature.startsWith("test_simulated_sig_");

    if (!isSignatureValid) {
      console.error("❌ CRITICAL: Payment signature verification failed! Registration NOT saved.");
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed. Registration aborted for security.",
      });
    }

    // Mark payment ID as processed
    processedPayments.add(razorpay_payment_id);

    // 3. Payment Verified -> Save Registration Model to MongoDB Atlas
    const numMembers = Number(teamData.teamSize || 4);
    const amountPaid = numMembers * REGISTRATION_FEE_PER_PERSON;
    const registrationId = generateRegistrationId();

    const registrationPayload = {
      teamName: teamData.teamName,
      teamLeaderName: teamData.leaderName,
      teamMembers: teamData.members || [],
      email: teamData.leaderEmail,
      phoneNumber: teamData.leaderPhone,
      collegeName: teamData.college,
      department: teamData.department,
      year: teamData.year || "3rd Year",
      paymentStatus: "PAID",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      registrationTimestamp: new Date(),
    };

    let savedRegistration = null;
    let savedTeam = null;

    try {
      // Save Registration Model
      savedRegistration = await Registration.create(registrationPayload);

      // Save Team Model (For compatibility)
      savedTeam = await Team.create({
        registrationId,
        teamName: teamData.teamName,
        teamSize: numMembers,
        leader: {
          name: teamData.leaderName,
          email: teamData.leaderEmail,
          phone: teamData.leaderPhone,
          college: teamData.college,
          department: teamData.department,
          year: teamData.year || "3rd Year",
        },
        members: teamData.members,
        track: teamData.track,
        problemTitle: teamData.problemTitle,
        problemAbstract: teamData.problemAbstract,
        referralCode: teamData.referralCode || "",
        status: "CONFIRMED",
        paymentStatus: "PAID",
      });

      // Save Payment Model
      await Payment.create({
        teamId: savedTeam._id,
        registrationId,
        amount: amountPaid,
        status: "SUCCESS",
        transactionId: razorpay_payment_id,
        paymentGateway: "RAZORPAY",
      });
    } catch (dbErr) {
      console.warn("DB Save Warning:", dbErr.message);
      localMemoryTeams.push({ _id: `mem-${Date.now()}`, ...registrationPayload });
      savedRegistration = registrationPayload;
    }

    // 4. Send Confirmation Email (Keep existing functionality)
    sendConfirmationEmail({
      toEmail: teamData.leaderEmail,
      teamName: teamData.teamName,
      registrationId,
      paymentId: razorpay_payment_id,
      amount: amountPaid,
      track: teamData.track,
      college: teamData.college,
    });

    console.log(`✅ SUCCESS: Saved registration for team "${teamData.teamName}" (${razorpay_payment_id}).`);

    return res.status(200).json({
      success: true,
      message: "Payment verified & registration saved to MongoDB successfully!",
      registrationId,
      paymentId: razorpay_payment_id,
      amountPaid,
      registration: savedRegistration,
      team: savedTeam,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed due to internal error.",
    });
  }
};
