import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: false,
    },
    registrationId: {
      type: String,
      required: [true, "Registration ID is required"],
      index: true,
    },
    orderId: {
      type: String,
      required: [true, "Order ID is required"],
      index: true,
    },
    paymentId: {
      type: String,
      default: "",
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Amount cannot be negative"],
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["UNPAID", "INITIATED", "SUCCESS", "FAILED", "CANCELLED"],
      default: "UNPAID",
      index: true,
    },
    paymentTimestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    paymentGateway: {
      type: String,
      default: "RAZORPAY",
      trim: true,
    },
    failureReason: {
      type: String,
      default: "",
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Compound indexes for analytical queries and performance
paymentSchema.index({ isDeleted: 1, paymentTimestamp: -1 });
paymentSchema.index({ orderId: 1, status: 1, isDeleted: 1 });
paymentSchema.index({ paymentId: 1, isDeleted: 1 });

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
