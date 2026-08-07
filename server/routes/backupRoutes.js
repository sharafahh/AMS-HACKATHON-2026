import express from "express";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import {
  getBackupHistory,
  createBackup,
  downloadBackup,
} from "../controllers/backupController.js";

const router = express.Router();

// All backup routes require Admin authentication
router.use(protectAdmin);

router.get("/", getBackupHistory);
router.post("/", createBackup);
router.get("/download/:filename", downloadBackup);

export default router;
