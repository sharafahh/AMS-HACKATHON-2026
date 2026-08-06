import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, "Team Name is required"],
      trim: true,
    },
    teamLeaderName: {
      type: String,
      required: [true, "Team Leader Name is required"],
      trim: true,
    },
    teamMembers: {
      type: Array,
      default: [],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone Number is required"],
      trim: true,
    },
    collegeName: {
      type: String,
      required: [true, "College Name is required"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    year: {
      type: String,
      required: [true, "Year is required"],
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID", "SUCCESS", "FAILED", "CASH_PAID"],
      default: "PAID",
    },
    razorpayOrderId: {
      type: String,
      required: [true, "Razorpay Order ID is required"],
      trim: true,
    },
    razorpayPaymentId: {
      type: String,
      required: [true, "Razorpay Payment ID is required"],
      trim: true,
    },
    registrationTimestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;
