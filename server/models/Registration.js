import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, "Team Name is required"],
      trim: true,
      minlength: [2, "Team name must be at least 2 characters"],
      maxlength: [100, "Team name cannot exceed 100 characters"],
      index: true,
    },
    teamLeaderName: {
      type: String,
      required: [true, "Team Leader Name is required"],
      trim: true,
      minlength: [2, "Leader name must be at least 2 characters"],
      maxlength: [100, "Leader name cannot exceed 100 characters"],
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
      index: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please provide a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone Number is required"],
      trim: true,
      validate: {
        validator: function (v) {
          const digits = String(v).replace(/\D/g, "");
          return digits.length >= 7 && digits.length <= 15;
        },
        message: "Phone number must contain 7-15 digits",
      },
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
    registrationId: {
      type: String,
      trim: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID", "SUCCESS", "FAILED", "CASH_PAID"],
      default: "PAID",
      index: true,
    },
    razorpayOrderId: {
      type: String,
      required: [true, "Razorpay Order ID is required"],
      trim: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      required: [true, "Razorpay Payment ID is required"],
      trim: true,
      unique: true,
      index: true,
    },
    registrationTimestamp: {
      type: Date,
      default: Date.now,
      index: true,
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

// Compound indexes for fast query performance
registrationSchema.index({ isDeleted: 1, registrationTimestamp: -1 });
registrationSchema.index({ email: 1, paymentStatus: 1, isDeleted: 1 });
registrationSchema.index({ teamName: 1, isDeleted: 1 });

const Registration = mongoose.models.Registration || mongoose.model("Registration", registrationSchema);
export default Registration;
