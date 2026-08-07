import mongoose from "mongoose";

const coordinatorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coordinator name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: function (v) {
          const digits = String(v).replace(/\D/g, "");
          return digits.length >= 7 && digits.length <= 15;
        },
        message: "Phone number must contain 7-15 digits",
      },
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

coordinatorSchema.index({ isDeleted: 1, department: 1, name: 1 });

const Coordinator = mongoose.models.Coordinator || mongoose.model("Coordinator", coordinatorSchema);
export default Coordinator;
