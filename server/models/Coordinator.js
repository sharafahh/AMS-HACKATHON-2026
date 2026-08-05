import mongoose from "mongoose";

const coordinatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    department: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

const Coordinator = mongoose.model("Coordinator", coordinatorSchema);
export default Coordinator;
