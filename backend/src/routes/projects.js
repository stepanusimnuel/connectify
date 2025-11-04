import express from "express";
import {
  createProject,
  getCompanyProjects,
  updateProjectInfo,
  rejectFreelancer,
  getFreelancerProjects,
  unapplyFreelancerJob,
  getFreelancerWork,
  getFinancialStats,
  completeProject,
  getAllProjects,
  updateProjectStatus,
  deleteJob,
  getProjectById,
  getFreelancerApplicationByJobId,
  applyJob,
} from "../controllers/projectController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* COMPANY */
router.get("/company/:type", getAllProjects);
router.get("/company/all/:companyId", getCompanyProjects);
router.get("/company/:type/:jobId", getProjectById);
router.put("/company/complete/:projectId", completeProject);
router.put("/company/job/:projectId", updateProjectInfo);
router.patch("/company/job/:projectId/status", updateProjectStatus);
router.put("/company/reject/:applicationId", rejectFreelancer);
router.post("/company", createProject);
router.delete("/company/job/:projectId", deleteJob);

/* FREELANCER */
router.get("/freelancer/:freelancerId", getFreelancerProjects);
router.get("/freelancer/job/:jobId", protect, getFreelancerApplicationByJobId);
router.get("/freelancer/:freelancerId/work", getFreelancerWork);
router.post("/freelancer/apply/:jobId", protect, applyJob);
router.delete("/freelancer/job/:jobId/unapply", protect, unapplyFreelancerJob);

router.get("/finance/:userId", getFinancialStats);

export default router;
