import express from "express";
import {
  getEvaluatorTeams,
  submitEvaluation,
  getEvaluationLeaderboard,
} from "../controllers/evaluatorController.js";

const router = express.Router();

router.get("/teams", getEvaluatorTeams);
router.post("/evaluate", submitEvaluation);
router.get("/leaderboard", getEvaluationLeaderboard);

export default router;
