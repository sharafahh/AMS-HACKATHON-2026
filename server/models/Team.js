import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: "" },
  email: { type: String, trim: true, lowercase: true, default: "" },
  phone: { type: String, trim: true, default: "" },
  department: { type: String, trim: true, default: "" },
  role: { type: String, trim: true, default: "Developer" },
});

const teamSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: [true, "Registration ID is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      minlength: [2, "Team name must be at least 2 characters"],
      maxlength: [100, "Team name cannot exceed 100 characters"],
      index: true,
    },
    teamSize: {
      type: Number,
      required: [true, "Team size is required"],
      min: [1, "Minimum team size is 1"],
      max: [6, "Maximum team size is 6"],
    },
    leader: {
      name: {
        type: String,
        required: [true, "Leader name is required"],
        trim: true,
        minlength: [2, "Leader name must be at least 2 characters"],
        maxlength: [100, "Leader name cannot exceed 100 characters"],
      },
      email: {
        type: String,
        required: [true, "Leader email is required"],
        trim: true,
        lowercase: true,
        index: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid leader email format"],
      },
      phone: {
        type: String,
        required: [true, "Leader phone is required"],
        trim: true,
      },
      college: { type: String, required: [true, "College name is required"], trim: true },
      department: { type: String, required: [true, "Department is required"], trim: true },
      year: { type: String, required: [true, "Year is required"], trim: true },
    },
    members: {
      type: [memberSchema],
      default: [],
    },
    track: {
      type: String,
      required: [true, "Hackathon track is required"],
      trim: true,
    },
    problemTitle: {
      type: String,
      required: [true, "Problem statement title is required"],
      trim: true,
    },
    problemAbstract: {
      type: String,
      required: [true, "Problem abstract is required"],
      trim: true,
    },
    selectedProblemId: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },
    selectedAt: {
      type: Date,
      default: null,
    },
    referralCode: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "REJECTED"],
      default: "CONFIRMED",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID", "WAIVED", "CASH_PAID"],
      default: "UNPAID",
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
teamSchema.index({ isDeleted: 1, createdAt: -1 });
teamSchema.index({ isDeleted: 1, paymentStatus: 1 });
teamSchema.index({ "leader.email": 1, isDeleted: 1 });
teamSchema.index({ teamName: 1, isDeleted: 1 });

const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);
export default Team;
