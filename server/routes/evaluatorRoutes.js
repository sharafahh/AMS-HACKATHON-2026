import express from "express";
import {
  getEvaluatorTeams,
  submitEvaluation,
  getEvaluationLeaderboard,
  seedSampleTeams,
} from "../controllers/evaluatorController.js";

const router = express.Router();

router.get("/teams", getEvaluatorTeams);
router.post("/evaluate", submitEvaluation);
router.get("/leaderboard", getEvaluationLeaderboard);
router.post("/seed-teams", seedSampleTeams);

export default router;
