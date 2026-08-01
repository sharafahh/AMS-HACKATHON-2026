import express from "express";
import { registerTeam, getTeams, getTeamById } from "../controllers/teamController.js";

const router = express.Router();

router.post("/register", registerTeam);
router.get("/", getTeams);
router.get("/:id", getTeamById);

export default router;
