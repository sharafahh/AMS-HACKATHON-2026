import Coordinator from "../models/Coordinator.js";

// @desc    Get all active coordinators
// @route   GET /api/admin/coordinators
// @access  Public / Admin
export const getCoordinators = async (req, res) => {
  try {
    const coordinators = await Coordinator.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: coordinators.length, coordinators });
  } catch (err) {
    console.error("Error fetching coordinators:", err.message);
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
    const coordinator = await Coordinator.create({
      name: String(name).trim(),
      department: String(department).trim(),
      phone: String(phone).trim(),
    });
    return res.status(201).json({ success: true, coordinator });
  } catch (err) {
    console.error("Error creating coordinator:", err.message);
    return res.status(500).json({ success: false, message: "Failed to create coordinator" });
  }
};

// @desc    Soft Delete a coordinator
// @route   DELETE /api/admin/coordinators/:id
// @access  Private / Admin
export const deleteCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid coordinator ID format" });
    }

    const coord = await Coordinator.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!coord) {
      return res.status(404).json({ success: false, message: "Coordinator not found" });
    }

    return res.status(200).json({ success: true, message: "Coordinator deleted successfully" });
  } catch (err) {
    console.error("Error deleting coordinator:", err.message);
    return res.status(500).json({ success: false, message: "Failed to delete coordinator" });
  }
};
