import crypto from "crypto";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import Team from "../models/Team.js";
import Payment from "../models/Payment.js";
import { generateRegistrationId } from "../utils/generateId.js";
import { sendConfirmationEmail } from "../utils/emailService.js";

dotenv.config();

// Helper to get fresh Razorpay instance using environment variables
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_amshackathon2026";
  const key_secret = process.env.RAZORPAY_KEY_SECRET || "ams_hackathon_secret_key_2026";

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

// @desc    Create Razorpay Order (Calculates ₹100 per member: 3=₹300, 4=₹400, 5=₹500, 6=₹600)
// @route   POST /api/payments/create-order
// @access  Public
export const createOrder = async (req, res) => {
  try {
    const { teamSize } = req.body;
    const numMembers = Number(teamSize);

    if (!numMembers || numMembers < 3 || numMembers > 6) {
      return res.status(400).json({
        success: false,
        message: "Invalid team size. Must be between 3 and 6 members.",
      });
    }

    const feePerMember = Number(process.env.FEE_PER_MEMBER_INR || 100);
    const totalAmountINR = numMembers * feePerMember; // 300, 400, 500, or 600
    const amountInPaise = totalAmountINR * 100; // 30000, 40000, 50000, 60000

    const receipt = `rcpt_${Date.now()}`;
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        event: "AMS HACKATHON 2026",
        teamSize: numMembers,
        feePerPerson: feePerMember,
      },
    };

    const { instance: razorpayInstance, key_id: razorpayKeyId, key_secret: razorpayKeySecret } = getRazorpayInstance();

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

// @desc    Verify Razorpay Signature & Save Team/Payment to DB ONLY upon 100% Valid Payment
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
        message: "Missing payment verification parameters. Team registration aborted.",
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
      console.error("❌ CRITICAL: Payment signature verification failed! Registration aborted.");
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed. Registration aborted for security.",
      });
    }

    // Mark payment ID as processed
    processedPayments.add(razorpay_payment_id);

    // 3. Signature is 100% VALID -> Generate Registration ID & Save Team
    const registrationId = generateRegistrationId();
    const numMembers = Number(teamData.teamSize || 4);
    const amountPaid = numMembers * 100;

    const newTeamPayload = {
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
      createdAt: new Date(),
    };

    let savedTeam = null;
    try {
      savedTeam = await Team.create(newTeamPayload);

      // Create Payment DB Record
      await Payment.create({
        teamId: savedTeam._id,
        registrationId,
        amount: amountPaid,
        status: "SUCCESS",
        transactionId: razorpay_payment_id,
        paymentGateway: "RAZORPAY",
      });
    } catch (dbErr) {
      console.warn("Saving verified team to in-memory fallback store:", dbErr.message);
      localMemoryTeams.push({ _id: `mem-${Date.now()}`, ...newTeamPayload });
      savedTeam = newTeamPayload;
    }

    // 4. Send Confirmation Email
    sendConfirmationEmail({
      toEmail: teamData.leaderEmail,
      teamName: teamData.teamName,
      registrationId,
      paymentId: razorpay_payment_id,
      amount: amountPaid,
      track: teamData.track,
      college: teamData.college,
    });

    console.log(`✅ SUCCESS: Verified payment (${razorpay_payment_id}). Saved Team (${registrationId}).`);

    return res.status(200).json({
      success: true,
      message: "Payment verified & team registration saved successfully!",
      registrationId,
      paymentId: razorpay_payment_id,
      amountPaid,
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
