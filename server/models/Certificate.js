import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateCode: {
      type: String,
      required: [true, "Certificate code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: false,
    },
    registrationId: {
      type: String,
      required: [true, "Registration ID is required"],
      uppercase: true,
      trim: true,
      index: true,
    },
    recipientName: {
      type: String,
      required: [true, "Recipient name is required"],
      trim: true,
      index: true,
    },
    college: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
    },
    role: {
      type: String,
      default: "Participant",
      trim: true,
    },
    track: {
      type: String,
      required: [true, "Hackathon track is required"],
      trim: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
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

certificateSchema.index({ isDeleted: 1, certificateCode: 1 });
certificateSchema.index({ isDeleted: 1, registrationId: 1 });

const Certificate = mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);
export default Certificate;
