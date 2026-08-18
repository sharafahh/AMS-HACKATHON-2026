import express from "express";
import { notifyPSRelease, getPSReleaseStatus } from "../controllers/psReleaseController.js";

const router = express.Router();

// Vercel cron invokes GET; client backup trigger uses POST
router.get("/notify", notifyPSRelease);
router.post("/notify", notifyPSRelease);
router.get("/status", getPSReleaseStatus);

export default router;
