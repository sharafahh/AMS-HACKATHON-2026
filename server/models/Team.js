import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true, default: "Developer" },
});

const teamSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },
    teamSize: {
      type: Number,
      required: true,
      min: [3, "Minimum team size is 3"],
      max: [6, "Maximum team size is 6"],
    },
    leader: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      college: { type: String, required: true, trim: true },
      department: { type: String, required: true, trim: true },
      year: { type: String, required: true, trim: true },
    },
    members: {
      type: [memberSchema],
      validate: {
        validator: function (val) {
          return val.length >= 3 && val.length <= 6;
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
    },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID", "WAIVED"],
      default: "UNPAID",
    },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);
export default Team;
