import { Router } from "express";
import { getTeamSelection, selectProblem } from "../controllers/psSelectionController.js";

const router = Router();

// Participant problem-statement selection
router.get("/:registrationId", getTeamSelection);
router.post("/select", selectProblem);

export default router;
