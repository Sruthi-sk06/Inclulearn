import express from "express";
import { updateDisability } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.put("/disability", requireAuth, updateDisability);

export default router;