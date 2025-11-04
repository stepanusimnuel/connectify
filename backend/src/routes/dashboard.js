import express from "express";
import { getDashboardSummary, getHeroProject, getTopJobs } from "../controllers/dashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/summary", protect, getDashboardSummary);
router.get("/hero", protect, getHeroProject);
router.get("/top-jobs", protect, getTopJobs);

export default router;
