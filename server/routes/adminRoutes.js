import express from "express";
import {
  adminLogin,
  getAdminProfile,
  getRegistrations,
  exportRegistrationsCSV,
  getContactMessages,
  deleteContactMessage,
  createManualRegistration,
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
router.post("/registrations/manual", createManualRegistration);
router.get("/registrations/export-csv", exportRegistrationsCSV);
router.get("/export-csv", exportRegistrationsCSV);

// Contact Desk Inquiries Management APIs
router.get("/contact-messages", getContactMessages);
router.delete("/contact-messages/:id", deleteContactMessage);

// Coordinator Management APIs
router.get("/coordinators", getCoordinators);
router.post("/coordinators", createCoordinator);
router.delete("/coordinators/:id", deleteCoordinator);

export default router;
