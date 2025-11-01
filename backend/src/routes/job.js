import express from "express";
import { getCompanyJobs, getFreelancerApplications, getAllJobs } from "../controllers/jobController.js";
import { protect, protectCompany, protectFreelancer } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllJobs);
router.get("/my-projects", protect, protectCompany, getCompanyJobs);
router.get("/my-applications", protect, protectFreelancer, getFreelancerApplications);

export default router;
