import express from "express";
import { adminLogin, getAdminProfile } from "../controllers/adminController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/me", protectAdmin, getAdminProfile);

export default router;
