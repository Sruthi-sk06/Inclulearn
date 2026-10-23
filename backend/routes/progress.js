import express from "express";
import {
  getProgress,
  markCompleted,
  submitQuiz,
} from "../controllers/progressController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, getProgress);
router.post("/complete", requireAuth, markCompleted);
router.post("/quiz", requireAuth, submitQuiz);

export default router;