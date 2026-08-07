import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Member name is required"],
    trim: true,
    minlength: [2, "Member name must be at least 2 characters"],
    maxlength: [100, "Member name cannot exceed 100 characters"],
  },
  email: {
    type: String,
    required: [true, "Member email is required"],
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid member email format"],
  },
  phone: {
    type: String,
    required: [true, "Member phone is required"],
    trim: true,
    validate: {
      validator: function (v) {
        const digits = String(v).replace(/\D/g, "");
        return digits.length >= 7 && digits.length <= 15;
      },
      message: "Member phone must contain 7-15 digits",
    },
  },
  role: { type: String, required: true, trim: true, default: "Developer" },
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
      min: [3, "Minimum team size is 3"],
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
        validate: {
          validator: function (v) {
            const digits = String(v).replace(/\D/g, "");
            return digits.length >= 7 && digits.length <= 15;
          },
          message: "Leader phone must contain 7-15 digits",
        },
      },
      college: { type: String, required: [true, "College name is required"], trim: true },
      department: { type: String, required: [true, "Department is required"], trim: true },
      year: { type: String, required: [true, "Year is required"], trim: true },
    },
    members: {
      type: [memberSchema],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length >= 3 && val.length <= 6;
        },
        message: "Members array must contain between 3 and 6 members",
      },
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
