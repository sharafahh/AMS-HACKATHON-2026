import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    registrationId: {
      type: String,
      required: true,
    },
    recipientName: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Participant",
    },
    track: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
