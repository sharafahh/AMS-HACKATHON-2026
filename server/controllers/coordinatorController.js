import Coordinator from "../models/Coordinator.js";

// @desc    Get all coordinators
// @route   GET /api/admin/coordinators
// @access  Private / Admin
export const getCoordinators = async (req, res) => {
  try {
    const coordinators = await Coordinator.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, coordinators });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch coordinators" });
  }
};

// @desc    Create a coordinator
// @route   POST /api/admin/coordinators
// @access  Private / Admin
export const createCoordinator = async (req, res) => {
  const { name, department, phone } = req.body;
  if (!name || !department || !phone) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  try {
    const coordinator = await Coordinator.create({ name, department, phone });
    return res.status(201).json({ success: true, coordinator });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to create coordinator" });
  }
};

// @desc    Delete a coordinator
// @route   DELETE /api/admin/coordinators/:id
// @access  Private / Admin
export const deleteCoordinator = async (req, res) => {
  try {
    const coord = await Coordinator.findByIdAndDelete(req.params.id);
    if (!coord) {
      return res.status(404).json({ success: false, message: "Coordinator not found" });
    }
    return res.status(200).json({ success: true, message: "Coordinator deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to delete coordinator" });
  }
};
