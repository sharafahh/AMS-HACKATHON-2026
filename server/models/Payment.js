import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    registrationId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["UNPAID", "INITIATED", "SUCCESS", "FAILED"],
      default: "UNPAID",
    },
    transactionId: {
      type: String,
      default: "",
    },
    paymentGateway: {
      type: String,
      default: "STUB",
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
