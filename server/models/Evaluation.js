import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: [true, "Registration ID is required"],
      trim: true,
      index: true,
    },
    teamName: {
      type: String,
      required: [true, "Team Name is required"],
      trim: true,
    },
    track: {
      type: String,
      required: [true, "Track is required"],
      trim: true,
    },
    round: {
      type: Number,
      required: [true, "Evaluation round is required"],
      enum: [1, 2, 3, 4],
      default: 1,
      index: true,
    },
    evaluatorId: {
      type: String,
      default: "evaluator-1",
      trim: true,
    },
    evaluatorName: {
      type: String,
      default: "Jury Evaluator",
      trim: true,
    },
    scores: {
      innovation: { type: Number, min: 0, max: 10, default: 0 },
      technical: { type: Number, min: 0, max: 10, default: 0 },
      prototype: { type: Number, min: 0, max: 10, default: 0 },
      uiux: { type: Number, min: 0, max: 10, default: 0 },
      presentation: { type: Number, min: 0, max: 10, default: 0 },
    },
    rawTotal: {
      type: Number,
      default: 0,
    },
    trackMultiplier: {
      type: Number,
      default: 1.0,
    },
    weightedTotal: {
      type: Number,
      default: 0,
    },
    remarks: {
      type: String,
      default: "",
      trim: true,
      maxlength: [2000, "Remarks cannot exceed 2000 characters"],
    },
    actionItemsForNextRound: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, "Action items cannot exceed 1000 characters"],
    },
    previousActionItemsStatus: {
      type: String,
      enum: ["RESOLVED", "PARTIAL", "UNADDRESSED", "N/A"],
      default: "N/A",
    },
    evaluatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index for fast lookup of a team evaluation by round and evaluator
evaluationSchema.index({ registrationId: 1, round: 1, evaluatorId: 1 }, { unique: true });

const Evaluation = mongoose.models.Evaluation || mongoose.model("Evaluation", evaluationSchema);
export default Evaluation;
