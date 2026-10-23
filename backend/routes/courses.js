import express from "express";
import {
  getCourses,
  getCourse,
  createCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, getCourses);
router.get("/:id", requireAuth, getCourse);
router.post("/", requireAuth, requireAdmin, createCourse);
router.delete("/:id", requireAuth, requireAdmin, deleteCourse);

export default router;