import express from "express";
import {
  adminLogin,
  getAdminProfile,
  getRegistrations,
  exportRegistrationsCSV,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import {
  getCoordinators,
  createCoordinator,
  deleteCoordinator,
} from "../controllers/coordinatorController.js";

const router = express.Router();

// Admin Authentication
router.post("/login", adminLogin);
router.get("/me", protectAdmin, getAdminProfile);

// Admin Registrations Management APIs
router.get("/registrations", getRegistrations);
router.get("/registrations/export-csv", exportRegistrationsCSV);
router.get("/export-csv", exportRegistrationsCSV);

// Coordinator Management APIs
router.get("/coordinators", getCoordinators);
router.post("/coordinators", createCoordinator);
router.delete("/coordinators/:id", deleteCoordinator);

export default router;
