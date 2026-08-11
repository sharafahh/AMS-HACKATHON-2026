import express from "express";
import {
  adminLogin,
  getAdminProfile,
  getRegistrations,
  exportRegistrationsCSV,
  getContactMessages,
  deleteContactMessage,
  createManualRegistration,
  updateRegistration,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import { loginRateLimiter } from "../middlewares/rateLimiter.js";
import {
  getCoordinators,
  createCoordinator,
  deleteCoordinator,
} from "../controllers/coordinatorController.js";

const router = express.Router();

// Admin Authentication (public, rate-limited)
router.post("/login", loginRateLimiter, adminLogin);
router.get("/me", protectAdmin, getAdminProfile);

// Admin Registrations Management APIs (ALL PROTECTED)
router.get("/registrations", protectAdmin, getRegistrations);
router.post("/registrations/manual", protectAdmin, createManualRegistration);
router.put("/registrations/:id", protectAdmin, updateRegistration);
router.get("/registrations/export-csv", protectAdmin, exportRegistrationsCSV);
router.get("/export-csv", protectAdmin, exportRegistrationsCSV);

// Contact Desk Inquiries Management APIs (ALL PROTECTED)
router.get("/contact-messages", protectAdmin, getContactMessages);
router.delete("/contact-messages/:id", protectAdmin, deleteContactMessage);

// Coordinator Management APIs (GET is public for frontend display, mutations are protected)
router.get("/coordinators", getCoordinators);
router.post("/coordinators", protectAdmin, createCoordinator);
router.delete("/coordinators/:id", protectAdmin, deleteCoordinator);

export default router;
