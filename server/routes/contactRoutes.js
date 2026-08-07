import express from "express";
import { submitContactForm, getContactMessages } from "../controllers/contactController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public: anyone can submit a contact form
router.post("/", submitContactForm);

// Protected: only admins can view contact messages
router.get("/", protectAdmin, getContactMessages);

export default router;
